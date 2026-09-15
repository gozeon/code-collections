import {
  convertImageModelFileToDataUri,
  convertUint8ArrayToBase64,
  createJsonErrorResponseHandler,
  createJsonResponseHandler,
  downloadBlob,
  jsonSchema,
  postJsonToApi,
} from "@ai-sdk/provider-utils";
import type { ImageModel } from "ai";

import { MAX_IMAGE_COUNT } from "./image-count";

/** 调用火山方舟（OpenAI 兼容）图片接口所需的配置 */
export type ArkImageConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

type ArkImageResponse = {
  data?: { b64_json?: string; url?: string }[];
};

type ArkErrorResponse = {
  error?: { message?: string };
  message?: string;
};

const arkImageResponseSchema = jsonSchema<ArkImageResponse>({
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { b64_json: { type: "string" }, url: { type: "string" } },
      },
    },
  },
});

const arkErrorSchema = jsonSchema<ArkErrorResponse>({
  type: "object",
  properties: {
    error: { type: "object", properties: { message: { type: "string" } } },
    message: { type: "string" },
  },
});

const arkFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: arkErrorSchema,
  errorToMessage: (error) => error.error?.message || error.message || "接口调用失败",
  // 限流与服务端错误可以重试，其余错误（如参数不合法）直接抛出
  isRetryable: (response) => response.status === 429 || response.status >= 500,
});

/** 默认请求 b64_json；返回图片地址时下载后转 base64，前端统一按 data URL 展示 */
async function toBase64Images(items: NonNullable<ArkImageResponse["data"]>) {
  const images = await Promise.all(
    items.map(async (item) => {
      if (item.b64_json) return item.b64_json;
      if (!item.url) return "";
      const blob = await downloadBlob(item.url);
      return convertUint8ArrayToBase64(new Uint8Array(await blob.arrayBuffer()));
    }),
  );
  return images.filter(Boolean);
}

/**
 * 火山方舟的图片模型：实现 AI SDK 的 ImageModelV4 接口，供 `generateImage()` 调用。
 *
 * 内置的 OpenAI provider 只透传标准字段，方舟特有的 `watermark`、参考图 `image`
 * 与多图 `sequential_image_generation` 会被丢弃，因此这里按 AI SDK 的模型接口
 * 适配方舟的 OpenAI 兼容接口，调用方仍按标准 `generateImage()` 使用。
 */
export function arkImageModel(config: ArkImageConfig): ImageModel {
  return {
    specificationVersion: "v4",
    provider: "ark",
    modelId: config.model,
    // 与应用层单次请求的图片数上限共用同一常量：若这里小于上限，
    // generateImage() 会把一次请求拆成多次并行的方舟调用
    maxImagesPerCall: MAX_IMAGE_COUNT,
    async doGenerate({ prompt, files, size, seed, n, providerOptions, abortSignal }) {
      const body: Record<string, unknown> = {
        model: config.model,
        prompt,
        // 直接返回 base64，避免生成结果过期 / 跨域，无需再走图片代理
        response_format: "b64_json",
        // 方舟默认加水印，缺省关闭；可通过 providerOptions.ark.watermark 覆盖
        watermark: providerOptions.ark?.watermark === true,
      };
      if (size) body.size = size;
      if (seed !== undefined && seed >= 0) body.seed = seed;
      // 图生图 / 图片修改：参考图以 data URL 或公网 URL 数组传给方舟
      if (files?.length) body.image = files.map(convertImageModelFileToDataUri);
      if (n > 1) {
        body.sequential_image_generation = "auto";
        body.sequential_image_generation_options = { max_images: n };
      }

      const { value, responseHeaders } = await postJsonToApi({
        url: `${config.baseUrl.replace(/\/+$/, "")}/images/generations`,
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body,
        failedResponseHandler: arkFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(arkImageResponseSchema),
        abortSignal,
      });

      return {
        images: await toBase64Images(value.data ?? []),
        // 请求成功但没有图片时不重试，直接交由 generateImage 抛出错误
        isRetryable: false,
        warnings: [],
        response: { headers: responseHeaders, modelId: config.model, timestamp: new Date() },
      };
    },
  };
}
