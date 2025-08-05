"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Ellipse } from "react-konva";
import { Button } from "@/components/ui/button";
import {
  CircleShape,
  EllipseShape,
  GroupShape,
  ImageShape,
  PolygonShape,
  RectShape,
  Shape,
} from "./toolbar";
import StretchableShape, { TextShape } from "./image-renderer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  PenLine,
  Square,
  Circle as CircleIcon,
  CircleDashed,
  Layout,
  Play,
  PanelRight,
  PanelLeft,
  Save,
  Upload,
  Hand,
  MousePointer,
  Type,
} from "lucide-react";
import StretchablePolygon from "./stretchable-polygon";
import { ArtboardMenuItem } from "./art-board";
import StretchableGroup from "./stretchable-group";
import { useSession } from "next-auth/react";
import {
  saveMasterplan,
  SaveMasterplanPayload,
} from "@/action/save-masterplan";
import { useMutation } from "@tanstack/react-query";
import Konva from "konva";
import { PaperSize, paperSizes } from "../paper-size";

export type DrawMode =
  | "default"
  | "drawPolygon"
  | "drawRect"
  | "drawCircle"
  | "viewOnly"
  | "drawEllipse"
  | "panning"
  | "drawText";
interface ImageMapViewProps {
  shapes: any[];
  setArtboardShapes: React.Dispatch<
    React.SetStateAction<{ [id: string]: Shape[] }>
  >;
  onShapesChange: (shapes: any[]) => void;
  activeArtboardId: string;
  setActiveArtboardId: React.Dispatch<React.SetStateAction<string>>;
  menuItems: ArtboardMenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<ArtboardMenuItem[]>>;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  isPreviewMode: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: DrawMode;
  setMode: React.Dispatch<React.SetStateAction<DrawMode>>;
  selectedEntity: any;
  selectedProject: any;
  selectedMasterplan: any;
  artboardShapes: { [id: string]: Shape[] };
  onSave: () => void;
  session: any;
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  openMenus?: { [key: string]: boolean };
  setOpenMenus?: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setInitialMenuItems: React.Dispatch<React.SetStateAction<ArtboardMenuItem[]>>;
  setInitialArtboardShapes: React.Dispatch<
    React.SetStateAction<{ [id: string]: any[] }>
  >;
  isChanged: boolean;
}

export const LOT_COLOR_MAP = {
  A: "#22c55e", // Available
  B: "#ef4444", // Booked
  DEFAULT: "#9ca3af",
};

