# AI App

基于 Next.js 的 AI 应用开发模板，预置开发 AI 应用的常用技术栈，包含流式聊天与即梦图片生成（文生图 / 图生图）示例。

## 技术栈

| 领域 | 选型 |
| ---- | ---- |
| 框架 | Next.js 16（App Router、Turbopack）、React 19、TypeScript |
| 样式 | Tailwind CSS v4、shadcn/ui、lucide-react 图标 |
| AI | Vercel AI SDK：`ai`（`streamText` / `generateImage()`）、`@ai-sdk/openai`、`@ai-sdk/react`；即梦图片生成（火山方舟，OpenAI 兼容） |

已安装的 shadcn/ui 组件：`button`、`card`、`input`、`textarea`、`avatar`、`scroll-area`、`separator`、`badge`、`dropdown-menu`、`dialog`、`sheet`、`sonner`、`tooltip`。

## 快速开始

```bash
# 1. 配置环境变量（对话用 OPENAI_API_KEY，图片生成用火山方舟 API Key）
cp .env.example .env.local

# 2. 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可看到聊天界面。

## 图片生成（即梦）

页脚切换到「画图」模式即可：

- **文生图**：直接输入画面描述，回车/点击生成，结果按所选宽高比与分辨率（2K/4K，像素自动推算）生成并插入对话流。
- **图生图 / 图片修改**：点击回形针上传参考图（最多 4 张，自动等比压缩到 2048px 内），再输入修改指令；也可以悬停已生成的图片点铅笔图标，直接把它设为参考图继续修改。参考图会随消息保留在对话流中，展示、预览、下载与「用作参考图」的交互和生成结果完全一致。
- **标记参考图**：参考图缩略图左下角的画笔画钮可打开标记面板，用画笔圈选 / 涂画要修改的区域（支持颜色、粗细、撤销与清空），保存后带标记的图片会作为参考图发送给模型。生成结果与参考图统一为 base64 data URL，可直接绘制到 canvas，无需图片代理。
- **多张生成**：直接在提示词里写明数量，如「生成 4 张」「画三张图」「3 images」，一次请求最多返回 4 张图片并按顺序插入对话流；方舟走 `sequential_image_generation` 一次生成多张。张数优先按图片量词与图片名词（`张` / `幅` / `图` / `图片` / `照片` / `images`）解析，找不到这类写法时才退回「N 个」，因此「增加一个宠物精灵，两张不同风格」会按 2 张生成，「两张不同风格，标记位置加一个图案」也仍是 2 张（`图案` / `图标` / `图层` 这类词里的「图」是画面元素，不算图片），而「把这张图改成…」「同一张图」「第一张」不会把指代与排序当成张数。
- **流式生成**：单张图默认开启方舟的 `stream=true`，服务端把渐进式快照按 UI 消息流（SSE，与 `/api/chat` 同一协议）逐帧推给前端，图片会由模糊到清晰实时刷新；多张生成与不支持流式的模型自动退回一次性返回（接口返回 400 / 404 / 405 / 501，或整条流没有返回图片时都会回退），不会因为「不支持流式」而生成失败。
- **张数可见、可手动指定**：工具栏的张数选择器会实时显示解析结果（`张数：自动 · 2 张`），解析不准时可直接在下拉里选 1-4 张，手动值随本轮请求发送并优先于提示词解析；选回「自动」即恢复按提示词解析。
- **一键使用提示词**：对话模式里助手回复的「成品提示词」下方会多出一个「用提示词画图」按钮，点击即切换到「画图」模式并把提示词填进输入框（已上传的参考图保持不变），改完直接生成，省去复制粘贴；提示词从回复里按代码块 → 「成品提示词」标签 → 最长正文的顺序提取（`src/lib/prompt.ts`），追问、闲聊这类没有提示词的回复不会显示按钮。
- **交互与对话一致**：画图与对话共用一个 `useChat`，状态流转（`submitted` / `streaming` / `ready` / `error`）、停止按钮、Enter 发送、自动滚动与错误提示都和聊天模式相同；服务端每帧先发 `reset-step` 再发 `file` part，因此消息里始终只保留最新的一帧（多张生成则写入多张）。
- **图片预览**：点击生成结果即可放大预览，多张结果支持左右切换（←/→ 或按钮）与下载，预览中也能一键「用作参考图」。
- 服务端通过 AI SDK 的 `generateImage()` 调用方舟（`src/lib/ark-image-model.ts` 按 AI SDK 的图片模型接口适配 `watermark`、参考图 `image`、多图 `sequential_image_generation` 等方舟专有字段），调用方式与官方 OpenAI SDK 一致。
- 参考图与生成结果都以 base64 形式传输，接口通过 `response_format: "b64_json"` 直接返回 base64，避免图片地址过期或跨域，也无需再代理图片。
- AI SDK 的图片模型接口（`ImageModelV4`）只有 `doGenerate`、没有流式能力，因此流式输出由 `src/lib/jimeng.ts` 直连方舟的 OpenAI 兼容接口实现；非流式（多图 / 回退）仍走 `generateImage()`。

凭证可在 `.env.local` 中配置，也可在页面「接口设置」里填写（本地保存在浏览器 localStorage）：

| 环境变量 | 说明 |
| -------- | ---- |
| `JIMENG_API_KEY` | 火山方舟 API Key，调用 OpenAI 兼容的 `/images/generations` |
| `JIMENG_BASE_URL` | 可选，缺省 `https://ark.cn-beijing.volces.com/api/v3` |
| `JIMENG_MODEL` | 可选，图片模型 ID，缺省 `doubao-seedream-4-0-250828` |

