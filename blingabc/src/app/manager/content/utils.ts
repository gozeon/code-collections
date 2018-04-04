export function formatFileType(type: string): string {
  const typeMap = new Map();
  typeMap.set('voice', '音频');
  typeMap.set('video', '视频');
  typeMap.set('quiz', '试题');
  typeMap.set('image', '图片');
  typeMap.set('text', '文本');
  return typeMap.get(type);
}
