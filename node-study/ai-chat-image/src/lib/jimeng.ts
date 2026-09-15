import { APICallError } from "@ai-sdk/provider";
import { generateImage, NoImageGeneratedError, RetryError } from "ai";

import { arkImageModel } from "./ark-image-model";
import { normalizeImageCount } from "./image-count";

/** 生成模式：文生图 / 图生图 */
export type JimengMode = "text2image" | "image2image";

export type JimengImageParams = {
  /** 提示词：文生图为画面描述，图生图为修改指令 */
  prompt: string;
  /** 参考图（图生图 / 图片修改），支持公网 URL 或 data URL（base64） */
  images?: string[];
  /** 期望返回的图片数量，1-4；方舟通过 sequential_image_generation 一次生成多张 */
  count?: number;
  width?: number;
  height?: number;
  seed?: number;
  /** 是否添加水印，默认不添加 */
  watermark?: boolean;
  /** 中断请求（用户点「停止」或客户端断开时） */
  abortSignal?: AbortSignal;
};

/** 可由前端本地设置覆盖的方舟配置 */
export type JimengOverrides = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

export type JimengConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export class JimengError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "JimengError";
    this.status = status;
  }
}

/** 火山方舟（OpenAI 兼容）默认配置 */
export const DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";
export const DEFAULT_ARK_MODEL = "doubao-seedream-4-0-250828";

function pick(...values: (string | undefined)[]) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

/** 合并本地设置与服务端环境变量，方舟使用 API Key（OpenAI 兼容）鉴权 */
export function resolveJimengConfig(overrides: JimengOverrides = {}): JimengConfig {
  const apiKey = pick(overrides.apiKey, process.env.JIMENG_API_KEY);
  if (!apiKey) {
    throw new JimengError(
      "未配置即梦接口凭证：请设置 JIMENG_API_KEY（火山方舟 API Key），也可在页面「接口设置」中填写。",
      400,
    );
  }

  return {
    apiKey,
    baseUrl: pick(overrides.baseUrl, process.env.JIMENG_BASE_URL) || DEFAULT_ARK_BASE_URL,
    model: pick(overrides.model, process.env.JIMENG_MODEL) || DEFAULT_ARK_MODEL,
  };
}

export type JimengImageResult = {
  images: string[];
  mode: JimengMode;
};

/** 文生图 / 图生图统一入口，返回可直接展示的 base64 data URL */
export async function generateJimengImages(
  config: JimengConfig,
  params: JimengImageParams,
): Promise<JimengImageResult> {
  const prompt = params.prompt.trim();
  if (!prompt) throw new JimengError("提示词不能为空。", 400);

  const images = (params.images ?? []).map((item) => item.trim()).filter(Boolean);
  const mode: JimengMode = images.length > 0 ? "image2image" : "text2image";
  const count = normalizeImageCount(params.count);

  const generated = await generateWithArk(config, { ...params, prompt, count }, images);

  return { images: generated, mode };
}

/* ------------------------------- 火山方舟 -------------------------------- */

/** AI SDK / 方舟抛出的错误统一转换成带 HTTP 状态的 JimengError */
function toJimengError(error: unknown): JimengError {
  if (error instanceof JimengError) return error;
  if (RetryError.isInstance(error)) return toJimengError(error.lastError);
  if (APICallError.isInstance(error)) {
    const detail = error.message || error.responseBody || "接口调用失败";
    return new JimengError(
      `即梦（方舟）接口调用失败：${detail}`,
      error.statusCode !== undefined && error.statusCode < 500 ? 400 : 502,
    );
  }
  if (NoImageGeneratedError.isInstance(error)) {
    return new JimengError("即梦（方舟）接口未返回图片，请稍后重试或检查模型配置。", 502);
  }
  return new JimengError(`无法访问即梦（方舟）接口：${error instanceof Error ? error.message : "网络错误"}`, 502);
}

/** 通过 AI SDK 的 generateImage 调用火山方舟（OpenAI 兼容）图片接口 */
async function generateWithArk(
  config: JimengConfig,
  params: JimengImageParams,
  images: string[],
): Promise<string[]> {
  try {
    const { images: generated } = await generateImage({
      model: arkImageModel(config),
      // 有参考图时按图生图（图片修改）调用，参考图以 data URL 数组传给方舟
      prompt: images.length > 0 ? { images, text: params.prompt } : params.prompt,
      size: params.width && params.height ? `${params.width}x${params.height}` : undefined,
      seed: params.seed !== undefined && params.seed >= 0 ? params.seed : undefined,
      n: params.count ?? 1,
      abortSignal: params.abortSignal,
      providerOptions: { ark: { watermark: params.watermark ?? false } },
    });

    return generated.map((image) => `data:${image.mediaType};base64,${image.base64}`);
  } catch (error) {
    throw toJimengError(error);
  }
}

