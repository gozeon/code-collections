import { createOpenAI } from '@ai-sdk/openai';
import { streamText, createUIMessageStreamResponse, toUIMessageStream, convertToModelMessages, tool, zodSchema, stepCountIs } from 'ai';
import { z } from 'zod';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// MySQL 直连需要 nodejs runtime
export const runtime = 'nodejs';
export const maxDuration = 60;

// ============ MySQL 连接池 ============

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'wise_ai_faq',
  waitForConnections: true,
  connectionLimit: 5,
});

// 第二个库（观看记录）
const mediaPool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'wise_ai_media',
  waitForConnections: true,
  connectionLimit: 5,
});

// ============ 话术 JSON 加载 ============

function loadTalkScripts(): { rule_id: string; 具体问题: string; 话术: string }[] {
  const filePath = path.join(process.cwd(), 'src/data/talkScripts.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ============ 工具定义 ============

// 平台枚举映射
const PLATFORM_MAP: Record<number, string> = {
  0: 'IOS',
  1: 'Android',
  2: '鸿蒙',
};

const getUserDeviceInfo = tool({
  description: '根据用户UID查询设备信息，包括设备型号、操作系统、App版本等',
  inputSchema: zodSchema(z.object({
    deviceId: z.string().describe('用户设备ID（UID）'),
  })),
  execute: async ({ deviceId }: { deviceId: string }) => {
    try {
      const [rows] = await pool.execute(
        'SELECT platform, sysVersion, model, time, version FROM device_record WHERE deviceId = ?',
        [deviceId]
      );
      const devices = (rows as any[]).map((row) => ({
        platform: PLATFORM_MAP[row.platform] ?? '未知',
        sysVersion: row.sysVersion ?? '未知',
        model: row.model ?? '未知',
        time: row.time instanceof Date ? row.time.toISOString() : String(row.time ?? ''),
        version: row.version ?? '未知',
      }));
      if (devices.length === 0) {
        return { deviceId, deviceCount: 0, devices: [], message: '新用户，无设备记录' };
      }
      return { deviceId, deviceCount: devices.length, devices };
    } catch (error) {
      console.error('getUserDeviceInfo error:', error);
      return { error: '设备信息查询失败', deviceId, detail: String(error) };
    }
  },
});

const getUserFeedbackInfo = tool({
  description: '根据用户UID查询工单聊天记录，包括发送人、接收人、消息内容、时间等',
  inputSchema: zodSchema(z.object({
    deviceId: z.string().describe('用户设备ID（UID）'),
  })),
  execute: async ({ deviceId }: { deviceId: string }) => {
    try {
      const [rows] = await pool.execute(
        'SELECT send_user as SendUser, receive_user as ReceiveUser, message, time FROM feedback_chat WHERE send_user = ? OR receive_user = ? ORDER BY time DESC LIMIT 10',
        [deviceId, deviceId]
      );
      const feedbacks = (rows as any[]).map((row) => ({
        SendUser: (row.SendUser === 'admin' ? '管理员' : row.SendUser) ?? '未知',
        ReceiveUser: (row.ReceiveUser === 'admin' ? '管理员' : row.ReceiveUser) ?? '未知',
        message: row.message ?? '',
        time: row.time instanceof Date ? row.time.toISOString() : String(row.time ?? ''),
      }));
      if (feedbacks.length === 0) {
        return { deviceId, feedbackCount: 0, feedbacks: [], message: '无工单记录' };
      }
      return { deviceId, feedbackCount: feedbacks.length, feedbacks };
    } catch (error) {
      console.error('getUserFeedbackInfo error:', error);
      return { error: '工单信息查询失败', deviceId, detail: String(error) };
    }
  },
});

// 媒体类型枚举映射
const MEDIA_TYPE_MAP: Record<string, string> = {
  live: '直播',
  liveBack: '回看',
  vod: '点播',
  series: '系列剧',
  aggregation: '合集',
  episode: '集锦',
};

const getUserViewHistory = tool({
  description: '根据用户UID查询观看历史记录，包括观看内容、类型、标签、观看时间等',
  inputSchema: zodSchema(z.object({
    deviceId: z.string().describe('用户设备ID（UID）'),
  })),
  execute: async ({ deviceId }: { deviceId: string }) => {
    try {
      const [rows] = await mediaPool.execute(
        'SELECT t.item_name as Title, t.tag_names as Tag, t.media_type as MediaType, t.play_time as Playtime FROM user_history_v2 t WHERE device_id = ? ORDER BY play_time DESC LIMIT 15',
        [deviceId]
      );
      const history = (rows as any[]).map((row) => ({
        Title: row.Title ?? '未知',
        Tag: row.Tag ?? '',
        MediaType: MEDIA_TYPE_MAP[row.MediaType] ?? '未知',
        Playtime: row.Playtime instanceof Date ? row.Playtime.toISOString() : String(row.Playtime ?? ''),
      }));
      if (history.length === 0) {
        return { deviceId, historyCount: 0, history: [], message: '新用户，无观看记录' };
      }
      return { deviceId, historyCount: history.length, history };
    } catch (error) {
      console.error('getUserViewHistory error:', error);
      return { error: '观看记录查询失败', deviceId, detail: String(error) };
    }
  },
});

// ============ 话术工具（AI 根据 system prompt 中的规则列表自行匹配，只调一个工具取话术）============

const getTalkScriptByRuleId = tool({
  description: '根据 rule_id 获取对应的话术内容。rule_id 从 system prompt 中列出的话术规则库中选取',
  inputSchema: zodSchema(z.object({
    ruleIds: z.array(z.string()).describe('需要获取话术的 rule_id 数组，从 system prompt 话术规则库中选取最匹配的'),
  })),
  execute: async ({ ruleIds }: { ruleIds: string[] }) => {
    try {
      const allRules = loadTalkScripts();
      const ruleMap = new Map(allRules.map(r => [r.rule_id, r]));
      const matched = ruleIds
        .map(id => ruleMap.get(id))
        .filter(Boolean)
        .map(r => ({ rule_id: r!.rule_id, 具体问题: r!.具体问题, 话术: r!.话术 }));

      if (matched.length === 0) {
        return { ruleIds, matchedCount: 0, matchedRules: [], message: '未找到对应话术，请检查 rule_id 是否正确' };
      }

      return { ruleIds, matchedCount: matched.length, matchedRules: matched };
    } catch (error) {
      console.error('getTalkScriptByRuleId error:', error);
      return { error: '话术查询失败', detail: String(error) };
    }
  },
});

// ============ API 路由 ============

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, apiKey, baseURL, model: modelName } = body;

    const openai = createOpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
      baseURL: baseURL || process.env.OPENAI_BASE_URL,
    });

    const modelMessages = await convertToModelMessages(messages);

    // 构建话术规则库文本（嵌入 system prompt，AI 直接读取匹配）
    const allRules = loadTalkScripts();
    const rulesText = allRules
      .map(r => `- ${r.rule_id}: ${r.具体问题.replace(/\n/g, ' ')}`)
      .join('\n');

    const result = await streamText({
      model: openai(modelName || 'auto'),
      system: `你是一位流媒体客服 AI 专家，根据用户数据生成画像和沟通指南。

## 话术规则库（根据用户问题自行匹配 2-5 条 rule_id）
${rulesText}

## 工作流程
1. 并行调用 getUserDeviceInfo、getUserFeedbackInfo、getUserViewHistory
2. 对照上方规则库匹配最相关的 rule_id，调用 getTalkScriptByRuleId
3. 综合输出：

**用户画像**
- 设备：型号、系统、App版本
- 行为：内容偏好、观看习惯
- 问题：历史反馈类型、满意度

**沟通指南**
- 策略：推荐沟通风格
- 风险：用户敏感点
- 话术：2-3 条最相关话术（附 rule_id）
- 跟进：处理优先级

## 规则
- 无UID先询问；所有工具用 deviceId作参数
- 输出用 Markdown，简洁可操作`,
      messages: modelMessages,
      tools: {
        getUserDeviceInfo,
        getUserFeedbackInfo,
        getUserViewHistory,
        getTalkScriptByRuleId,
      },
      stopWhen: stepCountIs(15),
    });

    const uiStream = toUIMessageStream({
      stream: result.stream,
      tools: {
        getUserDeviceInfo,
        getUserFeedbackInfo,
        getUserViewHistory,
        getTalkScriptByRuleId,
      },
    });

    return createUIMessageStreamResponse({ stream: uiStream });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
