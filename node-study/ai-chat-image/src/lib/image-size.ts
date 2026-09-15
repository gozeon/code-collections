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

export const DEFAULT_ASPECT_RATIO: ImageAspectRatio = IMAGE_ASPECT_RATIOS[0].value;
export const DEFAULT_RESOLUTION: ImageResolution = IMAGE_RESOLUTIONS[0].value;

export function parseAspectRatio(value: unknown): ImageAspectRatio | undefined {
  return IMAGE_ASPECT_RATIOS.find((item) => item.value === value)?.value;
}

export function parseResolution(value: unknown): ImageResolution | undefined {
  return IMAGE_RESOLUTIONS.find((item) => item.value === value)?.value;
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
