"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Loader2, Undo2 } from "lucide-react";
import Image from "next/image";
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
import { Slider } from "@/components/ui/slider";
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

/**
 * 画笔粗细按图片短边比例换算，保证不同分辨率下手感一致。
 * 最粗一档刻意夸张（短边的 16%），方便一口气涂掉大片区域。
 */
const MARK_BRUSHES = [
  { label: "细", ratio: 0.006 },
  { label: "中", ratio: 0.02 },
  { label: "粗", ratio: 0.06 },
  { label: "超粗", ratio: 0.16 },
];

/** 滑块范围取最细与最粗两档，默认停在「中」档 */
const MARK_BRUSH_MIN = MARK_BRUSHES[0].ratio;
const MARK_BRUSH_MAX = MARK_BRUSHES[MARK_BRUSHES.length - 1].ratio;
const MARK_BRUSH_DEFAULT = MARK_BRUSHES[1].ratio;
/**
 * 步进取满量程的 1/32：每拖动一格画笔直径都有肉眼可见的变化，
 * 又不会细碎到要推很久；由档位推算，改档位时不用同步维护这个值。
 */
const MARK_BRUSH_STEP = (MARK_BRUSH_MAX - MARK_BRUSH_MIN) / 32;

/** 画笔在画布上的最小宽度（画布像素），避免小图配细笔时细到看不见 */
const MARK_BRUSH_MIN_WIDTH = 3;
/**
 * 圆环光标直径下限（CSS 像素）。系统指针已被 cursor-none 隐藏，圆环是唯一指针，
 * 所以只有「细笔 + 大图被缩得很小」这种极端情况才允许它对不齐笔画。
 */
const MARK_CURSOR_MIN_SIZE = 3;

