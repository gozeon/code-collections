# AI Chat — 流媒体用户画像分析系统

基于 Next.js + Tailwind CSS + Vercel AI SDK 的 AI 客服助手，通过 MySQL 数据查询 + 话术匹配，为客服人员自动生成用户画像与沟通指南。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.x | React 全栈框架 (App Router) |
| React | 19.x | UI 组件库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS 样式 |
| Vercel AI SDK | 7.x | AI 对话、工具调用、流式响应 |
| @ai-sdk/openai | 4.x | OpenAI 兼容 API 提供商 |
| mysql2 | 3.x | MySQL 数据库直连查询 |
| react-markdown | 10.x | AI 回复 Markdown 渲染 |
| remark-gfm | 4.x | GitHub Flavored Markdown 支持 |
| Zod | 4.x | Schema 验证 |
| Lucide React | 1.x | SVG 图标库 |
| pnpm | 10.x | 包管理器 |

## 功能特性

- **流式对话** — AI 回复实时逐字输出
- **多工具并行调用** — 同时查询设备信息、工单记录、观看历史，三步完成用户画像分析
- **话术智能匹配** — AI 根据用户问题自动匹配话术库中的沟通话术
- **Markdown 渲染** — 输出支持标题、表格、代码块、列表等富文本格式
- **深色/浅色模式** — 跟随系统主题自动切换
- **自定义 API 配置** — 支持自定义 API Key、Base URL、模型名称
- **URL 参数自动触发** — 支持 `?uid=xxx` 参数自动发起查询
- **响应式布局** — 适配桌面和移动端

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# OpenAI API
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# MySQL
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
```

### 3. 准备话术数据

话术 JSON 文件位于 `src/data/talkScripts.json`，格式：

```json
[
  { "rule_id": "R001", "具体问题": "用户反馈播放卡顿", "话术": "您好，非常抱歉给您带来不便..." },
  { "rule_id": "R002", "具体问题": "用户询问会员续费", "话术": "您好，您当前的会员..." }
]
```

### 4. 启动开发服务器

```bash
pnpm dev
```

打开 http://localhost:3000 查看应用。

输入 UID 后，AI 将自动查询数据库并生成用户画像。

### 5. 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
ai-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts        # AI 对话 API (Node.js Runtime)
│   │   ├── globals.css             # 全局样式 + Markdown 样式
│   │   ├── layout.tsx              # 根布局
│   │   └── page.tsx                # 聊天主页面
│   ├── components/                 # 组件目录 (预留)
│   └── data/
│       └── talkScripts.json        # 话术规则库
├── .env.example                    # 环境变量示例
├── next.config.ts                  # Next.js 配置
├── postcss.config.mjs              # PostCSS 配置
├── tsconfig.json                   # TypeScript 配置
├── eslint.config.mjs               # ESLint 配置
├── package.json
└── pnpm-lock.yaml
```

## API 路由

### POST /api/chat

接收前端发送的对话消息，调用 AI 模型生成回复，支持流式响应和工具调用。

**请求体：**

```json
{
  "messages": [...],
  "apiKey": "sk-xxx",
  "baseURL": "https://...",
  "model": "auto"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| messages | array | 是 | 对话消息列表 |
| apiKey | string | 否 | 覆盖环境变量 OPENAI_API_KEY |
| baseURL | string | 否 | 覆盖环境变量 OPENAI_BASE_URL |
| model | string | 否 | 模型名称，默认 "auto" |

**内置工具：**

| 工具 | 数据源 | 描述 |
|------|------|------|
| `getUserDeviceInfo` | `wise_ai_faq.device_record` | 查询用户设备信息（型号、操作系统、App版本） |
| `getUserFeedbackInfo` | `wise_ai_faq.feedback_chat` | 查询用户工单聊天记录（最近10条） |
| `getUserViewHistory` | `wise_ai_media.watchHistory` | 查询用户观看历史（最近10条） |
| `getTalkScriptByRuleId` | `src/data/talkScripts.json` | 根据 rule_id 匹配沟通话术 |

**AI 工作流程：**

1. 用户输入 UID → 并行调用 `getUserDeviceInfo`、`getUserFeedbackInfo`、`getUserViewHistory`
2. AI 根据查询结果对比话术规则库，匹配最相关的 rule_id，调用 `getTalkScriptByRuleId`
3. 综合输出 **用户画像**（设备、行为、问题）和 **沟通指南**（策略、风险、话术、跟进）

## 自定义

### 更换 AI 模型

在 `src/app/api/chat/route.ts` 中修改：

```typescript
const result = await streamText({
  model: openai('gpt-4o'),  // 更换为其他模型
  ...
});
```

支持的模型：
- OpenAI: `gpt-4o`、`gpt-4-turbo`、`gpt-3.5-turbo`
- 其他兼容 OpenAI API 的服务（如 DeepSeek、Moonshot 等）

### 添加自定义工具

在 `src/app/api/chat/route.ts` 中定义新工具：

```typescript
const myTool = tool({
  description: '工具描述',
  inputSchema: zodSchema(z.object({
    param: z.string().describe('参数描述'),
  })),
  execute: async ({ param }) => {
    // 工具执行逻辑
    return { result: '...' };
  },
});
```

然后在 `streamText` 的 `tools` 中注册即可。

## 常见问题

### "Invalid input" 错误

如果 AI 流式回复中出现此错误，通常是因为 MySQL 查询返回了 `Date` 对象而非字符串。所有工具已在 `execute` 中将 `Date` 字段转换为 ISO 8601 字符串格式，确保 Zod 验证通过。

## License

MIT
