import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";

import { normalizeImageCount, parseImageCount } from "@/lib/image-count";
import {
  DEFAULT_ASPECT_RATIO,
  DEFAULT_RESOLUTION,
  parseAspectRatio,
  parseResolution,
  resolveImageSize,
} from "@/lib/image-size";
import {
  generateJimengImages,
  JimengError,
  resolveJimengConfig,
  streamJimengImages,
  type JimengConfig,
  type JimengImageParams,
  type JimengOverrides,
} from "@/lib/jimeng";

export const runtime = "nodejs";
export const maxDuration = 120;

/** 尺寸格式：宽x高，宽高需为 8 的倍数 */
const SIZE_PATTERN = /^(\d{3,5})x(\d{3,5})$/;

type ImageRequestBody = {
  /** 与 /api/chat 一致的消息数组，提示词与参考图取自最后一条用户消息 */
  messages?: UIMessage[];
  prompt?: string;
  images?: string[];
  /** 期望返回的图片数量，1-4；不传时从提示词里解析（如「生成 4 张」） */
  count?: number;
  /** 宽高比（如 "16:9"），与分辨率档位一起推算生成宽高 */
  aspectRatio?: string;
  /** 分辨率档位："2k" 或 "4k" */
  resolution?: string;
  /** 旧版直接指定的宽x高，优先级低于宽高比 + 分辨率 */
  size?: string;
  seed?: number;
  watermark?: boolean;
  /** 以 UI 消息流（SSE）返回生成进度，与聊天接口同协议，供前端 useChat 消费 */
  stream?: boolean;
  jimeng?: JimengOverrides;
};

/** 优先按宽高比 + 分辨率推算宽高；都没有时兼容旧版 size 入参 */
function resolveDimensions(body: ImageRequestBody) {
  const aspectRatio = parseAspectRatio(body.aspectRatio);
  const resolution = parseResolution(body.resolution);
  if (aspectRatio || resolution) {
    return resolveImageSize(aspectRatio ?? DEFAULT_ASPECT_RATIO, resolution ?? DEFAULT_RESOLUTION);
  }
  return parseSize(body.size);
}

function parseSize(size?: string) {
  const match = SIZE_PATTERN.exec(size?.trim() ?? "");
  if (!match) return {};
  const width = Math.min(Math.max(Number(match[1]), 512), 4096);
  const height = Math.min(Math.max(Number(match[2]), 512), 4096);
  return { width, height };
}

/** 生成结果都是 data URL，取出其中的 media type 供消息 part 使用 */
function mediaTypeOf(url: string) {
  return /^data:([^;,]+)/.exec(url)?.[1] ?? "image/png";
}

/** 从最后一条用户消息中提取提示词与参考图（与聊天接口共用同一套消息格式） */
function fromMessages(messages: UIMessage[] = []) {
  const last = [...messages].reverse().find((message) => message.role === "user");
  const texts: string[] = [];
  const images: string[] = [];

  for (const part of last?.parts ?? []) {
    if (part.type === "text") texts.push(part.text);
    else if (part.type === "file" && part.mediaType.startsWith("image/")) images.push(part.url);
  }

  return { prompt: texts.join("\n").trim(), images };
}

export async function POST(req: Request) {
  let body: ImageRequestBody;
  try {
    body = (await req.json()) as ImageRequestBody;
  } catch {
    return Response.json({ error: "请求体不是合法的 JSON。" }, { status: 400 });
  }

  const stream = body.stream === true;
  /** 流式请求同样返回 200，错误作为流内事件下发，前端与聊天模式统一处理 */
  const fail = (message: string) =>
    stream ? errorResponse(message) : Response.json({ error: message }, { status: 400 });

  const derived = fromMessages(body.messages);
  const prompt = body.prompt?.trim() || derived.prompt;
  if (!prompt) return fail("请输入提示词。");

  const images = (body.images ?? derived.images)
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .slice(0, 4);

  const params: JimengImageParams = {
    prompt,
    images,
    count: normalizeImageCount(body.count ?? parseImageCount(prompt)),
    ...resolveDimensions(body),
    seed: body.seed,
    watermark: body.watermark,
  };

  let config: JimengConfig;
  try {
    config = resolveJimengConfig(body.jimeng);
  } catch (error) {
    if (error instanceof JimengError) return fail(error.message);
    throw error;
  }

  if (stream) return streamResponse(config, params, req.signal);

  try {
    const result = await generateJimengImages(config, params);
    return Response.json(result);
  } catch (error) {
    if (error instanceof JimengError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("[api/image] 图片生成失败", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "图片生成失败，请稍后重试。" },
      { status: 500 },
    );
  }
}

/** 只有一条 error 事件的 UI 消息流，用于把校验错误交给前端的 useChat */
function errorResponse(message: string) {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: "error", errorText: message });
      },
    }),
  });
}

/**
 * 以 UI 消息流返回生成进度：单张图优先走方舟的流式输出，每个快照到达时先清掉上一帧
 * （reset-step）再写入最新一帧，图片便由模糊到清晰实时刷新；多张图（sequential_image_generation）
 * 与流式不可用的模型（不支持或没有返回图片）则在 streamJimengImages 里回退一次性返回全部结果。
 */
function streamResponse(config: JimengConfig, params: JimengImageParams, signal: AbortSignal) {
  const abort = new AbortController();
  signal.addEventListener("abort", () => abort.abort(), { once: true });

  const settings = { ...params, abortSignal: abort.signal };

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      onError: (error) => (error instanceof Error ? error.message : "图片生成失败，请稍后重试。"),
      execute: async ({ writer }) => {
        const snapshots: string[] = [];
        const writeSnapshots = () => {
          const images = snapshots.filter(Boolean);
          if (images.length === 0) return;
          writer.write({ type: "reset-step" });
          for (const image of images) {
            writer.write({ type: "file", mediaType: mediaTypeOf(image), url: image });
          }
        };

        try {
          if ((settings.count ?? 1) === 1) {
            for await (const chunks of streamJimengImages(config, settings)) {
              for (const chunk of chunks) snapshots[chunk.index] = chunk.image;
              writeSnapshots();
            }
          } else {
            const result = await generateJimengImages(config, settings);
            result.images.forEach((image, index) => {
              snapshots[index] = image;
            });
            writeSnapshots();
          }

          if (snapshots.filter(Boolean).length === 0) {
            throw new JimengError("接口没有返回图片，请稍后重试。", 502);
          }
        } catch (error) {
          // 用户点「停止」或关闭页面时会中断请求，此时无需再下发错误事件
          if (abort.signal.aborted) return;
          throw error;
        }
      },
    }),
  });
}