画图模式下的生成结果与参考图只用于展示，发起对话时会被自动过滤，不会作为上下文传给对话模型。

## 目录结构

```
src/
├─ app/
│  ├─ api/chat/route.ts   # 聊天 API：streamText 流式返回模型响应
│  ├─ api/image/route.ts  # 图片 API：调用即梦生成图片，以 UI 消息流（SSE）返回进度，也支持一次性 JSON
│  ├─ layout.tsx          # 根布局（TooltipProvider、Toaster）
│  ├─ page.tsx            # 首页，渲染聊天示例
│  └─ globals.css         # Tailwind v4 + shadcn 主题变量
├─ components/
│  ├─ chat.tsx            # 聊天 + 画图界面（单个 useChat 按模式切换接口、参考图上传、图片结果展示）
│  └─ ui/                 # shadcn/ui 组件
└─ lib/
   ├─ ark-image-model.ts  # 方舟图片模型（AI SDK ImageModelV4，供 generateImage 调用）
   ├─ jimeng.ts           # 即梦客户端（generateImage 非流式 + 方舟原生流式，base64 输出）
   ├─ image-count.ts      # 提示词张数解析（张 / 幅 / 图 / 图片 > 「N 个」）
   ├─ image-size.ts       # 宽高比 + 分辨率档位推算像素尺寸
   ├─ prompt.ts           # 从对话回复里提取成品提示词（供「用提示词画图」快捷操作使用）
   └─ utils.ts            # cn() 工具
```

## 常用命令

```bash
npm run dev          # 开发（Turbopack）
npm run build        # 生产构建
npm run lint         # ESLint
npx tsc --noEmit     # 类型检查（构建时已跳过，由该命令保证）
```

## 扩展

```bash
# 添加更多 shadcn/ui 组件
npx shadcn@latest add <component-name>

# 添加其他模型服务商（如 Anthropic）
npm install @ai-sdk/anthropic
```

更多环境变量见 `.env.example`。

## 相关文档

- [Next.js 文档](https://nextjs.org/docs)（本项目在 `node_modules/next/dist/docs/` 内置了对应版本文档）
- [Vercel AI SDK 文档](https://ai-sdk.dev/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

## 部署

推荐使用 [Vercel](https://vercel.com/new) 部署，记得在环境变量中配置 `OPENAI_API_KEY` 与即梦凭证（`JIMENG_API_KEY`）。
