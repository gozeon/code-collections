"use client";

import { useChat } from "@ai-sdk/react";
import type { FileUIPart, UIMessage } from "ai";
import {
  Bot,
  Brush,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  Images,
  Loader2,
  Maximize2,
  MessageSquare,
  PencilLine,
  Send,
  Settings,
  Square,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ImageMarker } from "@/components/image-marker";
import { Markdown } from "@/components/markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { parseImageCount } from "@/lib/image-count";
import { cn } from "@/lib/utils";

type ChatSettings = {
  // 对话模型（OpenAI 兼容）
  apiKey: string;
  model: string;
  baseUrl: string;
  // 即梦图片生成
  jimengProvider: "" | "volc" | "ark";
  jimengAccessKeyId: string;
  jimengSecretAccessKey: string;
  jimengRegion: string;
  jimengReqKey: string;
  jimengEditReqKey: string;
  jimengApiKey: string;
  jimengBaseUrl: string;
  jimengModel: string;
};

type JimengPayload = {
  provider?: "volc" | "ark";
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  reqKey?: string;
  editReqKey?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

const SETTINGS_STORAGE_KEY = "chat-settings";
const DEFAULT_SETTINGS: ChatSettings = {
  apiKey: "",
  model: "",
  baseUrl: "",
  jimengProvider: "",
  jimengAccessKeyId: "",
  jimengSecretAccessKey: "",
  jimengRegion: "",
  jimengReqKey: "",
  jimengEditReqKey: "",
  jimengApiKey: "",
  jimengBaseUrl: "",
  jimengModel: "",
};

const IMAGE_SIZES = [
  { label: "1:1 · 1024×1024", value: "1024x1024" },
  { label: "4:3 · 1152×864", value: "1152x864" },
  { label: "3:4 · 864×1152", value: "864x1152" },
  { label: "16:9 · 1280×720", value: "1280x720" },
  { label: "9:16 · 720×1280", value: "720x1280" },
];

const MAX_ATTACHMENTS = 4;
const MAX_IMAGE_EDGE = 2048;

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function mediaTypeOf(url: string) {
  return /^data:([^;,]+)/.exec(url)?.[1] ?? "image/png";
}

/** 等比缩小过大的参考图，避免请求体过大 */
async function downscaleImage(dataUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("无法解析该图片"));
    element.src = dataUrl;
  });
  const edge = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = edge > 0 ? Math.min(1, MAX_IMAGE_EDGE / edge) : 1;
  if (scale >= 1) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const type = mediaTypeOf(dataUrl) === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(type, 0.92);
}

async function readImageFile(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
  return downscaleImage(dataUrl);
}

function jimengPayload(settings: ChatSettings): JimengPayload {
  return {
    provider: settings.jimengProvider || undefined,
    accessKeyId: settings.jimengAccessKeyId.trim() || undefined,
    secretAccessKey: settings.jimengSecretAccessKey.trim() || undefined,
    region: settings.jimengRegion.trim() || undefined,
    reqKey: settings.jimengReqKey.trim() || undefined,
    editReqKey: settings.jimengEditReqKey.trim() || undefined,
    apiKey: settings.jimengApiKey.trim() || undefined,
    baseUrl: settings.jimengBaseUrl.trim() || undefined,
    model: settings.jimengModel.trim() || undefined,
  };
}

function GeneratedImage({
  url,
  onPreview,
  onEdit,
}: {
  url: string;
  onPreview: () => void;
  onEdit: (url: string) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border">
      <button
        type="button"
        title="预览图片"
        onClick={onPreview}
        className="block cursor-zoom-in"
      >
        <img src={url} alt="即梦生成的图片" className="size-40 object-cover sm:size-48" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Maximize2 className="size-5" />
        </span>
      </button>
      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          title="用作参考图（图生图 / 图片修改）"
          onClick={() => onEdit(url)}
          className={cn(buttonVariants({ variant: "secondary", size: "icon-xs" }))}
        >
          <PencilLine />
        </button>
        <a
          href={url}
          download
          target="_blank"
          rel="noreferrer"
          title="下载图片"
          className={cn(buttonVariants({ variant: "secondary", size: "icon-xs" }))}
        >
          <Download />
        </a>
      </div>
    </div>
  );
}

