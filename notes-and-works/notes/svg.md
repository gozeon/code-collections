# SVG


### 什么是SVG?

  1. SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
  2. SVG 用来定义用于网络的基于矢量的图形  
  3. SVG 使用 XML 格式定义图形
  4. SVG 图像在放大或改变尺寸的情况下其图形质量不会有损失
  5. SVG 是万维网联盟的标准

### SVG的优势：
  1. SVG 图像可通过文本编辑器来创建和修改
  2. SVG 图像可被搜索、索引、脚本化或压缩
  3. SVG 是可伸缩的
  4. SVG 图像可在任何的分辨率下被高质量地打印
  5. SVG 可在图像质量不下降的情况下被放大

### 参考文档
[Firefox开发者中心](https://developer.mozilla.org/zh-CN/)

### 引入外部SVG文件
``` html
  <iframe src="svg.svg" width="200" height="200" frameborder="no"></iframe>
```
SVG文件
``` xml
   <?xml version="1.0"?> <!-- 这句话一定要有 -->
  <svg viewBox="0 0 120 120" version="1.1"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50"/>
  </svg>
```