const ImageMapView = ({
  shapes,
  onShapesChange,
  activeArtboardId,
  setActiveArtboardId,
  menuItems,
  setMenuItems,
  selectedId,
  setSelectedId,
  setIsPreviewMode,
  isPreviewMode,
  setArtboardShapes,
  rightSidebarOpen,
  setRightSidebarOpen,
  setLeftSidebarOpen,
  mode,
  setMode,
  selectedEntity,
  selectedProject,
  selectedMasterplan,
  artboardShapes,
  onSave,
  session,
  isLocked,
  setIsLocked,
  openMenus,
  setOpenMenus,
  setInitialMenuItems,
  setInitialArtboardShapes,
  isChanged,
}: ImageMapViewProps) => {
  const stageRef = useRef<any>(null);
  const [isDrawingPoly, setIsDrawingPoly] = useState(false);
  const [currentPolyPoints, setCurrentPolyPoints] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const TOLERANCE = 10;
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paperZoom, setPaperZoom] = useState(1); // 1 = 100%, 0.75 = 75%, dst
  const [selectedPaper, setSelectedPaper] = useState<PaperSize>(
    paperSizes.find((p) => p.name === "A4")!
  );
  const [stageSize, setStageSize] = useState({
    width: selectedPaper.width,
    height: selectedPaper.height,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [copiedShape, setCopiedShape] = useState<Shape | null>(null);
  const [drawingShape, setDrawingShape] = useState<null | {
    type: DrawMode;
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
  }>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [drawingMode, setDrawingMode] = useState<
    null | "rect" | "ellipse" | "circle" | "polygon"
  >(null);
  const [isolatedGroup, setIsolatedGroup] = useState<{
    originalGroup: GroupShape;
    fromGroupId: string;
  } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const togglePanning = () => setIsPanning((prev) => !prev);
  const isDrawMode =
    mode === "drawPolygon" ||
    mode === "drawRect" ||
    mode === "drawCircle" ||
    mode === "drawEllipse" ||
    mode === "drawText";

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>("");
  const [editingTextPos, setEditingTextPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const scaledFontSize = 1 / stageScale;

  const handleStartEditText = (shape: TextShape) => {
    setEditingTextId(shape.id);
    setEditingTextValue(shape.text);
    setEditingTextPos({ x: shape.x, y: shape.y });
  };

  const pushHistory = (next: any[]) => {
    undoStack.current.push(shapes); // simpan snapshot sebelum berubah
    redoStack.current = []; // bersihkan redo setelah aksi baru
    onShapesChange(next);
  };

  const ensureArtboardExists = (): string => {
    if (menuItems.length === 0) {
      const defaultId = "1";
      const defaultTitle = "Artboard 1";

      setMenuItems([
        {
          id: defaultId,
          title: defaultTitle,
          icon: Layout,
          children: [],
        },
      ]);
      setArtboardShapes({ [defaultId]: [] });
      setActiveArtboardId(defaultId);
      return defaultId;
    }
    return activeArtboardId;
  };

  const startDrawRect = () => {
    ensureArtboardExists();
    setMode(mode === "drawRect" ? "default" : "drawRect");
  };

  const startDrawCircle = () => {
    ensureArtboardExists();
    setMode("drawCircle");
    setMode(mode === "drawCircle" ? "default" : "drawCircle");
  };

  const startDrawEllipse = () => {
    ensureArtboardExists();
    setMode("drawEllipse");
    setMode(mode === "drawEllipse" ? "default" : "drawEllipse");
  };

  const startDrawText = () => {
    ensureArtboardExists();
    setMode(mode === "drawText" ? "default" : "drawText");
  };

  const startPolygon = () => {
    ensureArtboardExists();
    if (isDrawingPoly) {
      setIsDrawingPoly(false);
      setMode("default");
      setCurrentPolyPoints([]);
    } else {
      setIsDrawingPoly(true);
      setMode("drawPolygon");
      setCurrentPolyPoints([]);
    }
  };

  const handleDrawStart = (e: any) => {
    if (
      mode === "drawRect" ||
      mode === "drawCircle" ||
      mode === "drawEllipse"
    ) {
      const pos = stageRef.current.getRelativePointerPosition();
      if (!pos) return;

      setDrawingShape({
        type: mode,
        startX: pos.x,
        startY: pos.y,
      });
    }
  };

  const handleDrawMove = (e: any) => {
    if (!drawingShape) return;
    const pos = stageRef.current.getRelativePointerPosition();
    if (!pos) return;

    setDrawingShape((prev) =>
      prev
        ? {
            ...prev,
            endX: pos.x,
            endY: pos.y,
          }
        : null
    );
  };

  const handleDrawEnd = (e: any) => {
    if (!drawingShape) return;

    const pos = stageRef.current.getRelativePointerPosition();
    if (!pos) return;

    const endX = pos.x;
    const endY = pos.y;

    const x = Math.min(drawingShape.startX, endX);
    const y = Math.min(drawingShape.startY, endY);
    const width = Math.abs(drawingShape.startX - endX);
    const height = Math.abs(drawingShape.startY - endY);

    let newShape: Shape | null = null;

    if (drawingShape.type === "drawRect") {
      newShape = {
        id: `rect-${Date.now()}`,
        type: "rect",
        x,
        y,
        width,
        height,
        fill: LOT_COLOR_MAP.DEFAULT,
      };
    } else if (drawingShape.type === "drawCircle") {
      const radius = Math.max(width, height) / 2;
      newShape = {
        id: `circle-${Date.now()}`,
        type: "circle",
        x: x + radius,
        y: y + radius,
        radius,
        fill: LOT_COLOR_MAP.DEFAULT,
      };
    } else if (drawingShape.type === "drawText") {
      const newShape: TextShape = {
        id: `text-${Date.now()}`,
        type: "text",
        x,
        y,
        text: "text", // atau kosong jika ingin prompt
        fill: "#000",
        fontSize: 14,
        width: 200,
      };
      console.log(newShape, "tulisan");
      pushHistory([...shapes, newShape]);
      setSelectedId(newShape.id);
    } else if (drawingShape.type === "drawEllipse") {
      newShape = {
        id: `ellipse-${Date.now()}`,
        type: "ellipse",
        x: x + width / 2,
        y: y + height / 2,
        radiusX: width / 2,
        radiusY: height / 2,
        fill: LOT_COLOR_MAP.DEFAULT,
      };
    }

    if (newShape) {
      pushHistory([...shapes, newShape]);
      setSelectedId(newShape.id);
    }

    setDrawingShape(null);
    if (setOpenMenus) {
      setOpenMenus((prev) => ({
        ...prev,
        [activeArtboardId]: true, // hanya pastikan artboard ini terbuka
      }));
    }

    setMode("default");
  };

  const isCloseToFirstPoint = (x: number, y: number) => {
    if (currentPolyPoints.length < 2) return false;
    const firstX = currentPolyPoints[0];
    const firstY = currentPolyPoints[1];
    const dx = x - firstX;
    const dy = y - firstY;

    if (Math.sqrt(dx * dx + dy * dy) < TOLERANCE) {
      if (setOpenMenus) {
        setOpenMenus((prev) => ({
          ...prev,
          [activeArtboardId]: true, // hanya pastikan artboard ini terbuka
        }));
      }
    }

    return Math.sqrt(dx * dx + dy * dy) < TOLERANCE;
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    ensureArtboardExists();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const stage = stageRef.current;
        const maxWidth = stage?.width() || 800;
        const maxHeight = stage?.height() || 550;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const newImgShape: ImageShape = {
          id: `img-${Date.now()}`,
          type: "image",
          x: (maxWidth - width) / 2,
          y: (maxHeight - height) / 2,
          fill: "",
          src: base64, // ⬅️ sekarang pakai base64
          width,
          height,
        };

        pushHistory([newImgShape, ...shapes]);
      };
      img.src = base64;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleStageClick = (e: any) => {
    // if (mode === "panning") {
    //   e.cancelBubble = true;
    //   return;
    // }
    const clickedOnEmpty = e.target === e.target.getStage();

    // ✅ 1. Handle polygon dulu
    if (isDrawingPoly) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = (pointer.x - stage.x()) / stage.scaleX();
      const y = (pointer.y - stage.y()) / stage.scaleY();

      if (currentPolyPoints.length >= 6 && isCloseToFirstPoint(x, y)) {
        const baseX = currentPolyPoints[0];
        const baseY = currentPolyPoints[1];

        const relativePoints = [];

        for (let i = 0; i < currentPolyPoints.length; i += 2) {
          relativePoints.push(currentPolyPoints[i] - baseX);
          relativePoints.push(currentPolyPoints[i + 1] - baseY);
        }

        const newPoly: PolygonShape = {
          id: `polygon-${Date.now()}`,
          type: "polygon",
          fill: LOT_COLOR_MAP.DEFAULT,
          x: baseX,
          y: baseY,
          points: relativePoints,
        };

        const targetId = activeArtboardId;
        setArtboardShapes((prev) => {
          const current = prev[targetId] || [];
          return {
            ...prev,
            [targetId]: [...current, newPoly],
          };
        });

        setIsDrawingPoly(false);
        setMode("default");
        setCurrentPolyPoints([]);
        setSelectedId(newPoly.id);
        pushHistory([...shapes, newPoly]);
        return;
      }

      setCurrentPolyPoints((pts) => [...pts, x, y]);
      return;
    }

    if (mode === "drawText") {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = (pointer.x - stage.x()) / stage.scaleX();
      const y = (pointer.y - stage.y()) / stage.scaleY();

      const newShape: TextShape = {
        id: `text-${Date.now()}`,
        type: "text",
        x,
        y,
        text: "text",
        fill: "black",
        fontSize: 14,
        fontFamily: "Arial",
      };

      pushHistory([...shapes, newShape]);
      setSelectedId(newShape.id);

      if (setOpenMenus) {
        setOpenMenus((prev) => ({
          ...prev,
          [activeArtboardId]: true,
        }));
      }

      setMode("default");
      return;
    }

    // ✅ 2. Kalau dalam state isolate, klik di luar harus langsung regroup

    // ✅ 3. Clear selection hanya jika klik di luar shape
    if (clickedOnEmpty) {
      setSelectedId(null);
      setSelectedIds([]);
    }
  };

  const updateShape = (id: string, attrs: Partial<Shape>) => {
    const nextShapes = shapes.map((s) =>
      s.id === id ? { ...s, ...attrs } : s
    );
    pushHistory(nextShapes);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    const next = shapes.filter((s) => s.id !== selectedId);
    pushHistory(next);
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === activeArtboardId
          ? {
              ...item,
              children: item.children.filter(
                (child) => !child.url.includes(selectedId)
              ),
            }
          : item
      )
    );
    setSelectedId(null);
  };

  const undo = () => {
    if (!undoStack.current.length) return;
    const prev = undoStack.current.pop()!;
    redoStack.current.push(shapes);
    onShapesChange(prev); // ini akan update shapes + menu via onShapesChange handler
    setSelectedId(null);
  };

  const redo = () => {
    if (!redoStack.current.length) return;
    const prev = redoStack.current.pop()!;
    undoStack.current.push(shapes);
    onShapesChange(prev);
    setSelectedId(null);
  };

  useEffect(() => {
    setStageSize({
      width: selectedPaper.width,
      height: selectedPaper.height,
    });
  }, [selectedPaper]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (isInput) return;
      if (e.key === "Delete") {
        deleteSelected();
      }
      //  else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      //   undo();
      // } else if (
      //   (e.ctrlKey || e.metaKey) &&
      //   (e.key === "y" || (e.key === "z" && e.shiftKey))
      // ) {
      //   redo();
      // }
      else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        // Copy
        if (selectedId) {
          const shape = shapes.find((s) => s.id === selectedId);
          if (shape) {
            setCopiedShape({ ...shape });
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        // Paste
        if (copiedShape) {
          const newId = `${copiedShape.type}-${Date.now()}`;
          const offset = 20;

          let newShape;

          if (copiedShape.type === "polygon") {
            const original = copiedShape as PolygonShape;
            const offsetPoints = original.points.map((val, idx) =>
              idx % 2 === 0 ? val + offset : val + offset
            );
            newShape = {
              ...original,
              id: newId,
              points: offsetPoints,
            };
          } else {
            newShape = {
              ...copiedShape,
              id: newId,
              x: copiedShape.x + offset,
              y: copiedShape.y + offset,
            };
          }

          const next = [...shapes, newShape];
          pushHistory(next);
          setSelectedId(newId);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shapes, selectedId, copiedShape]);

  const clearAll = () => {
    pushHistory([]);
    setIsDrawingPoly(false);
    setCurrentPolyPoints([]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  // Handler drop gambar
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxWidth = stageSize.width;
      const maxHeight = stageSize.height;
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }
      const newImgShape: ImageShape = {
        id: `img-${Date.now()}`,
        type: "image",
        x: (maxWidth - width) / 2,
        y: (maxHeight - height) / 2,
        fill: "",
        src: url,
        width,
        height,
      };
      onShapesChange([...shapes, newImgShape]);
    };
    img.src = url;
  };

  // // Handler zoom (mouse wheel)
  // const handleWheel = (e: any) => {
  //   e.evt.preventDefault();
  //   const scaleBy = 1.08;
  //   const oldScale = stageScale;
  //   const pointer = stageRef.current.getPointerPosition();
  //   if (!pointer) return;

  //   // Hitung posisi pointer relatif terhadap stage
  //   const mousePointTo = {
  //     x: (pointer.x - stagePos.x) / oldScale,
  //     y: (pointer.y - stagePos.y) / oldScale,
  //   };

  //   // Zoom in/out
  //   const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  //   setStageScale(newScale);

  //   // Update posisi agar zoom ke arah pointer
  //   setStagePos({
  //     x: pointer.x - mousePointTo.x * newScale,
  //     y: pointer.y - mousePointTo.y * newScale,
  //   });
  // };

  const groupSelectedShapes = () => {
    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
    if (selectedShapes.length < 2) {
      return;
    }

    // 1. Cari bounding box untuk semua selectedShapes
    const minX = Math.min(...selectedShapes.map((s) => s.x));
    const minY = Math.min(...selectedShapes.map((s) => s.y));

    // 2. Offset posisi children agar relatif terhadap bounding box
    const children = selectedShapes.map((s) => {
      const base = {
        ...s,
        x: s.x - minX,
        y: s.y - minY,
      };

      if (s.type === "polygon") {
        return {
          ...base,
          points: [...s.points], // deep copy array
        };
      }

      return base;
    });

    // 3. Buat grup dengan posisi sesuai bounding box
    const newGroup: GroupShape = {
      id: `group-${Date.now()}`,
      type: "group",
      x: minX,
      y: minY,
      children,
    };

    // 4. Gabungkan shapes: hapus yang digroup, tambahkan group baru
    const remainingShapes = shapes.filter((s) => !selectedIds.includes(s.id));
    pushHistory([...remainingShapes, newGroup]);

    setSelectedIds([]);
    setSelectedId(newGroup.id);
  };

  const ungroupSelectedGroup = () => {
    const group = shapes.find(
      (s) => s.id === selectedId && s.type === "group"
    ) as GroupShape;
    if (!group) return;

    const remaining = shapes.filter((s) => s.id !== group.id);
    const next = [...remaining, ...group.children];
    pushHistory(next);
    setSelectedId(null);
    setSelectedIds([]);
  };

  const fitStageToShapes = () => {
    if (!stageRef.current || shapes.length === 0) return;

    const stage = stageRef.current;
    const group = new Konva.Group();
    shapes.forEach((shape) => {
      const dummy = new Konva.Rect({
        x: shape.x || 0,
        y: shape.y || 0,
        width: "width" in shape ? shape.width || 10 : 10,
        height: "height" in shape ? shape.height || 10 : 10,
      });
      group.add(dummy);
    });

    const box = group.getClientRect();
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const scaleX = stageWidth / box.width;
    const scaleY = stageHeight / box.height;
    const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% supaya ada margin

    const centerX = stageWidth / 2 - (box.x + box.width / 2) * fitScale;
    const centerY = stageHeight / 2 - (box.y + box.height / 2) * fitScale;

    setStageScale(fitScale);
    setStagePos({ x: centerX, y: centerY });
  };

  // ...existing code...
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  // ...existing code...

  const handleStageMouseDown = (e: any) => {
    if (mode === "panning") {
      setIsDraggingCanvas(true);
      const pointer = stageRef.current.getPointerPosition();
      if (pointer) setDragStart(pointer);
    } else {
      handleDrawStart(e);
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (isDraggingCanvas && dragStart) {
      const pointer = stageRef.current.getPointerPosition();
      if (pointer) {
        setStagePos((prev) => ({
          x: prev.x + (pointer.x - dragStart.x),
          y: prev.y + (pointer.y - dragStart.y),
        }));
        setDragStart(pointer);
      }
    } else {
      handleDrawMove(e);
    }
  };

  const handleStageMouseUp = (e: any) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      setDragStart(null);
    } else {
      handleDrawEnd(e);
    }
  };

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fitStageToShapes();
    }, 100);
    return () => clearTimeout(timeout);
  }, [activeArtboardId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") setMode("panning");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setMode("default");
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setMode]);

  // useEffect(() => {
  //   if (selectedMasterplan?.shapes && selectedMasterplan?.lots) {
  //     const lots = selectedMasterplan.lots;

  //     const shapesWithFill = selectedMasterplan.shapes.map((shape: any) => {
  //       let fill = "#9ca3af"; // default abu-abu

  //       if (shape.lotId) {
  //         const lot = lots.find((l: any) => l.lot_no === shape.lotId);
  //         if (lot?.status === "A") {
  //           fill = "#78de80";
  //         } else if (lot?.status === "B") {
  //           fill = "#ef4444";
  //         }
  //       }

  //       return {
  //         ...shape,
  //         fill,
  //       };
  //     });

  //     onShapesChange(shapesWithFill);
  //   }
  // }, [selectedMasterplan]);

  useEffect(() => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  }, [activeArtboardId]);

  return (
    <div>
      <div className="flex h-auto py-2 bg-sidebar mb-4 pl-2 border border-b-inherit border-l-0 border-r-0 overflow-x-auto">
        <div className="ml-4 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  setMode(mode === "panning" ? "default" : "panning")
                }
                variant={mode === "panning" ? "default" : "ghost"}
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
                style={
                  mode === "panning" ? { background: "#facc15" } : undefined
                }
              >
                {mode === "panning" ? (
                  <MousePointer className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                ) : (
                  <Hand className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {mode === "panning"
                  ? "Cancel Drag Canvas"
                  : "Drag Canvas (Hold Space)"}
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="h-full w-2 bg-slate-500"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setIsPanning(false);
                  startDrawRect();
                }}
                style={{
                  background: mode === "drawRect" ? "#facc15" : undefined,
                }}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                {mode === "drawRect" ? (
                  "Finish / Cancel"
                ) : (
                  <Square className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            {mode !== "drawRect" && (
              <TooltipContent>
                <p>Draw Rectangle</p>
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setIsPanning(false);
                  startDrawEllipse();
                }}
                style={{
                  background: mode === "drawEllipse" ? "#facc15" : undefined,
                }}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                {mode === "drawEllipse" ? (
                  "Finish / Cancel"
                ) : (
                  <CircleDashed className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            {mode !== "drawEllipse" && (
              <TooltipContent>
                <p>Draw Ellipse</p>
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setIsPanning(false);
                  startDrawCircle();
                }}
                style={{
                  background: mode === "drawCircle" ? "#facc15" : undefined,
                }}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                {mode === "drawCircle" ? (
                  "Finish / Cancel"
                ) : (
                  <CircleIcon className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            {mode !== "drawCircle" && (
              <TooltipContent>
                <p>Draw Circle</p>
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setIsPanning(false);
                  startDrawText();
                }}
                style={{
                  background: mode === "drawText" ? "#facc15" : undefined,
                }}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                {mode === "drawText" ? (
                  "Finish / Cancel"
                ) : (
                  <Type className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            {mode !== "drawText" && (
              <TooltipContent>
                <p>Draw Text</p>
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setIsPanning(false);
                  startPolygon();
                }}
                style={{ background: isDrawingPoly ? "#facc15" : undefined }}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                {isDrawingPoly ? (
                  "Finish / Cancel"
                ) : (
                  <PenLine className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Polygon</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={clearAll}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>

          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={groupSelectedShapes}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                Group
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Group Selected</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={ungroupSelectedGroup}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                Ungroup
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ungroup</p>
            </TooltipContent>
          </Tooltip> */}

          <div className="grid w-full max-w-sm items-center gap-3 ">
            <Tooltip>
              <TooltipTrigger>
                <input
                  id="picture"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
                >
                  <Upload className="w-4 h-4 group-hover:text-black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Image</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => setLeftSidebarOpen((prev) => !prev)}
                className="py-1 hover:bg-gray-300 rounded text-sm"
                variant="ghost"
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Collapse Left Sidebar</p>
            </TooltipContent>
          </Tooltip>

          {/* Toggle sidebar kanan */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="py-1 hover:bg-gray-300 rounded text-sm"
                variant="ghost"
              >
                <PanelRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Collapse Right Sidebar</p>
            </TooltipContent>
          </Tooltip>

          <div className="grid items-center gap-3 mx-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="md"
                  type="button"
                  onClick={() => setIsPreviewMode((prev) => !prev)}
                  className="bg-[#f59f0a] flex gap-2 hover:bg-[#ffb83c] hover:ring-transparent text-sm"
                >
                  {isPreviewMode ? (
                    "Exit Preview"
                  ) : (
                    <Play fill="#fff" className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid items-center gap-3 mx-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="md"
                  type="button"
                  onClick={() => {
                    onSave();
                    setInitialMenuItems(menuItems);
                    setInitialArtboardShapes(artboardShapes);
                  }}
                  disabled={!isChanged}
                  className="bg-green-600 flex gap-2 hover:bg-green-700 hover:ring-transparent text-sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="w-full px-4 pb-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 pointer-events-none rounded">
            <div className="bg-white/90 px-6 py-4 rounded shadow text-center text-lg font-semibold text-gray-700 border border-dashed border-gray-400">
              Drop image here to add to canvas
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
          <label htmlFor="paperSize">Paper Size:</label>
          <select
            id="paperSize"
            value={selectedPaper.name}
            onChange={(e) => {
              const paper = paperSizes.find((p) => p.name === e.target.value);
              if (paper) setSelectedPaper(paper);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {paperSizes.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.width.toFixed(0)} × {p.height.toFixed(0)})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 px-4 py-2">
            <label>Zoom:</label>
            <Button
              size="md"
              variant="ghost"
              className="text-xl"
              onClick={() => setPaperZoom((z) => Math.max(0.25, z - 0.1))}
            >
              -
            </Button>
            <span>{Math.round(paperZoom * 100)}%</span>
            <Button
              size="md"
              variant="ghost"
              className="text-xl"
              onClick={() => setPaperZoom((z) => Math.min(2, z + 0.1))}
            >
              +
            </Button>
          </div>
        </div>

        <div className="w-full overflow-auto flex justify-center items-center bg-gray-200 py-4 min-h-[90vh]">
          <div
            style={{
              width: `${stageSize.width}px`,
              height: `${stageSize.height}px`,
              transform: `scale(${paperZoom})`,
              transformOrigin: "top center",
            }}
            className="bg-white border shadow-md"
          >
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              pixelRatio={window.devicePixelRatio || 1}
              ref={stageRef}
              onClick={handleStageClick}
              // draggable={mode === "default" && !isDraggingGroup}
              // onWheel={handleWheel}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
              onDragMove={(e) => {
                if (e.target === stageRef.current) {
                  setStagePos(e.target.position());
                }
              }}
              onDragEnd={(e) => {
                if (e.target === stageRef.current) {
                  setStagePos(e.target.position());
                }
              }}
              scaleX={stageScale} // 👈 tetap di Stage
              scaleY={stageScale}
              x={stagePos.x}
              y={stagePos.y}
              style={{
                background: "#fff",
                cursor:
                  mode === "panning"
                    ? "grab"
                    : mode === "drawPolygon"
                    ? "crosshair"
                    : ["drawRect", "drawCircle", "drawEllipse"].includes(mode)
                    ? "crosshair"
                    : drawingShape
                    ? "copy"
                    : "default",
              }}
            >
              <Layer>
                {/* Semua shapes & live drawing (seperti sebelumnya) */}
                {shapes.map((shape) => {
                  if (shape.type === "group") {
                    return (
                      <StretchableGroup
                        key={shape.id}
                        shape={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={() => setSelectedId(shape.id)}
                        onChange={(attrs) => updateShape(shape.id, attrs)}
                        stageScale={stageScale}
                        setSelectedIds={setSelectedIds}
                        selectedIds={selectedIds}
                        setIsDraggingGroup={setIsDraggingGroup}
                        setIsolatedGroup={setIsolatedGroup}
                        shapes={shapes}
                        onShapesChange={onShapesChange}
                        setSelectedId={setSelectedId}
                      />
                    );
                  }
                  if (shape.type === "polygon") {
                    const s = shape as PolygonShape;
                    return (
                      <StretchablePolygon
                        key={shape.id}
                        shape={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={(e) => {
                          if (mode === "panning") {
                            e.cancelBubble = true;
                            return;
                          }
                          if (isPreviewMode && shape.linkToArtboard) {
                            setActiveArtboardId(shape.linkToArtboard);
                          } else {
                            setSelectedId(shape.id);
                          }
                        }}
                        onChange={(attrs) => updateShape(shape.id, attrs)}
                        stageScale={stageScale}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        isInGroup={false}
                        isLocked={isLocked}
                        listening={!isDrawMode}
                        draggable={mode !== "panning" && !shape.locked}
                      />
                    );
                  }
                  return (
                    <StretchableShape
                      key={shape.id}
                      shape={shape}
                      isSelected={shape.id === selectedId}
                      onSelect={(e) => {
                        if (mode === "panning") {
                          e.cancelBubble = true; // Konva: stop bubbling
                          return;
                        }
                        if (isPreviewMode && shape.linkToArtboard) {
                          setActiveArtboardId(shape.linkToArtboard);
                        } else {
                          setSelectedId(shape.id);
                        }
                      }}
                      onDoubleClick={(e) => {
                        setSelectedId(shape.id); // ⬅️ Trigger Transformer

                        if (shape.type === "text") {
                          // Aktifkan mode edit teks (misalnya tampilkan textarea)
                          handleStartEditText?.(shape);
                        }
                      }}
                      onChange={(attrs) => updateShape(shape.id, attrs)}
                      mode={mode}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      isInGroup={false}
                      isLocked={isLocked}
                      listening={!isDrawMode}
                      draggable={mode !== "panning" && !shape.locked}
                      onStartEditText={handleStartEditText}
                      scaledFontSize={scaledFontSize}
                      stageScale={stageScale}
                    />
                  );
                })}
                {isDrawingPoly && currentPolyPoints.length >= 2 && (
                  <>
                    {/* Preview garis */}
                    <Line
                      points={currentPolyPoints}
                      stroke="#6b7280"
                      strokeWidth={2}
                      closed={false}
                    />
                    {/* Preview shape (tertutup dengan fill transparan) */}
                    {currentPolyPoints.length >= 6 && (
                      <Line
                        points={currentPolyPoints}
                        fill={LOT_COLOR_MAP.DEFAULT}
                        stroke="#22c55e"
                        strokeWidth={1}
                        closed={true}
                        opacity={0.5}
                      />
                    )}
                  </>
                )}
                {isDrawingPoly &&
                  currentPolyPoints.map((val, idx) => {
                    if (idx % 2 === 1) return null; // Ambil hanya koordinat X dan Y

                    const x = currentPolyPoints[idx];
                    const y = currentPolyPoints[idx + 1];

                    // Menyesuaikan radius dengan skala stage
                    const radius = 4 / stageScale; // Radius yang disesuaikan dengan skala stage

                    return (
                      <Circle
                        key={`dot-${idx}`}
                        x={x}
                        y={y}
                        radius={radius} // Radius yang disesuaikan
                        fill="#ef4444"
                      />
                    );
                  })}

                {drawingShape?.endX !== undefined &&
                  drawingShape?.endY !== undefined &&
                  (() => {
                    const { startX, startY, endX, endY, type } = drawingShape;
                    const x = Math.min(startX, endX);
                    const y = Math.min(startY, endY);
                    const width = Math.abs(endX - startX);
                    const height = Math.abs(endY - startY);
                    const fillColor = "#64748b33"; // slate-500 with opacity

                    if (type === "drawRect") {
                      return (
                        <Rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          stroke="#64748b"
                          strokeWidth={1.5}
                          fill={fillColor}
                        />
                      );
                    } else if (type === "drawEllipse") {
                      return (
                        <Ellipse
                          x={x + width / 2}
                          y={y + height / 2}
                          radiusX={width / 2}
                          radiusY={height / 2}
                          stroke="#64748b"
                          strokeWidth={1.5}
                          fill={fillColor}
                        />
                      );
                    } else if (type === "drawCircle") {
                      const radius = Math.max(width, height) / 2;
                      return (
                        <Circle
                          x={x + radius}
                          y={y + radius}
                          radius={radius}
                          stroke="#64748b"
                          strokeWidth={1.5}
                          fill={fillColor}
                        />
                      );
                    } else if (type === "drawText") {
                      return (
                        <Text
                          x={x}
                          y={y}
                          text="Sample"
                          fontSize={14}
                          stroke="#64748b"
                          strokeWidth={1.5}
                          fill={fillColor}
                          width={150}
                          wrap="word"
                        />
                      );
                    }
                    return null;
                  })()}
              </Layer>
            </Stage>
            {editingTextId && (
              <input
                type="text"
                value={editingTextValue}
                onChange={(e) => setEditingTextValue(e.target.value)}
                onBlur={() => {
                  updateShape(editingTextId, {
                    text: editingTextValue,
                  });
                  setEditingTextId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateShape(editingTextId, {
                      text: editingTextValue,
                    });
                    setEditingTextId(null);
                  } else if (e.key === "Escape") {
                    setEditingTextId(null);
                  }
                }}
                style={{
                  position: "absolute",
                  top: `${editingTextPos.y * stageScale + stagePos.y}px`,
                  left: `${editingTextPos.x * stageScale + stagePos.x}px`,
                  transform: `scale(${paperZoom})`,
                  transformOrigin: "top left",
                  padding: "4px",
                  fontSize: "14px",
                  border: "1px solid gray",
                  background: "#fff",
                  zIndex: 999,
                }}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMapView;
