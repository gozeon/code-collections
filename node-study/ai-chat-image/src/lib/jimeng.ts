import { createHash, createHmac } from "node:crypto";

import { normalizeImageCount } from "./image-count";

/** 即梦接口提供方：volc = 火山引擎视觉智能（AK/SK），ark = 火山方舟（API Key，OpenAI 兼容） */
export type JimengProvider = "volc" | "ark";

export type JimengImageParams = {
  /** 提示词：文生图为画面描述，图生图为修改指令 */
  prompt: string;
  /** 参考图（图生图/图片修改），支持公网 URL 或 data URL/base64 */
  images?: string[];
  /** 期望返回的图片数量，1-4；方舟走一次性多图生成，视觉智能则并行多次生成 */
  count?: number;
  width?: number;
  height?: number;
  seed?: number;
  /** 文本影响程度，部分模型支持 */
  scale?: number;
  /** 是否开启提示词改写 */
  usePreLlm?: boolean;
  /** 是否添加水印，默认不添加 */
  watermark?: boolean;
};

/** 可由前端本地设置覆盖的即梦配置 */
export type JimengOverrides = {
  provider?: JimengProvider | "auto";
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;
  reqKey?: string;
  editReqKey?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

export type JimengConfig = {
  provider: JimengProvider;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  region: string;
  host: string;
  /** 文生图 req_key */
  reqKey: string;
  /** 图生图 / 图片修改 req_key */
  editReqKey: string;
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

/** 火山引擎视觉智能（即梦）默认参数 */
export const DEFAULT_VOLC_HOST = "visual.volcengineapi.com";
export const DEFAULT_VOLC_REGION = "cn-north-1";
export const DEFAULT_T2I_REQ_KEY = "jimeng_high_aes_general_v21_L";
/** 图生图默认沿用通用模型，通过 image_urls 传入参考图；可改为控制台的图生图/指令编辑 req_key */
export const DEFAULT_I2I_REQ_KEY = DEFAULT_T2I_REQ_KEY;
/** 火山方舟默认配置 */
export const DEFAULT_ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";
export const DEFAULT_ARK_MODEL = "doubao-seedream-4-0-250828";

function pick(...values: (string | undefined)[]) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

/** 合并本地设置与服务端环境变量，并解析出实际使用的提供方 */
export function resolveJimengConfig(overrides: JimengOverrides = {}): JimengConfig {
  const accessKeyId = pick(overrides.accessKeyId, process.env.JIMENG_ACCESS_KEY_ID);
  const secretAccessKey = pick(overrides.secretAccessKey, process.env.JIMENG_SECRET_ACCESS_KEY);
  const apiKey = pick(overrides.apiKey, process.env.JIMENG_API_KEY);

  const requested = overrides.provider && overrides.provider !== "auto" ? overrides.provider : "";
  const provider: JimengProvider | "" =
    requested || (accessKeyId && secretAccessKey ? "volc" : apiKey ? "ark" : "");

  if (!provider) {
    throw new JimengError(
      "未配置即梦接口凭证：请设置 JIMENG_ACCESS_KEY_ID 与 JIMENG_SECRET_ACCESS_KEY（火山引擎 AK/SK），或 JIMENG_API_KEY（火山方舟），也可在页面「接口设置」中填写。",
      400,
    );
  }
  if (provider === "volc" && !(accessKeyId && secretAccessKey)) {
    throw new JimengError("即梦提供方为火山引擎视觉智能时，必须同时配置 AccessKeyId 与 SecretAccessKey。", 400);
  }
  if (provider === "ark" && !apiKey) {
    throw new JimengError("即梦提供方为火山方舟时，必须配置 API Key。", 400);
  }

  return {
    provider,
    accessKeyId,
    secretAccessKey,
    sessionToken: pick(overrides.sessionToken, process.env.JIMENG_SESSION_TOKEN),
    region: pick(overrides.region, process.env.JIMENG_REGION) || DEFAULT_VOLC_REGION,
    host: pick(process.env.JIMENG_HOST) || DEFAULT_VOLC_HOST,
    reqKey: pick(overrides.reqKey, process.env.JIMENG_REQ_KEY) || DEFAULT_T2I_REQ_KEY,
    editReqKey: pick(overrides.editReqKey, process.env.JIMENG_EDIT_REQ_KEY) || DEFAULT_I2I_REQ_KEY,
    apiKey,
    baseUrl: pick(overrides.baseUrl, process.env.JIMENG_BASE_URL) || DEFAULT_ARK_BASE_URL,
    model: pick(overrides.model, process.env.JIMENG_MODEL) || DEFAULT_ARK_MODEL,
  };
}

export type JimengImageResult = {
  images: string[];
  provider: JimengProvider;
  mode: "text2image" | "image2image";
};

/** 文生图 / 图生图统一入口，返回可直接展示的图片 URL 或 data URL */
export async function generateJimengImages(
  config: JimengConfig,
  params: JimengImageParams,
): Promise<JimengImageResult> {
  const prompt = params.prompt.trim();
  if (!prompt) throw new JimengError("提示词不能为空。", 400);

  const images = (params.images ?? []).map((item) => item.trim()).filter(Boolean);
  const mode = images.length > 0 ? "image2image" : "text2image";
  const count = normalizeImageCount(params.count);
  const resolved = { ...params, prompt, count };

  const generated =
    config.provider === "volc"
      ? await generateWithVolc(config, resolved, images)
      : await generateWithArk(config, resolved, images);

  return { images: generated, provider: config.provider, mode };
}

/* ------------------------------- 火山方舟 -------------------------------- */

async function generateWithArk(
  config: JimengConfig,
  params: JimengImageParams,
  images: string[],
): Promise<string[]> {
  const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/images/generations`;
  const body: Record<string, unknown> = {
    model: config.model,
    prompt: params.prompt,
    response_format: "url",
    watermark: params.watermark ?? false,
  };
  if (params.width && params.height) body.size = `${params.width}x${params.height}`;
  if (params.seed !== undefined && params.seed >= 0) body.seed = params.seed;
  if (images.length > 0) body.image = images;
  // 方舟（Seedream 等）通过 sequential_image_generation 一次返回多张图片
  if ((params.count ?? 1) > 1) {
    body.sequential_image_generation = "auto";
    body.sequential_image_generation_options = { max_images: params.count };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new JimengError(`无法访问即梦（方舟）接口：${error instanceof Error ? error.message : "网络错误"}`, 502);
  }

  const data = (await response.json().catch(() => null)) as
    | { data?: { url?: string; b64_json?: string }[]; error?: { message?: string }; message?: string }
    | null;

  if (!response.ok) {
    const detail = data?.error?.message || data?.message || response.statusText;
    throw new JimengError(`即梦（方舟）接口调用失败：${detail}`, response.status >= 400 && response.status < 500 ? 400 : 502);
  }

  const urls = (data?.data ?? [])
    .map((item) => item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : ""))
    .filter(Boolean);

  if (urls.length === 0) throw new JimengError("即梦（方舟）接口未返回图片，请稍后重试或检查模型配置。", 502);
  return urls;
}

/* --------------------------- 火山引擎视觉智能 ---------------------------- */

function sha256Hex(payload: string) {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

function hmac(key: string | Buffer, data: string) {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function formatXDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

async function volcRequest(
  config: JimengConfig,
  action: string,
  version: string,
  payload: Record<string, unknown>,
) {
  const service = "cv";
  const body = JSON.stringify(payload);
  const payloadHash = sha256Hex(body);
  const xDate = formatXDate(new Date());
  const shortDate = xDate.slice(0, 8);
  const canonicalQuery = `Action=${encodeURIComponent(action)}&Version=${encodeURIComponent(version)}`;
  const signedHeaders = "content-type;host;x-content-sha256;x-date";
  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${config.host}\n` +
    `x-content-sha256:${payloadHash}\n` +
    `x-date:${xDate}\n`;
  const canonicalRequest = ["POST", "/", canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${shortDate}/${config.region}/${service}/request`;
  const stringToSign = [
    "HMAC-SHA256",
    xDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`VOLC${config.secretAccessKey}`, shortDate), config.region), service),
    "request",
  );
  const signature = createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");
  const authorization =
    `HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Date": xDate,
    "X-Content-Sha256": payloadHash,
    Authorization: authorization,
  };
  if (config.sessionToken) headers["X-Security-Token"] = config.sessionToken;

  let response: Response;
  try {
    response = await fetch(`https://${config.host}/?${canonicalQuery}`, {
      method: "POST",
      headers,
      body,
    });
  } catch (error) {
    throw new JimengError(`无法访问即梦接口：${error instanceof Error ? error.message : "网络错误"}`, 502);
  }

  const text = await response.text();
  let data: { code?: number; message?: string; data?: unknown; request_id?: string } | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new JimengError(
      `即梦接口返回 HTTP ${response.status}${data?.message ? `：${data.message}` : ""}`,
      502,
    );
  }
  if (!data) throw new JimengError("即梦接口返回了无法解析的内容。", 502);
  if (data.code !== 10000) {
    throw new JimengError(
      `即梦接口返回错误（code ${data.code ?? "unknown"}）：${data.message || "未知错误"}${
        data.request_id ? `（request_id ${data.request_id}）` : ""
      }`,
      502,
    );
  }
  return data;
}

/** 即梦 vision 接口的 image_urls 支持 URL 或裸 base64，这里把 data URL 还原成 base64 */
function toVolcImage(input: string) {
  if (!input.startsWith("data:")) return input;
  const comma = input.indexOf(",");
  return comma >= 0 ? input.slice(comma + 1) : input;
}

function extractVolcImages(data: unknown): string[] {
  const payload = data as { image_urls?: unknown; binary_data_base64?: unknown } | null;
  const urls = Array.isArray(payload?.image_urls)
    ? payload.image_urls.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
  if (urls.length > 0) return urls;

  const base64 = Array.isArray(payload?.binary_data_base64)
    ? payload.binary_data_base64.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
  return base64.map((item) => (item.startsWith("data:") ? item : `data:image/jpeg;base64,${item}`));
}

async function generateWithVolc(
  config: JimengConfig,
  params: JimengImageParams,
  images: string[],
): Promise<string[]> {
  const count = normalizeImageCount(params.count);
  // 视觉智能接口单次只返回一张，多图时并行发起多次请求（种子递增以得到不同结果）
  if (count <= 1) return generateWithVolcOnce(config, params, images);

  const batches = await Promise.all(
    Array.from({ length: count }, (_, index) =>
      generateWithVolcOnce(
        config,
        { ...params, seed: params.seed !== undefined && params.seed >= 0 ? params.seed + index : undefined },
        images,
      ),
    ),
  );
  return batches.flat();
}

async function generateWithVolcOnce(
  config: JimengConfig,
  params: JimengImageParams,
  images: string[],
): Promise<string[]> {
  const payload: Record<string, unknown> = {
    req_key: images.length > 0 ? config.editReqKey : config.reqKey,
    prompt: params.prompt,
    return_url: true,
    seed: params.seed ?? -1,
  };
  if (params.width && params.height) {
    payload.width = params.width;
    payload.height = params.height;
  }
  if (params.usePreLlm !== undefined) payload.use_pre_llm = params.usePreLlm;
  if (params.scale !== undefined) payload.scale = params.scale;
  if (params.watermark !== undefined) payload.logo_info = { add_logo: params.watermark };
  if (images.length > 0) payload.image_urls = images.map(toVolcImage);

  const data = await volcRequest(config, "CVProcess", "2022-08-31", payload);
  const urls = extractVolcImages(data.data);
  if (urls.length === 0) throw new JimengError("即梦接口未返回图片，请稍后重试或检查 req_key 配置。", 502);
  return urls;
}
