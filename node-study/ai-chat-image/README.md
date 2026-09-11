# AI App

基于 Next.js 的 AI 应用开发模板，预置开发 AI 应用的常用技术栈，包含流式聊天与即梦图片生成（文生图 / 图生图）示例。

## 技术栈

| 领域 | 选型 |
| ---- | ---- |
| 框架 | Next.js 16（App Router、Turbopack）、React 19、TypeScript |
| 样式 | Tailwind CSS v4、shadcn/ui、lucide-react 图标 |
| AI | Vercel AI SDK：`ai`、`@ai-sdk/openai`、`@ai-sdk/react`；即梦图片生成（火山引擎视觉智能 AK/SK / 火山方舟 API Key） |

已安装的 shadcn/ui 组件：`button`、`card`、`input`、`textarea`、`avatar`、`scroll-area`、`separator`、`badge`、`dropdown-menu`、`dialog`、`sheet`、`sonner`、`tooltip`。

## 快速开始

```bash
# 1. 配置环境变量（对话用 OPENAI_API_KEY，图片生成用即梦 AK/SK 或方舟 API Key）
cp .env.example .env.local

# 2. 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可看到聊天界面。

## 图片生成（即梦）

页脚切换到「画图」模式即可：

- **文生图**：直接输入画面描述，回车/点击生成，结果按所选尺寸生成并插入对话流。
- **图生图 / 图片修改**：点击回形针上传参考图（最多 4 张，自动等比压缩到 2048px 内），再输入修改指令；也可以悬停已生成的图片点铅笔图标，直接把它设为参考图继续修改。
- **标记参考图**：参考图缩略图左下角的画笔画钮可打开标记面板，用画笔圈选 / 涂画要修改的区域（支持颜色、粗细、撤销与清空），保存后带标记的图片会作为参考图发送给模型。跨域或已生成的结果图会先经由 `api/image/proxy` 转成 base64 再绘制，避免画布被污染导致保存失败。
- **多张生成**：直接在提示词里写明数量，如「生成 4 张」「画三张图」「3 images」，一次请求最多返回 4 张图片并按顺序插入对话流（工具栏会提示解析到的张数）；方舟走 `sequential_image_generation`，视觉智能则并行多次生成。
- **图片预览**：点击生成结果即可放大预览，多张结果支持左右切换（←/→ 或按钮）与下载，预览中也能一键「用作参考图」。
- 上传的参考图会以 base64 形式随请求提交；若所用的 req_key / 模型只接受公网 URL，请改为传入可公开访问的图片地址。

凭证二选一，均可在 `.env.local` 中配置，也可在页面「接口设置」里填写（本地保存在浏览器 localStorage）：

| 方式 | 环境变量 | 说明 |
| ---- | -------- | ---- |
| 火山引擎视觉智能（默认） | `JIMENG_ACCESS_KEY_ID`、`JIMENG_SECRET_ACCESS_KEY` | 调用 `CVProcess` 接口，内置 V4 签名；`JIMENG_REQ_KEY` / `JIMENG_EDIT_REQ_KEY` 分别对应文生图与图生图 req_key |
| 火山方舟（OpenAI 兼容） | `JIMENG_API_KEY` | 调用 `/images/generations`；`JIMENG_MODEL` 指定图片模型，缺省 `doubao-seedream-4-0-250828` |

两者同时配置时默认优先使用 AK/SK，也可在「接口设置」的「提供方」下拉项中强制指定。生成的图片消息只用于展示，发起对话时会被自动过滤，不会作为上下文传给对话模型。

## 目录结构

```
src/
├─ app/
│  ├─ api/chat/route.ts   # 聊天 API：streamText 流式返回模型响应
│  ├─ api/image/route.ts  # 图片 API：调用即梦完成文生图 / 图生图
│  ├─ api/image/proxy/route.ts # 图片代理：把跨域参考图取回为同源资源，便于标注后导出 base64
│  ├─ layout.tsx          # 根布局（TooltipProvider、Toaster）
│  ├─ page.tsx            # 首页，渲染聊天示例
│  └─ globals.css         # Tailwind v4 + shadcn 主题变量
├─ components/
│  ├─ chat.tsx            # 聊天 + 画图界面（useChat、参考图上传、图片结果展示）
│  └─ ui/                 # shadcn/ui 组件
└─ lib/
   ├─ jimeng.ts           # 即梦客户端（V4 签名 / 方舟兼容接口）
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

推荐使用 [Vercel](https://vercel.com/new) 部署，记得在环境变量中配置 `OPENAI_API_KEY` 与即梦凭证（`JIMENG_ACCESS_KEY_ID` / `JIMENG_SECRET_ACCESS_KEY` 或 `JIMENG_API_KEY`）。
