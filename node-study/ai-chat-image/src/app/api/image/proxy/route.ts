export const runtime = "nodejs";
export const maxDuration = 30;

/** 单张参考图最大 12MB，避免代理被当作大文件通道 */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/** 拒绝内网地址，避免该接口被当作 SSRF 跳板 */
function isPrivateHost(host: string) {
  const name = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (name === "localhost" || name.endsWith(".localhost") || name.endsWith(".local")) return true;
  if (name === "::1" || name === "0:0:0:0:0:0:0:1" || name === "0.0.0.0") return true;
  if (/^127\./.test(name) || /^10\./.test(name) || /^192\.168\./.test(name)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(name)) return true;
  return /^169\.254\./.test(name);
}

/**
 * 图片代理：把跨域 / 带签名头限制的参考图取回并转成同源资源。
 * 标注面板需要把参考图绘制到 canvas 上再导出 base64，直接使用跨域图片会污染画布导致 toDataURL 失败。
 */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url")?.trim();
  if (!raw) return Response.json({ error: "缺少 url 参数。" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return Response.json({ error: "url 不是合法地址。" }, { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return Response.json({ error: "仅支持 http/https 图片地址。" }, { status: 400 });
  }
  if (isPrivateHost(target.hostname)) {
    return Response.json({ error: "不支持代理内网地址。" }, { status: 400 });
  }

  try {
    const response = await fetch(target, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: "image/*" },
    });
    if (!response.ok) {
      return Response.json({ error: `获取图片失败（HTTP ${response.status}）。` }, { status: 502 });
    }

    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!contentType.startsWith("image/")) {
      return Response.json({ error: "目标地址不是图片。" }, { status: 415 });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0) {
      return Response.json({ error: "目标图片内容为空。" }, { status: 502 });
    }
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return Response.json({ error: "图片体积过大，无法代理。" }, { status: 413 });
    }

    return new Response(new Uint8Array(buffer), {
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[api/image/proxy] 图片代理失败", error);
    return Response.json({ error: "获取图片失败，可能已过期或不可访问。" }, { status: 502 });
  }
}
