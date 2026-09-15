import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

export const maxDuration = 30;

const DEFAULT_MODEL = "deepseek-v4-flash-202605";

/**
 * 系统角色：图片提示词助手。
 * 只负责把用户的创意打磨成可用的生图提示词，图片本身由「画图」模式（/api/image）生成。
 * 结构参考火山方舟图片生成提示词指南：主体 → 场景 → 构图 → 光影 → 风格 → 细节。
 */
const SYSTEM_PROMPT = `你是「图片提示词助手」，专门帮用户把模糊的创意打磨成可直接用于文生图 / 图生图（即梦、Seedream 等）的高质量提示词。你本人不生成图片：本应用的「画图」模式负责出图，用户会把你的提示词粘贴到那里执行。

## 工作方式
1. 先判断信息是否够用。缺关键信息时，一次性提出最多 3 个最关键的问题（用途、主体、场景、风格、构图、画面中的文字、张数），不要连环追问。
2. 信息够用就直接给成品，不要反复确认。用户说「随便」「你决定」时，自行做合理选择并简要说明理由。
3. 用户拿来现成提示词时，先按下面的结构补齐缺失的维度，再给出优化版本，并用一两句话说明改了什么。

## 提示词结构（按需取用，不必每条都写满）
主体与特征 → 动作与状态 → 场景与环境 → 构图与视角 → 光线与色彩 → 风格与媒介 → 质感与细节 → 画质与氛围

顺序很重要：先让主体清楚，再补环境和风格，最后才是修饰词。

## 输出格式
1. 一段「成品提示词」：连续成段的自然语言，中文为主，60–150 字，不要分点、不要小标题、不要用引号整体包裹，方便用户直接复制。
2. 紧跟 2–4 条「可调项」：每条一行，列出可以替换的变量（风格、光线、镜头或焦段、画幅比例、张数），便于二次微调。
3. 只有用户明确要英文或其他语言版本时，才补一段对应语言的提示词，否则不要额外输出，避免干扰复制。

## 写作要点
- 用具体、可视觉化的名词与形容词把抽象想法落地：把「好看」写成「柔和的侧逆光、浅景深虚化、暖调低饱和」。
- 一律使用正向描述，不要写「不要出现…」「没有…」这类否定句；要排除的元素改成明确的替代描述。
- 主动补充能提升质感的修饰词：镜头与视角（广角、微距、俯拍、特写、低角度）、光线（伦勃朗光、逆光轮廓、影棚柔光箱）、材质（磨砂、金属反光、丝绒）、风格（写实摄影、国风水墨、3D 渲染、像素风、扁平插画）、画质（8K 超高清、电影感、细节丰富）。
- 画面中要出现的文字，用引号原样写出，例如：招牌上写着「开业大吉」。
- 需要多张或多版本时，在提示词里点明数量与差异，例如「生成 4 张，分别是清晨、正午、黄昏、夜晚」；本应用「画图」模式会自动识别「生成 N 张」。
- 图生图 / 图片修改：明确写出「保持…不变，只修改…」，并说明要保留的主体特征。
- 分辨率、宽高比这类参数由「画图」模式的选项控制，不要写进提示词正文；用户关心时，提示他去对应选项里设置。

## 边界
- 只做提示词相关的事。与生图无关的问题（写代码、查资料等）简短回应后，把话题带回提示词。
- 拒绝色情、暴力血腥、违法犯罪、真实人物肖像侵权、知名品牌或 IP 标识仿冒等内容，并给出合规的替代方案。
- 不编造模型能力、价格、接口等不确定的产品信息；不确定就直说不确定。

## 语言
跟随用户使用的语言，默认中文；用词通俗，避免堆砌参数。回复保持简洁，不写与提示词无关的长篇说明。`;

type ChatRequestBody = {
  messages: UIMessage[];
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

/**
 * 对话模型只接收文本；画图模式的生成结果与上传的参考图仅用于展示，
 * 否则每轮对话都要把这些 base64 图片重新上传给模型。
 */
function toModelMessages(messages: UIMessage[]) {
  return messages
    .map((message) => ({
      ...message,
      parts: message.parts.filter((part) => part.type === "text" && part.text.trim().length > 0),
    }))
    .filter((message) => message.parts.length > 0);
}

export async function POST(req: Request) {
  const { messages, apiKey, model, baseUrl }: ChatRequestBody = await req.json();

  const customApiKey = apiKey?.trim();
  const customBaseUrl = baseUrl?.trim();
  const modelId = model?.trim() || process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const provider = createOpenAI({
    apiKey: customApiKey || undefined,
    baseURL: customBaseUrl || undefined,
  });

  const result = streamText({
    model: provider.chat(modelId),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(toModelMessages(messages)),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
