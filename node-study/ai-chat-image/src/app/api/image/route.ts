import { normalizeImageCount, parseImageCount } from "@/lib/image-count";
import {
  generateJimengImages,
  JimengError,
  resolveJimengConfig,
  type JimengOverrides,
} from "@/lib/jimeng";

export const runtime = "nodejs";
export const maxDuration = 120;

/** 尺寸格式：宽x高，宽高需为 8 的倍数 */
const SIZE_PATTERN = /^(\d{3,5})x(\d{3,5})$/;

type ImageRequestBody = {
  prompt?: string;
  images?: string[];
  /** 期望返回的图片数量，1-4；不传时从提示词里解析（如「生成 4 张」） */
  count?: number;
  size?: string;
  seed?: number;
  scale?: number;
  usePreLlm?: boolean;
  watermark?: boolean;
  jimeng?: JimengOverrides;
};

function parseSize(size?: string) {
  const match = SIZE_PATTERN.exec(size?.trim() ?? "");
  if (!match) return {};
  const width = Math.min(Math.max(Number(match[1]), 512), 4096);
  const height = Math.min(Math.max(Number(match[2]), 512), 4096);
  return { width, height };
}

export async function POST(req: Request) {
  let body: ImageRequestBody;
  try {
    body = (await req.json()) as ImageRequestBody;
  } catch {
    return Response.json({ error: "请求体不是合法的 JSON。" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) return Response.json({ error: "请输入提示词。" }, { status: 400 });

  const images = (body.images ?? [])
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .slice(0, 4);

  try {
    const config = resolveJimengConfig(body.jimeng);
    const result = await generateJimengImages(config, {
      prompt,
      images,
      count: normalizeImageCount(body.count ?? parseImageCount(prompt)),
      ...parseSize(body.size),
      seed: body.seed,
      scale: body.scale,
      usePreLlm: body.usePreLlm,
      watermark: body.watermark,
    });
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
