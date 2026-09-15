/**
 * 从图片字节里读出宽高，用于「跟随参考图尺寸」。
 *
 * 参考图在本应用里只会以 base64 data URL 发送，因此这里只需要解析 data URL；
 * 其他形式（如公网 URL）返回 undefined，调用方会回退到宽高比 + 分辨率。
 * 支持的格式：PNG / JPEG / GIF / WebP，其余格式（如 AVIF）同样回退。
 */

/** 只需读文件头，限制解码长度避免为了读宽高把整张大图解进内存 */
const MAX_HEADER_BYTES = 512 * 1024;

const DATA_URL_PATTERN = /^data:([^;,]+)?(;base64)?,/i;

function u16be(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function u16le(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function u32be(bytes: Uint8Array, offset: number) {
  return (
    (bytes[offset] * 0x1000000 +
      (bytes[offset + 1] << 16) +
      (bytes[offset + 2] << 8) +
      bytes[offset + 3]) >>>
    0
  );
}

function u32le(bytes: Uint8Array, offset: number) {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

function u24le(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}

/** PNG：签名 8 字节 + IHDR 长度 4 字节 + "IHDR" 4 字节，随后是宽高各 4 字节大端 */
function pngSize(bytes: Uint8Array) {
  if (bytes.length < 24) return undefined;
  if (u32be(bytes, 0) !== 0x89504e47 || u32be(bytes, 4) !== 0x0d0a1a0a) return undefined;
  return { width: u32be(bytes, 16), height: u32be(bytes, 20) };
}

/** JPEG：跳过各段，遇到 SOF 段时读精度 1 字节后的高 2 字节与宽 2 字节 */
function jpegSize(bytes: Uint8Array) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined;

  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    // 无参数的标记：填充字节 / SOI / EOI / RST
    if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = u16be(bytes, offset + 2);
    if (length < 2) return undefined;
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame) {
      return { width: u16be(bytes, offset + 7), height: u16be(bytes, offset + 5) };
    }
    offset += 2 + length;
  }
  return undefined;
}

/** GIF：签名 6 字节后是宽高各 2 字节小端 */
function gifSize(bytes: Uint8Array) {
  if (bytes.length < 10 || ascii(bytes, 0, 3) !== "GIF") return undefined;
  return { width: u16le(bytes, 6), height: u16le(bytes, 8) };
}

/** WebP：VP8（有损）/ VP8L（无损）/ VP8X（扩展）三种块各有自己的宽高编码 */
function webpSize(bytes: Uint8Array) {
  if (bytes.length < 30 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 12) !== "WEBP") {
    return undefined;
  }

  const chunk = ascii(bytes, 12, 16);
  if (chunk === "VP8 ") {
    return { width: u16le(bytes, 26) & 0x3fff, height: u16le(bytes, 28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = u32le(bytes, 21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return { width: u24le(bytes, 24) + 1, height: u24le(bytes, 27) + 1 };
  }
  return undefined;
}

/** 按文件头识别格式并读出宽高，识别不出（或宽高非法）时返回 undefined */
export function readImageSize(bytes: Uint8Array): { width: number; height: number } | undefined {
  const size = pngSize(bytes) ?? jpegSize(bytes) ?? gifSize(bytes) ?? webpSize(bytes);
  if (!size) return undefined;
  const { width, height } = size;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined;
  }
  return { width, height };
}

/** base64 data URL → 宽高；非 base64 的 data URL（如 svg 文本）与非法数据返回 undefined */
export function dataUrlImageSize(url: string | undefined): { width: number; height: number } | undefined {
  const match = DATA_URL_PATTERN.exec(url?.trim() ?? "");
  if (!match?.[2]) return undefined;

  const base64 = (url ?? "").slice(match[0].length).replace(/[\r\n\t ]/g, "");
  // 只解码文件头所需的前缀，剩余部分（图片像素数据）用不到
  const prefixLength = Math.ceil((MAX_HEADER_BYTES / 3) * 4);
  const bytes = Buffer.from(base64.slice(0, prefixLength), "base64");
  return readImageSize(bytes);
}
