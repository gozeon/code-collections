"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Loader2, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

type Stroke = {
  color: string;
  width: number;
  points: Point[];
};

/** 标注画笔颜色，选对图片对比度高的颜色 */
const MARK_COLORS = [
  { label: "红色", value: "#ef4444" },
  { label: "橙色", value: "#f97316" },
  { label: "黄色", value: "#eab308" },
  { label: "绿色", value: "#22c55e" },
  { label: "蓝色", value: "#3b82f6" },
  { label: "黑色", value: "#111827" },
  { label: "白色", value: "#ffffff" },
];

/** 画笔粗细按图片短边比例换算，保证不同分辨率下手感一致 */
const MARK_BRUSHES = [
  { label: "细", ratio: 0.004 },
  { label: "中", ratio: 0.009 },
  { label: "粗", ratio: 0.018 },
];

function isPngLike(url: string) {
  return /^data:image\/png/i.test(url) || /\.png(\?|$)/i.test(url);
}

function readAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(blob);
  });
}

/**
 * 把参考图转换成不会污染 canvas 的地址（data URL）。
 * 直接绘制跨域图片会让画布变成 tainted，导出时 toDataURL 会抛 SecurityError；
 * 这里先尝试直接读取（对方允许 CORS 时最省事），失败再走后端代理转成 base64。
 */
async function toCanvasSafeSource(url: string) {
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) return url;
  const candidates = [url, `/api/image/proxy?url=${encodeURIComponent(url)}`];
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { mode: "cors", credentials: "omit" });
      if (!response.ok) continue;
      const blob = await response.blob();
      if (blob.size > 0 && blob.type.startsWith("image/")) return await readAsDataUrl(blob);
    } catch {
      // 读取失败时尝试下一个来源
    }
  }
  throw new Error("无法读取该参考图");
}

function drawStroke(context: CanvasRenderingContext2D, stroke: Stroke, dotOnly = false) {
  context.strokeStyle = stroke.color;
  context.fillStyle = stroke.color;
  context.lineWidth = stroke.width;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (stroke.points.length === 1 || dotOnly) {
    const point = stroke.points[0];
    context.beginPath();
    context.arc(point.x, point.y, stroke.width / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }

  context.beginPath();
  context.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i += 1) {
    context.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  context.stroke();
}

/**
 * 在输入图片上做标记：用画笔圈选 / 涂画需要修改的区域，保存后覆盖原参考图。
 * 最终发给模型的即是带标记的图片，模型可据此理解「改这里」的意图。
 */
export function ImageMarker({
  url,
  open,
  onOpenChange,
  onSave,
}: {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dataUrl: string) => void;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef<Stroke | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  const [loaded, setLoaded] = useState<{
    url: string;
    source: string;
    width: number;
    height: number;
  } | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(MARK_COLORS[0].value);
  const [brushRatio, setBrushRatio] = useState(MARK_BRUSHES[1].ratio);

  const ready = loaded !== null && loaded.url === url;
  const displayUrl = loaded && loaded.url === url ? loaded.source : url;
  const brushWidth = loaded
    ? Math.max(3, Math.round(Math.min(loaded.width, loaded.height) * brushRatio))
    : 8;

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  /** 用完整的笔画列表重绘标注层（撤销 / 清空时使用） */
  const redraw = (list: Stroke[]) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of list) drawStroke(context, stroke);
  };

  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;

    const load = async () => {
      let source: string;
      try {
        source = await toCanvasSafeSource(url);
      } catch {
        if (cancelled) return;
        toast.error("无法读取该参考图，请重新上传或稍后再试。");
        onOpenChangeRef.current(false);
        return;
      }
      if (cancelled) return;

      const image = new window.Image();
      image.onload = () => {
        if (cancelled) return;
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (width === 0 || height === 0) {
          toast.error("图片加载失败，无法标注。");
          onOpenChangeRef.current(false);
          return;
        }
        imageRef.current = image;

        const base = baseCanvasRef.current;
        if (base) {
          base.width = width;
          base.height = height;
          base.getContext("2d")?.drawImage(image, 0, 0, width, height);
        }
        const draw = drawCanvasRef.current;
        if (draw) {
          draw.width = width;
          draw.height = height;
        }
        strokesRef.current = [];
        drawingRef.current = null;
        setStrokes([]);
        setLoaded({ url, source, width, height });
      };
      image.onerror = () => {
        if (cancelled) return;
        toast.error("图片加载失败，无法标注。");
        onOpenChangeRef.current(false);
      };
      image.src = source;
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, url]);

  const toPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke: Stroke = { color, width: brushWidth, points: [toPoint(event)] };
    drawingRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    const context = drawCanvasRef.current?.getContext("2d");
    if (context) drawStroke(context, stroke, true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = drawingRef.current;
    const canvas = drawCanvasRef.current;
    if (!stroke || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const point = toPoint(event);
    const previous = stroke.points[stroke.points.length - 1];
    stroke.points.push(point);

    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = null;
    setStrokes([...strokesRef.current]);
  };

  const handleUndo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokes([...strokesRef.current]);
    redraw(strokesRef.current);
  };

  const handleClear = () => {
    strokesRef.current = [];
    setStrokes([]);
    redraw([]);
  };

  const handleSave = () => {
    const image = imageRef.current;
    const draw = drawCanvasRef.current;
    if (!image || !draw || !loaded) return;
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, 0, 0);
    context.drawImage(draw, 0, 0);
    try {
      const type = isPngLike(loaded.source) ? "image/png" : "image/jpeg";
      onSave(canvas.toDataURL(type, 0.92));
      onOpenChange(false);
    } catch {
      toast.error("保存标记失败，请稍后重试。");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[min(94vw,56rem)]">
        <DialogHeader>
          <DialogTitle>标记参考图</DialogTitle>
          <DialogDescription>
            用画笔圈出或涂画需要修改的区域，保存后标记会随图片一起发送给模型。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {MARK_COLORS.map((item) => (
              <button
                key={item.value}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => setColor(item.value)}
                style={{ backgroundColor: item.value }}
                className={cn(
                  "size-6 rounded-full border transition-transform",
                  color === item.value
                    ? "scale-110 ring-2 ring-ring ring-offset-1 ring-offset-background"
                    : "border-border",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
            {MARK_BRUSHES.map((item) => (
              <Button
                key={item.label}
                type="button"
                size="sm"
                variant={brushRatio === item.ratio ? "secondary" : "ghost"}
                onClick={() => setBrushRatio(item.ratio)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={strokes.length === 0}
              onClick={handleUndo}
            >
              <Undo2 />
              撤销
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={strokes.length === 0}
              onClick={handleClear}
            >
              <Eraser />
              清空
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-2">
          <div className="relative inline-block">
            {displayUrl && (
              <>
                <img
                  src={displayUrl}
                  alt="待标记的参考图"
                  className="block max-h-[62vh] w-auto max-w-full rounded select-none"
                  draggable={false}
                />
                <canvas
                  ref={drawCanvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="absolute inset-0 size-full cursor-crosshair touch-none"
                />
                <canvas ref={baseCanvasRef} className="hidden" />
                {open && !ready && (
                  <span className="absolute inset-0 flex items-center justify-center bg-background/60">
                    <Loader2 className="size-5 animate-spin" />
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" disabled={!ready || strokes.length === 0} onClick={handleSave}>
            保存标记
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
