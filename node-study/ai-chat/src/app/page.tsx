'use client';

import { useChat } from '@ai-sdk/react';
import { 
  DefaultChatTransport, 
  isTextUIPart, 
  isToolUIPart, 
  isDynamicToolUIPart,
  UIMessage,
} from 'ai';
import { Bubbles, MessagesSquare, Send, Settings, User, Wrench, Loader2, Bot, AlertCircle, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============ Markdown 渲染组件 ============

function MarkdownContent({ textParts }: { textParts: { text: string }[] }) {
  const content = useMemo(
    () => textParts.map((p) => p.text).join(''),
    [textParts]
  );

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ============ 主页面 ============

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Settings state
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [model, setModel] = useState('auto');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Use Chat with transport
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        apiKey,
        baseURL,
        model,
      },
    }),
  });

  // 流式结束后自动聚焦输入框
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === 'streaming' && status === 'ready') {
      inputRef.current?.focus();
    }
    prevStatus.current = status;
  }, [status]);

  // URL 携带 uid 参数时自动发起分析
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (autoSentRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    if (uid && status === 'ready') {
      autoSentRef.current = true;
      sendMessage({ text: uid });
    }
  }, [status]);

  // 同步 chat error 到本地状态
  useEffect(() => {
    if (error) {
      setErrorMsg(error.message || '发生未知错误');
    }
  }, [error]);

  // 自动滚动到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && status !== 'streaming') {
      sendMessage({ text: inputValue });
      setInputValue('');
    }
  };

  // Get tool name from part
  const getToolName = (part: NonNullable<UIMessage['parts']>[number]): string => {
    if (isDynamicToolUIPart(part)) {
      return part.toolName;
    }
    if (isToolUIPart(part)) {
      // For static tools, type is like 'tool-getWeather', extract the name after 'tool-'
      return part.type.replace('tool-', '');
    }
    return 'unknown';
  };

  // Get tool state display text
  const getToolStateText = (part: NonNullable<UIMessage['parts']>[number]): string => {
    if (!isToolUIPart(part) && !isDynamicToolUIPart(part)) {
      return '';
    }
    switch (part.state) {
      case 'input-streaming':
        return '输入中...';
      case 'input-available':
        return '已接收参数';
      case 'approval-requested':
        return '等待批准';
      case 'approval-responded':
        return '已批准';
      case 'output-available':
        return '执行完成';
      case 'output-error':
        return '执行错误';
      case "output-denied":
        return '被拒绝';
      default:
        const toolPart = part as { state: string };
        return String(toolPart.state);
    }
  };

  // Check if part is a tool call
  const isToolCall = (part: NonNullable<UIMessage['parts']>[number]): boolean => {
    return isToolUIPart(part) || isDynamicToolUIPart(part);
  };

  // Check if tool has output (completed)
  const hasToolOutput = (part: NonNullable<UIMessage['parts']>[number]): boolean => {
    if (!isToolUIPart(part) && !isDynamicToolUIPart(part)) {
      return false;
    }
    return part.state === 'output-available' && 'output' in part && part.output !== undefined;
  };

  // Get tool output
  const getToolOutput = (part: NonNullable<UIMessage['parts']>[number]): string => {
    if (!isToolUIPart(part) && !isDynamicToolUIPart(part)) {
      return '';
    }
    const output = 'output' in part ? part.output : undefined;
    if (output === undefined) return '';
    if (typeof output === 'object') return JSON.stringify(output);
    return String(output);
  };

  // Get tool input
  const getToolInput = (part: NonNullable<UIMessage['parts']>[number]): string => {
    if (!isToolUIPart(part) && !isDynamicToolUIPart(part)) {
      return '';
    }
    const input = 'input' in part ? part.input : undefined;
    if (input === undefined) return '';
    if (typeof input === 'object') return JSON.stringify(input);
    return String(input);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500 text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">客服AI专家</h1>
              <p className="text-xs text-zinc-500">流媒体运营与用户画像分析</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="输入你的 API Key"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                模型
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="auto"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <MessagesSquare className="w-8 h-8" />
                <Bubbles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                开始分析
              </h2>
              <p className="text-sm text-zinc-500">
                请输入用户UID，AI 将为您生成用户画像与沟通指南
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">请求出错</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-0.5 break-words">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {messages.map((message) => {
            const isStreaming = status === 'streaming' && message.role === 'assistant';
            const toolParts = message.parts?.filter(isToolCall) || [];
            const textParts = message.parts?.filter(isTextUIPart) || [];
            const hasText = textParts.length > 0;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Tool Calls */}
                  {toolParts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {toolParts.map((toolPart, toolIndex) => (
                        <div key={toolIndex} className="flex flex-col gap-1">
                          {/* Tool Header */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg">
                            <Wrench className="w-3 h-3" />
                            <span>工具: {getToolName(toolPart)}</span>
                            <span className="px-1.5 py-0.5 bg-zinc-300 dark:bg-zinc-600 rounded text-zinc-600 dark:text-zinc-400">
                              {getToolStateText(toolPart)}
                            </span>
                          </div>

                          {/* Tool Input Card */}
                          {getToolInput(toolPart) && (
                            <div className="flex items-start gap-2 px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg min-w-0">
                              {hasToolOutput(toolPart) ? (
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (toolPart as any).state === 'output-error' ? (
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
                              )}
                              <div className="text-xs opacity-70 break-all min-w-0">
                                参数: {getToolInput(toolPart)}
                              </div>
                            </div>
                          )}

                          {/* Tool Output Card */}
                          {hasToolOutput(toolPart) && (
                            <div className="flex items-start gap-2 px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg min-w-0">
                              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <code className="text-xs break-all whitespace-pre-wrap min-w-0">
                                {getToolOutput(toolPart)}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Bubble */}
                  {(hasText || message.role === 'user') && (
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl text-left ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-tr-md'
                          : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-tl-md'
                      }`}
                    >
                      {isStreaming && !hasText ? (
                        <div className="flex gap-1 py-1">
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : message.role === 'user' ? (
                        <div className="whitespace-pre-wrap break-words">
                          {textParts.map((part, partIndex) => (
                            <span key={partIndex}>{part.text}</span>
                          ))}
                        </div>
                      ) : (
                        <MarkdownContent textParts={textParts} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form */}
      <footer className="px-6 py-4 bg-white border-t border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入用户UID..."
              disabled={status === 'streaming'}
              className="flex-1 px-4 py-3 bg-zinc-100 border-0 rounded-xl dark:bg-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'streaming' || !inputValue.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
