/** 图片宽高比选项，value 会随请求发送给服务端 */
export const IMAGE_ASPECT_RATIOS = [
  { label: "1:1", value: "1:1", width: 1, height: 1 },
  { label: "4:3", value: "4:3", width: 4, height: 3 },
  { label: "3:4", value: "3:4", width: 3, height: 4 },
  { label: "16:9", value: "16:9", width: 16, height: 9 },
  { label: "9:16", value: "9:16", width: 9, height: 16 },
] as const;

/** 图片分辨率档位，longEdge 为生成图长边的像素数 */
export const IMAGE_RESOLUTIONS = [
  { label: "2K", value: "2k", longEdge: 2048 },
  { label: "4K", value: "4k", longEdge: 4096 },
] as const;

export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number]["value"];
export type ImageResolution = (typeof IMAGE_RESOLUTIONS)[number]["value"];

/**
 * 尺寸模式「跟随参考图」：有参考图时沿用参考图宽高（超出模型允许范围时等比缩放），
 * 没有参考图时回退到默认宽高比与分辨率。
 */
export const REFERENCE_SIZE_MODE = "reference";

/** 尺寸选择：跟随参考图，或某个具体宽高比 */
export type ImageSizeChoice = ImageAspectRatio | typeof REFERENCE_SIZE_MODE;

export const DEFAULT_ASPECT_RATIO: ImageAspectRatio = IMAGE_ASPECT_RATIOS[0].value;
export const DEFAULT_RESOLUTION: ImageResolution = IMAGE_RESOLUTIONS[0].value;

/** 生成图的边长范围与步长：方舟按「宽x高」接收，宽高需为 8 的倍数 */
export const MIN_IMAGE_EDGE = 512;
export const MAX_IMAGE_EDGE = 4096;
const EDGE_STEP = 8;

export function parseAspectRatio(value: unknown): ImageAspectRatio | undefined {
  return IMAGE_ASPECT_RATIOS.find((item) => item.value === value)?.value;
}

export function parseResolution(value: unknown): ImageResolution | undefined {
  return IMAGE_RESOLUTIONS.find((item) => item.value === value)?.value;
}

export function isReferenceSizeMode(value: unknown): boolean {
  return value === REFERENCE_SIZE_MODE;
}

function toEdge(value: number) {
  const stepped = Math.round(value / EDGE_STEP) * EDGE_STEP;
  return Math.min(Math.max(stepped, MIN_IMAGE_EDGE), MAX_IMAGE_EDGE);
}

/**
 * 参考图尺寸 → 生成尺寸：能原样沿用就原样沿用（对齐到 8 的倍数），
 * 长边超过上限时等比缩小，短边低于下限时等比放大，保证长宽比不变。
 * 极端比例（缩放后仍越界）下两边各自夹到范围内，此时尺寸会有偏差。
 * 宽高非法（非正数 / 非有限数）时返回 undefined，由调用方回退到宽高比 + 分辨率。
 */
export function resolveReferenceSize(
  width: number,
  height: number,
): { width: number; height: number } | undefined {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined;
  }

  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);
  let scale = Math.min(1, MAX_IMAGE_EDGE / longEdge);
  if (shortEdge * scale < MIN_IMAGE_EDGE) scale = MIN_IMAGE_EDGE / shortEdge;

  return { width: toEdge(width * scale), height: toEdge(height * scale) };
}

/**
 * 由分辨率（长边像素）与宽高比推算具体宽高，短边取 8 的倍数以兼容模型要求。
 * 例如 4:3 + 2K → 2048×1536，9:16 + 4K → 2304×4096。
 */
export function resolveImageSize(
  aspectRatio: ImageAspectRatio,
  resolution: ImageResolution,
): { width: number; height: number } {
  const ratio = IMAGE_ASPECT_RATIOS.find((item) => item.value === aspectRatio);
  const tier = IMAGE_RESOLUTIONS.find((item) => item.value === resolution);
  const longEdge = tier?.longEdge ?? IMAGE_RESOLUTIONS[0].longEdge;
  const ratioWidth = ratio?.width ?? 1;
  const ratioHeight = ratio?.height ?? 1;
  const shortEdge =
    Math.round((longEdge * Math.min(ratioWidth, ratioHeight)) / Math.max(ratioWidth, ratioHeight) / 8) * 8;
  return ratioWidth >= ratioHeight
    ? { width: longEdge, height: shortEdge }
    : { width: shortEdge, height: longEdge };
}
