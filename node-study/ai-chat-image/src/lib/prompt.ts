/** 低于这个长度的文本不足以当成提示词（多半是追问、客套话或半句话），不提供快捷操作 */
const MIN_IMAGE_PROMPT_LENGTH = 20;

/** 明确的提示词标签：出现在块首时才视为提示词的开始 */
const LABELED_PROMPT =
  /^(?:#{1,6}\s*)?(?:[-*+]\s*)?(?:\*\*|__)?\s*(?:成品提示词|最终提示词|优化后的提示词|生图提示词|画图提示词|图片提示词)\s*(?:\*\*|__)?\s*[:：]?[ \t]*/i;

/** 泛用标签（「提示词」「Prompt」）必须带冒号，否则「提示词建议」这类正文会被当成小标题 */
const GENERIC_PROMPT_LABEL =
  /^(?:#{1,6}\s*)?(?:\*\*|__)?\s*(?:提示词|prompt)\s*(?:\*\*|__)?\s*[:：][ \t]*/i;

/**
 * 成品提示词之后的「可调项」「说明」等小标题；提示词是连续成段的自然语言，
 * 遇到列表项或这些小标题就说明正文已经写完了。
 */
const SECTION_BREAK =
  /^(?:#{1,6}\s|[-*+•]\s|\d+[.、)]\s|(?:可调项|可选调整|可调参数|参数建议|微调建议|风格建议|说明|备注|注意|其他|其它|示例)\s*[:：]?)/;

/** 块内任意一行是列表项时同样视为正文结束（「可调项：」下面往往紧跟 - 开头的行） */
function hasListMarker(block: string) {
  return block.split("\n").some((line) => /^\s*(?:[-*+•]|\d+[.、)])\s/.test(line));
}

function isSectionBreak(block: string) {
  return SECTION_BREAK.test(block) || hasListMarker(block);
}

/** 命中提示词标签时返回标签本身（含冒号与 Markdown 装饰），便于取出标签后面的正文 */
function promptLabel(block: string) {
  return LABELED_PROMPT.exec(block)?.[0] ?? GENERIC_PROMPT_LABEL.exec(block)?.[0];
}

/** 去掉引用、小标题与强调符号，得到能直接放进输入框的纯文本 */
function cleanText(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*>\s?/, "").replace(/^#{1,6}\s*/, "").trim())
    .join("\n")
    .replace(/\*\*|__/g, "")
    .replace(/`/g, "")
    .trim();
}

/** 提示词是一段连续的自然语言，折行与多余空白压成单空格后更适合粘贴、编辑 */
function toSingleLine(text: string) {
  return text
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * 从「图片提示词助手」的回复里挑出可以直接拿去画图的那段提示词。
 *
 * 系统提示要求回复先给一段「成品提示词」、再跟 2-4 条「可调项」，于是按可信度依次尝试：
 * 1. 代码块——模型主动把提示词包起来时最明确；
 * 2. 「成品提示词 / 提示词：」这类标签后面的正文，一直取到列表项或小标题为止；
 * 3. 都没有时退而取最长的一段正文，但以问号或冒号收尾的多半是追问 / 引导语，不算提示词。
 *
 * 只做尽量猜对的启发式：拿到的是什么由「一键使用」按钮的文案呈现，用户还能在输入框里改。
 */
export function extractImagePrompt(reply: string): string {
  const text = reply.replace(/\r\n?/g, "\n").trim();
  if (!text) return "";

  const fenced = [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
    .map((match) => toSingleLine(cleanText(match[1])))
    .find((block) => block.length >= MIN_IMAGE_PROMPT_LENGTH);
  if (fenced) return fenced;

  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const collected: string[] = [];
  let started = false;
  for (const block of blocks) {
    const label = promptLabel(block);
    if (label) {
      started = true;
      const rest = cleanText(block.slice(label.length));
      if (rest) collected.push(rest);
      continue;
    }
    if (!started) continue;
    if (isSectionBreak(block)) break;
    collected.push(cleanText(block));
  }

  const labeled = toSingleLine(collected.join("\n"));
  if (labeled.length >= MIN_IMAGE_PROMPT_LENGTH) return labeled;

  const paragraphs = blocks
    .filter((block) => !isSectionBreak(block))
    .map((block) => toSingleLine(cleanText(block)))
    .filter(
      (block) => block.length >= MIN_IMAGE_PROMPT_LENGTH && !/[?？:：]\s*$/.test(block),
    );

  return paragraphs.reduce((longest, block) => (block.length > longest.length ? block : longest), "");
}
