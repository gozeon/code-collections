<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Guidelines

## 项目结构与模块组织

- `src/app/` — App Router 页面与 API 路由，`api/chat/route.ts` 为流式聊天端点
- `src/components/chat.tsx` — 聊天示例客户端组件；`src/components/ui/` — shadcn/ui 组件
- `src/lib/utils.ts` — 导出 `cn()`；静态资源在 `public/`；主题变量集中在 `src/app/globals.css`

## 构建、测试与开发命令

- `npm run dev` — 启动开发服务器（Turbopack）
- `npm run build` — 生产构建；`npm run lint` — ESLint 检查
- `npx tsc --noEmit` — 类型检查（构建时已跳过类型校验，类型安全由该命令保证）

## 编码风格与命名约定

- TypeScript 严格模式，2 空格缩进，双引号（沿用脚手架与 shadcn 生成风格）
- 组件 PascalCase（`chat.tsx` 导出 `Chat`），函数/工具 camelCase；导入别名 `@/*` → `src/*`
- 类名合并统一用 `cn()`；客户端组件顶部必须声明 `"use client"`

## 测试指南

- 当前未配置测试框架；提交前依次运行 `npm run lint`、`npx tsc --noEmit`、`npm run build`，并将各项结果（成功/失败及关键报错）汇报给用户
- 禁止启动任何服务器：不要执行 `npm run dev`、`npm start` 或任何监听端口的命令
- 如需新增测试，建议 Vitest + React Testing Library，测试文件就近命名为 `*.test.ts(x)`

## 提交与 PR 指南

- 仓库尚无 git 历史，建议采用 Conventional Commits（`feat:`、`fix:`、`chore:` 等）
- PR 需包含变更说明与关联 issue；UI 变更请附截图

## Agent 特别提示（版本差异，易踩坑）

- AI SDK v7：服务端 `streamText(...).toUIMessageStreamResponse()`；消息转换用 `convertToModelMessages`（不是 `convertToCoreMessages`）。客户端 `useChat()` 需自行管理输入状态，用 `sendMessage({ text })` 发送；状态为 `submitted | streaming | ready | error`；正文在 `message.parts` 中按 `type === "text"` 过滤渲染
- 本项目 shadcn/ui 基于 Base UI（非 Radix）：`TooltipTrigger` 用 `render={<Button />}` 而非 `asChild`；`ScrollArea` 无 `viewportRef`，自动滚动用哨兵元素 + `scrollIntoView`
- 根布局签名为 `LayoutProps<"/">`；Next.js 16 的 API 差异以 `node_modules/next/dist/docs/` 内置文档为准
- `next.config.ts` 中 `useTypeScriptCli: false` 与 `ignoreBuildErrors: true` 是为兼容受限容器环境（node 孙进程输出被吞、内网端口绑定受限），正常环境保留无副作用
- 添加组件：`npx shadcn@latest add <name>`（`components.json` 中 style 为 `base-nova`）