/* ----------------------------- 方舟流式输出 ------------------------------ */

/** 流式生成的增量图片：`index` 为图片序号，`image` 为该序号当前的快照 */
export type JimengImageChunk = {
  index: number;
  image: string;
};

/** 方舟流式返回的单张图片：渐进式快照与最终图片都放在这里 */
type ArkImageStreamItem = {
  b64_json?: string;
  url?: string;
  index?: number;
  /** 少数 OpenAI 兼容网关用这两个字段返回渐进式快照 */
  partial_image_b64?: string;
  partial_image_index?: number;
  /** 图片媒体类型，缺省时按 base64 头部推断 */
  media_type?: string;
};

/**
 * 方舟流式返回的单条事件：`data[].b64_json` 为当前进度的快照，最后一帧为完整图片。
 * 同时兼容图片放在 `images`、顶层字段或直接以数组返回的写法。
 */
type ArkImageStreamPayload = ArkImageStreamItem & {
  data?: ArkImageStreamItem | ArkImageStreamItem[] | null;
  images?: ArkImageStreamItem | ArkImageStreamItem[] | null;
  error?: { message?: string } | null;
  message?: string;
};

/** 上游不支持流式时退回一次性生成；非 5xx 的调用失败在上面已统一归成 400 */
const STREAM_UNSUPPORTED_STATUSES = new Set([400, 404, 405, 501]);

/** 按 base64 头部推断媒体类型（JPEG 的渐进式快照很常见），无法判断时按 PNG 处理 */
function sniffMediaType(base64: string) {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "image/png";
}

/** 方舟返回 base64 或公网 URL，统一包装成前端可直接展示的图片来源 */
function toImageSource(value: string, mediaType?: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("data:") || /^https?:\/\//i.test(trimmed)) return trimmed;
  // base64 里可能夹带换行（MIME 风格），拼进 data URL 前先去掉
  const base64 = trimmed.replace(/\s+/g, "");
  return `data:${mediaType || sniffMediaType(base64)};base64,${base64}`;
}

