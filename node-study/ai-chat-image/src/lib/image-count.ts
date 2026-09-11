/** 单次请求最多返回的图片数量 */
export const MAX_IMAGE_COUNT = 4;

export function normalizeImageCount(count?: number) {
  if (!count || !Number.isFinite(count)) return 1;
  return Math.min(Math.max(Math.floor(count), 1), MAX_IMAGE_COUNT);
}

const CHINESE_DIGITS: Record<string, number> = {
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
};

const ARABIC_PATTERN = /(\d{1,3})\s*(?:张|幅|个)(?:图|图片)?/;
const CHINESE_PATTERN = /([一二两三四五六七八九十])\s*(?:张|幅|个)(?:图|图片)?/;
const ENGLISH_PATTERN = /(\d{1,3})\s*(?:images?|pictures?|photos?)/i;

/**
 * 从提示词里解析期望生成的图片数量：如「生成 3 张」「画四张图」「2 images」。
 * 未命中或不是有效数量时返回 undefined；超出上限时按上限截断。
 */
export function parseImageCount(prompt?: string): number | undefined {
  const text = prompt?.trim();
  if (!text) return undefined;

  const match =
    ARABIC_PATTERN.exec(text) ?? CHINESE_PATTERN.exec(text) ?? ENGLISH_PATTERN.exec(text);
  if (!match) return undefined;

  const value = /^\d+$/.test(match[1]) ? Number(match[1]) : CHINESE_DIGITS[match[1]];
  if (!value || value < 1) return undefined;
  return Math.min(value, MAX_IMAGE_COUNT);
}