function isPngLike(url: string) {
  return /^data:image\/png/i.test(url) || /\.png(\?|$)/i.test(url);
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
  /** 标注层 2D 上下文：缓存下来，pointermove 里不必反复 getContext */
  const drawContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  /** 圆环已生效的直径与显隐，用来跳过重复的样式写入（写尺寸会标脏布局） */
  const cursorSizeRef = useRef(0);
  const cursorVisibleRef = useRef(false);
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
  const [brushRatio, setBrushRatio] = useState(MARK_BRUSH_DEFAULT);

  const ready = loaded !== null && loaded.url === url;
  const displayUrl = loaded && loaded.url === url ? loaded.source : url;
  const brushWidth = loaded
    ? Math.max(
        MARK_BRUSH_MIN_WIDTH,
        Math.round(Math.min(loaded.width, loaded.height) * brushRatio),
      )
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
      drawContextRef.current = draw?.getContext("2d") ?? null;
      // 弹窗关闭时会重建圆环节点，缓存值必须跟着归零，否则新节点拿不到尺寸/显隐
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      cursorSizeRef.current = 0;
      cursorVisibleRef.current = false;
      strokesRef.current = [];
      drawingRef.current = null;
      setStrokes([]);
      setLoaded({ url, source: url, width, height });
    };
    image.onerror = () => {
      if (cancelled) return;
      toast.error("图片加载失败，无法标注。");
      onOpenChangeRef.current(false);
    };
    // 参考图统一为 base64 data URL，可直接绘制到 canvas，无需代理或跨域转换
    image.src = url;

    return () => {
      cancelled = true;
    };
  }, [open, url]);

  /** 客户端坐标 → 画布像素；rect 由调用方量一次复用，一次移动里不再重复读布局 */
  const toPoint = (
    canvas: HTMLCanvasElement,
    rect: DOMRect,
    clientX: number,
    clientY: number,
  ): Point => {
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  /**
   * 一帧内浏览器会把多次指针移动合并成一个 pointermove，只取最后一个点会让笔画在快速
   * 拖动时明显跟不上手速；把被合并掉的中间点一并画出来，笔画才跟得住指针。
   */
  const eventPoints = (
    event: React.PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    rect: DOMRect,
  ): Point[] => {
    const native = event.nativeEvent;
    const coalesced = native.getCoalescedEvents?.() ?? [];
    const list = coalesced.length > 0 ? coalesced : [native];
    const points = list.map((item) => toPoint(canvas, rect, item.clientX, item.clientY));
    // 兜底：个别浏览器不会把事件本身算进合并列表，补上最后落点
    const current = toPoint(canvas, rect, native.clientX, native.clientY);
    const last = points[points.length - 1];
    if (!last || last.x !== current.x || last.y !== current.y) points.push(current);
    return points;
  };

  /** 圆环显隐也直接改 DOM，省掉一次 setState */
  const setCursorVisible = (visible: boolean) => {
    if (cursorVisibleRef.current === visible) return;
    cursorVisibleRef.current = visible;
    const node = cursorRef.current;
    if (node) node.style.opacity = visible ? "1" : "0";
  };

  /**
   * 用圆环光标代替系统十字光标：直径严格等于画笔宽度按显示比例换算后的尺寸
   * （画布像素 × rect.width / canvas.width），圆环圈住多大，落笔就覆盖多大。
   * 位置、尺寸、显隐全部直接写 DOM：pointermove 里不做 setState，且只有尺寸真的变化时
   * 才写 width / height（写尺寸会标脏布局，逐次写会让指针发滞）。
   */
  const syncCursor = (event: React.PointerEvent<HTMLCanvasElement>, rect: DOMRect) => {
    if (event.pointerType === "touch") {
      setCursorVisible(false);
      return;
    }
    setCursorVisible(true);
    const node = cursorRef.current;
    if (!node) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    const canvas = event.currentTarget;
    const displayScale = canvas.width > 0 && rect.width > 0 ? rect.width / canvas.width : 1;
    const size = Math.max(MARK_CURSOR_MIN_SIZE, brushWidth * displayScale);
    if (size !== cursorSizeRef.current) {
      cursorSizeRef.current = size;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.borderWidth = size >= 8 ? "2px" : "1px";
    }
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLCanvasElement>) => {
    syncCursor(event, event.currentTarget.getBoundingClientRect());
  };

  const handlePointerLeave = () => {
    setCursorVisible(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    syncCursor(event, rect);
    canvas.setPointerCapture(event.pointerId);
    const stroke: Stroke = {
      color,
      width: brushWidth,
      points: [toPoint(canvas, rect, event.clientX, event.clientY)],
    };
    drawingRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    const context = drawContextRef.current;
    if (context) drawStroke(context, stroke, true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    syncCursor(event, rect);

    const stroke = drawingRef.current;
    const context = drawContextRef.current;
    if (!stroke || !context) return;

    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    for (const point of eventPoints(event, canvas, rect)) {
      const previous = stroke.points[stroke.points.length - 1];
      context.moveTo(previous.x, previous.y);
      context.lineTo(point.x, point.y);
      stroke.points.push(point);
    }
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
          <div className="flex min-w-44 flex-1 items-center gap-2">
            <span className="text-xs text-muted-foreground">{MARK_BRUSHES[0].label}</span>
            <Slider
              className="flex-1"
              min={MARK_BRUSH_MIN}
              max={MARK_BRUSH_MAX}
              step={MARK_BRUSH_STEP}
              value={brushRatio}
              onValueChange={setBrushRatio}
              thumbAriaLabel="画笔粗细"
            />
            <span className="text-xs text-muted-foreground">
              {MARK_BRUSHES[MARK_BRUSHES.length - 1].label}
            </span>
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
                <Image
                  src={displayUrl}
                  alt="待标记的参考图"
                  width={0}
                  height={0}
                  unoptimized
                  className="block max-h-[62vh] w-auto max-w-full rounded select-none"
                  draggable={false}
                />
                <canvas
                  ref={drawCanvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerEnter={handlePointerEnter}
                  onPointerLeave={handlePointerLeave}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="absolute inset-0 size-full cursor-none touch-none"
                />
                <canvas ref={baseCanvasRef} className="hidden" />
                <span
                  ref={cursorRef}
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 z-10 rounded-full border-2 border-white opacity-0 shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
                />
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
