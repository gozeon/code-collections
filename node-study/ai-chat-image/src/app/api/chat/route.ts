import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

const DEFAULT_MODEL = "deepseek-v4-flash-202605";

type ChatRequestBody = {
  messages: UIMessage[];
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

/**
 * 对话模型只接收文本；用户在画图模式生成的图片（assistant 的 file part）会被剔除，
 * 否则每次对话都要把这些图片重新上传给模型。
 */
function toModelMessages(messages: UIMessage[]) {
  return messages
    .map((message) => ({
      ...message,
      parts: message.parts.filter((part) => {
        if (part.type === "text") return part.text.trim().length > 0;
        return message.role === "user" && part.type === "file";
      }),
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
    system: "You are a helpful AI assistant. Respond in the same language the user uses.",
    messages: await convertToModelMessages(toModelMessages(messages)),
  });

  return result.toUIMessageStreamResponse();
}