function toStreamItems(value: ArkImageStreamItem | ArkImageStreamItem[] | null | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** 从一条流式事件里取出图片快照；接口报错时转成带提示的 JimengError */
function chunksFromPayload(payload: ArkImageStreamPayload): JimengImageChunk[] {
  const message = payload.error?.message || payload.message;
  if (message) throw new JimengError(`即梦（方舟）接口调用失败：${message}`, 502);

  const items = [
    ...toStreamItems(payload.data),
    ...toStreamItems(payload.images),
    // 少数网关把图片直接放在顶层
    ...(payload.b64_json || payload.partial_image_b64 || payload.url ? [payload] : []),
  ];

  return items.flatMap((item, position) => {
    const base64 = item.b64_json || item.partial_image_b64 || "";
    const image = base64
      ? toImageSource(base64, item.media_type)
      : item.url
        ? toImageSource(item.url)
        : "";
    if (!image) return [];
    return [{ index: item.index ?? item.partial_image_index ?? position, image }];
  });
}

/** 解析不出完整对象时返回 undefined，交由调用方继续缓存拼接 */
function tryParsePayload(text: string): ArkImageStreamPayload | undefined {
  try {
    const parsed = JSON.parse(text) as ArkImageStreamPayload | ArkImageStreamPayload[];
    if (Array.isArray(parsed)) return { data: parsed };
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * 增量解析方舟的流式响应，兼容两种写法：
 * 1. SSE：`data: {...}`，同一事件的多个 data 行按换行拼接，空行表示事件结束；
 * 2. 逐行 JSON（JSON Lines）：每行一个完整的 JSON 对象。
 * 单行解析不出完整对象时（跨行或格式化输出）先缓存，等后续片段拼齐再解析，不会静默丢数据。
 */
class ArkImageStreamParser {
  private pending = "";
  private parts: string[] = [];

  /** 追加一段响应文本，返回其中解析出的图片快照 */
  push(text: string) {
    this.pending += text;
    const chunks: JimengImageChunk[] = [];
    for (;;) {
      const end = this.pending.indexOf("\n");
      if (end < 0) break;
      chunks.push(...this.consume(this.pending.slice(0, end)));
      this.pending = this.pending.slice(end + 1);
    }
    return chunks;
  }

  /** 响应结束：处理最后一段可能没有换行符的文本 */
  flush() {
    const rest = this.pending;
    this.pending = "";
    return [...(rest.trim() ? this.consume(rest) : []), ...this.drain()];
  }

  private consume(rawLine: string): JimengImageChunk[] {
    const line = rawLine.trim();
    // 空行表示一个 SSE 事件结束
    if (!line) return this.drain();

    const payload = line.startsWith("data:")
      ? line.slice("data:".length).trim()
      : // 正在拼接跨行 JSON 时，任何一行都可能是它的后续片段
        this.parts.length > 0
        ? line
        : line.startsWith("{") || line.startsWith("[")
          ? line
          : "";
    if (!payload || payload === "[DONE]") return [];

    // 完整的一行优先独立解析，避免把上一条残缺数据和新事件混在一起
    const parsed = tryParsePayload(payload);
    if (parsed !== undefined) {
      const buffered = this.drain();
      return [...buffered, ...chunksFromPayload(parsed)];
    }

    // 解析不出完整对象：可能是跨行 / 格式化输出的 JSON，先缓存再拼
    this.parts.push(payload);
    const joined = tryParsePayload(this.parts.join("\n"));
    if (joined === undefined) return [];
    this.parts = [];
    return chunksFromPayload(joined);
  }

  /** 解析缓存中等待拼接的 JSON；仍解析不出就丢弃，避免脏数据越积越多 */
  private drain(): JimengImageChunk[] {
    if (this.parts.length === 0) return [];
    const joined = tryParsePayload(this.parts.join("\n"));
    this.parts = [];
    return joined === undefined ? [] : chunksFromPayload(joined);
  }
}

async function readArkErrorMessage(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return `HTTP ${response.status}`;
  try {
    const parsed = JSON.parse(text) as ArkImageStreamPayload;
    return parsed.error?.message || parsed.message || text;
  } catch {
    return text;
  }
}

/** 直连方舟的 OpenAI 兼容接口并开启 `stream`，逐条产出图片快照 */
async function* streamArkImages(
  config: JimengConfig,
  params: JimengImageParams,
  images: string[],
): AsyncGenerator<JimengImageChunk[]> {
  const body: Record<string, unknown> = {
    model: config.model,
    prompt: params.prompt,
    response_format: "b64_json",
    watermark: params.watermark ?? false,
    // 流式输出（部分模型支持）：返回同一张图的渐进式快照
    stream: true,
  };
  if (params.width && params.height) body.size = `${params.width}x${params.height}`;
  if (params.seed !== undefined && params.seed >= 0) body.seed = params.seed;
  if (images.length > 0) body.image = images;

  const response = await fetch(`${config.baseUrl.replace(/\/+$/, "")}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify(body),
    signal: params.abortSignal,
  });

  if (!response.ok || !response.body) {
    const detail = await readArkErrorMessage(response);
    throw new JimengError(
      `即梦（方舟）接口调用失败：${detail}`,
      response.status < 500 ? 400 : 502,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parser = new ArkImageStreamParser();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunks = parser.push(decoder.decode(value, { stream: true }));
      if (chunks.length > 0) yield chunks;
    }
    // 收尾：冲掉解码器与解析器里剩下的最后一段数据（最后一个事件可能没有空行结尾）
    const rest = [...parser.push(decoder.decode()), ...parser.flush()];
    if (rest.length > 0) yield rest;
  } finally {
    await reader.cancel().catch(() => {});
  }
}

/**
 * 流式生成图片：优先走方舟的 `stream=true`，把渐进式快照逐帧交给调用方。
 * 流式只是增量体验，接口不支持流式（400/404/405/501）或整条流一张图都没返回时，
 * 自动退回一次性生成，避免「接口不支持流式」直接变成生成失败。
 */
export async function* streamJimengImages(
  config: JimengConfig,
  params: JimengImageParams,
): AsyncGenerator<JimengImageChunk[]> {
  const prompt = params.prompt.trim();
  if (!prompt) throw new JimengError("提示词不能为空。", 400);

  const images = (params.images ?? []).map((item) => item.trim()).filter(Boolean);
  const streamParams = { ...params, prompt };

  let streamed = 0;
  let fallbackReason = "流式接口没有返回图片";
  try {
    for await (const chunks of streamArkImages(config, streamParams, images)) {
      streamed += chunks.length;
      yield chunks;
    }
  } catch (error) {
    // 用户中断或已经下发过快照时保持现状，既不吞掉错误也不重复生成
    if (streamParams.abortSignal?.aborted || streamed > 0) throw error;
    if (!(error instanceof JimengError) || !STREAM_UNSUPPORTED_STATUSES.has(error.status)) {
      throw error;
    }
    // 接口不支持流式：继续往下走一次性生成
    fallbackReason = `流式接口不可用（${error.message}）`;
  }

  if (streamed > 0) return;

  console.warn(`[jimeng] ${fallbackReason}，已回退到一次性生成`);
  const generated = await generateWithArk(config, streamParams, images);
  yield generated.map((image, index) => ({ index, image }));
}