function ImagePreviewDialog({
  urls,
  index,
  onIndexChange,
  onOpenChange,
  onEdit,
}: {
  urls: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
  onEdit: (url: string) => void;
}) {
  const url = urls[index];
  if (!url) return null;
  const hasMultiple = urls.length > 1;
  const step = (delta: number) => onIndexChange((index + delta + urls.length) % urls.length);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[min(92vw,64rem)]"
        onKeyDown={(event) => {
          if (!hasMultiple) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>图片预览</DialogTitle>
          <DialogDescription>查看生成的图片，可下载或用作参考图</DialogDescription>
        </DialogHeader>
        <div className="relative flex items-center justify-center rounded-lg border bg-muted/30 p-2">
          <img
            src={url}
            alt="图片预览"
            className="max-h-[70vh] w-auto max-w-full rounded object-contain"
          />
          {hasMultiple && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                title="上一张"
                className="absolute top-1/2 left-2 -translate-y-1/2"
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                title="下一张"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => step(1)}
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {hasMultiple ? `${index + 1} / ${urls.length}` : "预览"}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onEdit(url)}>
              <PencilLine />
              用作参考图
            </Button>
            <a
              href={url}
              download
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Download />
              下载
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Chat() {
  const { messages, sendMessage, setMessages, stop, status } = useChat();
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<ChatSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      // 忽略损坏的本地配置
      return DEFAULT_SETTINGS;
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "image">("chat");
  const [size, setSize] = useState(IMAGE_SIZES[0].value);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [markingIndex, setMarkingIndex] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<{ urls: string[]; index: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const isWorking = isBusy || generating;
  const imageMode = mode === "image";
  const requestedCount = parseImageCount(input);
  const generatedImages = messages.flatMap((message) =>
    message.parts.flatMap((part) =>
      part.type === "file" && part.mediaType.startsWith("image/") ? [part.url] : [],
    ),
  );

  const updateSettings = (patch: Partial<ChatSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const generateImage = async (prompt: string, references: string[]) => {
    const controller = new AbortController();
    abortRef.current = controller;
    setGenerating(true);
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          images: references,
          count: parseImageCount(prompt),
          size,
          jimeng: jimengPayload(settings),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { images?: string[]; error?: string }
        | null;
      if (!response.ok) throw new Error(data?.error || `生成失败（HTTP ${response.status}）`);

      const images = (data?.images ?? []).filter(Boolean);
      if (images.length === 0) throw new Error("接口没有返回图片，请稍后重试。");

      const reply: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: images.map<FileUIPart>((url) => ({
          type: "file",
          mediaType: mediaTypeOf(url),
          filename: "jimeng-image",
          url,
        })),
      };
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: prompt }] },
        reply,
      ]);
      setInput("");
      setAttachments([]);
    } catch (error) {
      if (controller.signal.aborted) return;
      toast.error(error instanceof Error ? error.message : "图片生成失败，请稍后重试。");
    } finally {
      abortRef.current = null;
      setGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isWorking) return;
    if (imageMode) {
      void generateImage(text, attachments);
      return;
    }
    sendMessage(
      { text },
      {
        body: {
          apiKey: settings.apiKey || undefined,
          model: settings.model || undefined,
          baseUrl: settings.baseUrl || undefined,
        },
      },
    );
    setInput("");
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      toast.info(`最多上传 ${MAX_ATTACHMENTS} 张参考图`);
      return;
    }
    try {
      const loaded = await Promise.all(files.slice(0, remaining).map(readImageFile));
      setAttachments((prev) => [...prev, ...loaded].slice(0, MAX_ATTACHMENTS));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "图片读取失败");
    }
  };

  const applyAsReference = (url: string) => {
    setMode("image");
    setAttachments((prev) => (prev.includes(url) ? prev : [...prev, url].slice(-MAX_ATTACHMENTS)));
    toast.info("已设为参考图，输入修改指令后点击生成");
  };

  const openPreview = (urls: string[], url: string) => {
    const index = urls.indexOf(url);
    setPreview({ urls, index: index >= 0 ? index : 0 });
  };

  const handleStop = () => {
    if (generating) {
      abortRef.current?.abort();
      setGenerating(false);
      return;
    }
    stop();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, generating]);

  return (
    <Card className="flex h-dvh w-full flex-col rounded-none border-0">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Bot className="size-5" />
            AI Chat
          </span>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DialogTrigger
                    render={
                      <Button type="button" variant="ghost" size="icon">
                        <Settings className="size-4" />
                      </Button>
                    }
                  />
                }
              />
              <TooltipContent>接口设置</TooltipContent>
            </Tooltip>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>接口设置</DialogTitle>
                <DialogDescription>
                  留空则使用服务端环境变量中的默认配置，凭证仅保存在浏览器本地。
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium text-muted-foreground">对话模型（OpenAI 兼容）</p>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">API 密钥</span>
                    <Input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => updateSettings({ apiKey: e.target.value })}
                      placeholder="sk-...（留空使用 OPENAI_API_KEY）"
                      autoComplete="off"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">模型</span>
                    <Input
                      value={settings.model}
                      onChange={(e) => updateSettings({ model: e.target.value })}
                      placeholder="deepseek-v4-flash-202605"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">代理地址</span>
                    <Input
                      value={settings.baseUrl}
                      onChange={(e) => updateSettings({ baseUrl: e.target.value })}
                      placeholder="https://api.openai.com/v1"
                    />
                  </label>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    即梦图片生成（文生图 / 图生图）
                  </p>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">提供方</span>
                    <select
                      className={selectClassName}
                      value={settings.jimengProvider}
                      onChange={(e) =>
                        updateSettings({ jimengProvider: e.target.value as ChatSettings["jimengProvider"] })
                      }
                    >
                      <option value="">自动（有 AK/SK 用视觉智能，否则用方舟）</option>
                      <option value="volc">火山引擎视觉智能（AK/SK）</option>
                      <option value="ark">火山方舟（API Key）</option>
                    </select>
                  </label>

                  <p className="text-xs text-muted-foreground">火山引擎视觉智能（AK/SK，即梦图片生成）</p>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">AccessKeyId</span>
                    <Input
                      value={settings.jimengAccessKeyId}
                      onChange={(e) => updateSettings({ jimengAccessKeyId: e.target.value })}
                      placeholder="AKLT...（留空使用 JIMENG_ACCESS_KEY_ID）"
                      autoComplete="off"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">SecretAccessKey</span>
                    <Input
                      type="password"
                      value={settings.jimengSecretAccessKey}
                      onChange={(e) => updateSettings({ jimengSecretAccessKey: e.target.value })}
                      placeholder="留空使用 JIMENG_SECRET_ACCESS_KEY"
                      autoComplete="off"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium">Region</span>
                      <Input
                        value={settings.jimengRegion}
                        onChange={(e) => updateSettings({ jimengRegion: e.target.value })}
                        placeholder="cn-north-1"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium">文生图 req_key</span>
                      <Input
                        value={settings.jimengReqKey}
                        onChange={(e) => updateSettings({ jimengReqKey: e.target.value })}
                        placeholder="jimeng_high_aes_general_v21_L"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">图生图 / 图片修改 req_key</span>
                    <Input
                      value={settings.jimengEditReqKey}
                      onChange={(e) => updateSettings({ jimengEditReqKey: e.target.value })}
                      placeholder="留空则与文生图一致（如 byteedit_v2.0）"
                    />
                  </label>

                  <p className="text-xs text-muted-foreground">火山方舟（OpenAI 兼容，API Key）</p>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">方舟 API Key</span>
                    <Input
                      type="password"
                      value={settings.jimengApiKey}
                      onChange={(e) => updateSettings({ jimengApiKey: e.target.value })}
                      placeholder="留空使用 JIMENG_API_KEY"
                      autoComplete="off"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium">方舟 Base URL</span>
                      <Input
                        value={settings.jimengBaseUrl}
                        onChange={(e) => updateSettings({ jimengBaseUrl: e.target.value })}
                        placeholder="https://ark.cn-beijing.volces.com/api/v3"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium">图片模型</span>
                      <Input
                        value={settings.jimengModel}
                        onChange={(e) => updateSettings({ jimengModel: e.target.value })}
                        placeholder="doubao-seedream-4-0-250828"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-4">
            {messages.length === 0 && !isWorking && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                {imageMode
                  ? "描述画面开始生成图片，或上传参考图做图生图 / 图片修改"
                  : "输入消息开始对话，或切换到「画图」按文字生成图片"}
              </p>
            )}
            {messages.map((message) => {
              const textParts = message.parts.filter((part) => part.type === "text");
              const imageParts = message.parts.filter(
                (part): part is FileUIPart =>
                  part.type === "file" && part.mediaType.startsWith("image/"),
              );
              if (textParts.length === 0 && imageParts.length === 0) return null;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" && "flex-row-reverse",
                  )}
                >
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {message.role === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex max-w-[85%] flex-col gap-2 text-sm leading-relaxed",
                      textParts.length > 0 &&
                        (message.role === "user"
                          ? "rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                          : "rounded-lg bg-muted px-3 py-2"),
                    )}
                  >
                    {textParts.map((part, i) =>
                      message.role === "user" ? (
                        <span key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      ) : (
                        <Markdown key={i}>{part.text}</Markdown>
                      ),
                    )}
                    {imageParts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {imageParts.map((part, i) => (
                          <GeneratedImage
                            key={i}
                            url={part.url}
                            onPreview={() => openPreview(generatedImages, part.url)}
                            onEdit={applyAsReference}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                思考中...
              </div>
            )}
            {generating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                正在生成图片，请稍候...
              </div>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">
                请求出错，请检查 API Key 配置后重试。
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
          {imageMode && attachments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {attachments.map((source, i) => (
                <div key={i} className="relative">
                  <img
                    src={source}
                    alt={`参考图 ${i + 1}`}
                    className="size-16 rounded-md border object-cover"
                  />
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-label="标记参考图"
                          onClick={() => setMarkingIndex(i)}
                          className={cn(
                            buttonVariants({ variant: "secondary", size: "icon-xs" }),
                            "absolute -bottom-1.5 -left-1.5 rounded-full",
                          )}
                        >
                          <Brush />
                        </button>
                      }
                    />
                    <TooltipContent>标记参考图（圈出要修改的区域）</TooltipContent>
                  </Tooltip>
                  <button
                    type="button"
                    title="移除参考图"
                    onClick={() => setAttachments((prev) => prev.filter((_, index) => index !== i))}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "icon-xs" }),
                      "absolute -top-1.5 -right-1.5 rounded-full",
                    )}
                  >
                    <X />
                  </button>
                </div>
              ))}
              <span className="text-xs text-muted-foreground">
                将基于参考图生成（图生图 / 图片修改），可点画笔标记要修改的区域
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
              <Button
                type="button"
                size="sm"
                variant={imageMode ? "ghost" : "secondary"}
                onClick={() => setMode("chat")}
              >
                <MessageSquare />
                对话
              </Button>
              <Button
                type="button"
                size="sm"
                variant={imageMode ? "secondary" : "ghost"}
                onClick={() => setMode("image")}
              >
                <Images />
                画图
              </Button>
            </div>
            {imageMode && (
              <select
                aria-label="图片尺寸"
                className={cn(selectClassName, "h-7 w-auto text-xs")}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {IMAGE_SIZES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
            {imageMode && (
              <span className="text-xs text-muted-foreground">
                {attachments.length > 0 ? "图生图 / 图片修改" : "文生图"}
                {requestedCount && requestedCount > 1
                  ? ` · 将生成 ${requestedCount} 张`
                  : ""}
              </span>
            )}
          </div>

          <div className="flex w-full items-end gap-2">
            {imageMode && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFiles}
                />
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        disabled={attachments.length >= MAX_ATTACHMENTS}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="size-4" />
                      </Button>
                    }
                  />
                  <TooltipContent>上传参考图（图生图 / 图片修改）</TooltipContent>
                </Tooltip>
              </>
            )}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                imageMode
                  ? attachments.length > 0
                    ? "描述想要的修改，例如：把背景换成海边落日（可写「生成 4 张」）"
                    : "描述画面，例如：一只戴墨镜的柴犬，赛博朋克风格（可写「生成 4 张」）"
                  : "输入消息，Enter 发送，Shift+Enter 换行"
              }
              rows={1}
              className="max-h-32 min-h-9 resize-none"
            />
            {isWorking ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button type="button" variant="destructive" size="icon-lg" onClick={handleStop}>
                      <Square className="size-4" />
                    </Button>
                  }
                />
                <TooltipContent>停止</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button type="submit" size="icon-lg" disabled={!input.trim()}>
                      <Send className="size-4" />
                    </Button>
                  }
                />
                <TooltipContent>{imageMode ? "生成图片" : "发送"}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </form>
      </CardFooter>

      <ImageMarker
        url={markingIndex !== null ? (attachments[markingIndex] ?? "") : ""}
        open={markingIndex !== null}
        onOpenChange={(open) => {
          if (!open) setMarkingIndex(null);
        }}
        onSave={(dataUrl) => {
          setAttachments((prev) =>
            prev.map((item, index) => (index === markingIndex ? dataUrl : item)),
          );
          toast.success("标记已应用到参考图");
        }}
      />

      {preview && (
        <ImagePreviewDialog
          urls={preview.urls}
          index={preview.index}
          onIndexChange={(index) => setPreview((prev) => (prev ? { ...prev, index } : prev))}
          onOpenChange={(open) => {
            if (!open) setPreview(null);
          }}
          onEdit={(url) => {
            setPreview(null);
            applyAsReference(url);
          }}
        />
      )}
    </Card>
  );
}
