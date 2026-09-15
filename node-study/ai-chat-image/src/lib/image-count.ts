/** 单次请求最多返回的图片数量；同时作为方舟模型的 maxImagesPerCall，两者必须一致 */
export const MAX_IMAGE_COUNT = 4;

export function normalizeImageCount(count?: number) {
  if (!count || !Number.isFinite(count)) return 1;
  return Math.min(Math.max(Math.floor(count), 1), MAX_IMAGE_COUNT);
}

const CHINESE_DIGITS: Record<string, number> = {
  零: 0,
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
};

/** 可识别的数字：阿拉伯数字 1-3 位，或「三」「十」「十二」「二十五」这类中文数字 */
const NUMBER = String.raw`\d{1,3}|[一二两三四五六七八九]?十[一二三四五六七八九]?|[零一二两三四五六七八九]`;
/** 「第一张」「这两张」「同一张」「每 3 张」是在排序或指代已有图片，不是在要求张数 */
const NOT_ORDINAL = String.raw`(?<![第每另这那哪某前上后同中其])`;
/**
 * 「图案」「图标」「图层」这类词里的「图」是画面元素而不是图片（「加一个图案」≠「加一张图」），
 * 所以「图」后面跟着这些字时不算图片，避免把画面元素的数量误判成张数。
 */
const ELEMENT_NOUN_TAIL = String.raw`案|标|层|形|例|纸|样|表|鉴|库|集|腾|书|解|谱|章|钉`;
/** 图片名词：图 / 图片 / 照片 */
const IMAGE_NOUN = String.raw`图(?!${ELEMENT_NOUN_TAIL})|照片`;
/** 只靠「N 个」判断时的同类守卫：「两个图案」数的是画面元素，不是两张图 */
const NOT_ELEMENT_NOUN = String.raw`(?!图(?:${ELEMENT_NOUN_TAIL}))`;

/**
 * 张数候选按量词与名词的可信度分级，数字越大越可信：
 * 「张 / 幅」是图片量词，「图 / 图片 / 照片」是图片名词，两者兼备最可信；
 * 只具备其中一者（如「两张不同风格」「3 个图」）次之；
 * 「个」只是通用量词，常用来数画面元素（如「增加一个宠物精灵」），所以放在最后。
 */
const COUNT_PATTERNS: readonly { rank: number; pattern: RegExp }[] = [
  // 「三张图」「2 幅图片」「4 张照片」：图片量词 + 图片名词，最明确的张数写法
  {
    rank: 3,
    pattern: new RegExp(`${NOT_ORDINAL}(${NUMBER})\\s*(?:张|幅)\\s*(?:${IMAGE_NOUN})`, "g"),
  },
  // 「3 images」「2 photos」
  { rank: 3, pattern: new RegExp(`${NOT_ORDINAL}(\\d{1,3})\\s*(?:images?|pictures?|photos?)`, "gi") },
  // 「两张不同风格」：张 / 幅 本身就是图片量词，后面不一定带「图」
  { rank: 2, pattern: new RegExp(`${NOT_ORDINAL}(${NUMBER})\\s*(?:张|幅)`, "g") },
  // 「画 3 个图」：只带图片名词，没有图片量词
  { rank: 2, pattern: new RegExp(`${NOT_ORDINAL}(${NUMBER})\\s*(?:个)?\\s*(?:${IMAGE_NOUN})`, "g") },
  // 「画 3 个」：既没有图片量词也没有图片名词，只在没有更明确的张数时才采用
  {
    rank: 1,
    pattern: new RegExp(`${NOT_ORDINAL}(${NUMBER})\\s*个${NOT_ELEMENT_NOUN}`, "g"),
  },
];

/** 解析候选数字，无法识别时返回 undefined */
function toNumber(token: string): number | undefined {
  if (/^\d+$/.test(token)) return Number(token);

  const tenIndex = token.indexOf("十");
  if (tenIndex === -1) return CHINESE_DIGITS[token];

  const tens = tenIndex === 0 ? 1 : CHINESE_DIGITS[token[tenIndex - 1]];
  const rest = token.slice(tenIndex + 1);
  const ones = rest ? CHINESE_DIGITS[rest] : 0;
  if (tens === undefined || ones === undefined) return undefined;
  return tens * 10 + ones;
}

/**
 * 从提示词里解析期望生成的图片数量：如「生成 3 张」「画四张图」「两张不同风格」「2 images」。
 *
 * 提示词里经常夹着描述画面元素的数量（如「两张不同风格，标记位置加一个图案」），
 * 因此先按量词 / 名词的可信度挑候选（「张 / 幅」+「图 / 图片 / 照片」> 只有量词或只有名词 >
 * 单独的「个」），同级候选取较大值——较小的数字通常是在修饰画面元素，而不是在要求张数。
 * 未命中或不是有效数量时返回 undefined；超出上限时按上限截断。
 *
 * 解析只是尽量猜对：画图模式的张数选择器会把结果显示出来，并允许手动指定。
 */
export function parseImageCount(prompt?: string): number | undefined {
  const text = prompt?.trim();
  if (!text) return undefined;

  let best: { count: number; rank: number } | undefined;
  for (const { rank, pattern } of COUNT_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const count = toNumber(match[1]);
      if (!count || count < 1) continue;
      if (!best || rank > best.rank || (rank === best.rank && count > best.count)) {
        best = { count, rank };
      }
    }
  }

  return best ? Math.min(best.count, MAX_IMAGE_COUNT) : undefined;
}
