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
import StretchableShape from "./image-renderer";
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

export type DrawMode =
  | "default"
  | "drawPolygon"
  | "drawRect"
  | "drawCircle"
  | "viewOnly"
  | "drawEllipse";
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
}: ImageMapViewProps) => {
  const stageRef = useRef<any>(null);
  const [isDrawingPoly, setIsDrawingPoly] = useState(false);
  const [currentPolyPoints, setCurrentPolyPoints] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const TOLERANCE = 10;
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 550 });
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
  const [isolatedGroup, setIsolatedGroup] = useState<{
    originalGroup: GroupShape;
    fromGroupId: string;
  } | null>(null);

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
    setMode("drawRect");
  };

  const startDrawCircle = () => {
    ensureArtboardExists();
    setMode("drawCircle");
  };

  const startDrawEllipse = () => {
    ensureArtboardExists();
    setMode("drawEllipse");
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
      onShapesChange([...shapes, newShape]);
      setSelectedId(newShape.id);
    }

    setDrawingShape(null);
    setMode("default");
  };

  const isCloseToFirstPoint = (x: number, y: number) => {
    if (currentPolyPoints.length < 2) return false;
    const firstX = currentPolyPoints[0];
    const firstY = currentPolyPoints[1];
    const dx = x - firstX;
    const dy = y - firstY;
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

        onShapesChange([newImgShape, ...shapes]);
      };
      img.src = base64;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleStageClick = (e: any) => {
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
        return;
      }

      setCurrentPolyPoints((pts) => [...pts, x, y]);
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
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (isInput) return;

      if (e.key === "Delete") {
        deleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
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
    onShapesChange([]);
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

  // Handler zoom (mouse wheel)
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const oldScale = stageScale;
    const pointer = stageRef.current.getPointerPosition();
    if (!pointer) return;

    // Hitung posisi pointer relatif terhadap stage
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    // Zoom in/out
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStageScale(newScale);

    // Update posisi agar zoom ke arah pointer
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const groupSelectedShapes = () => {
    console.log("SelectedIds for grouping:", selectedIds);

    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
    if (selectedShapes.length < 2) {
      alert("Pilih minimal 2 shape untuk digroup.");
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
    console.log("Added group:", newGroup);
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

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight; // 16:9 aspect ratio
        setStageSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
      <div className="flex h-auto py-2 bg-sidebar mb-4 pl-2 border border-b-inherit border-l-0 border-r-0">
        <div className="ml-4 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={startDrawRect}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                <Square className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Rectangle</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={startDrawEllipse}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                <CircleDashed className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Ellipse</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={startDrawCircle}
                variant="ghost"
                className="group hover:cursor-pointer hover:bg-[#e8e8e8] hover:text-black"
              >
                <CircleIcon className="w-4 h-4 text-[#8c8c8c] group-hover:text-black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Circle</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={startPolygon}
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

          <div className="grid w-full max-w-sm items-center gap-3">
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
            <Button
              size="md"
              type="button"
              onClick={() => setIsPreviewMode((prev) => !prev)}
              className="bg-[#f59f0a] flex gap-2 hover:bg-[#ffb83c] hover:ring-transparent text-sm"
            >
              <Play fill="#fff" className="w-4 h-4" />{" "}
              {isPreviewMode ? "Exit Preview" : "Preview"}
            </Button>
          </div>
          <div className="grid items-center gap-3 mx-2">
            <Button
              size="md"
              type="button"
              onClick={onSave}
              className="bg-green-600 flex gap-2 hover:bg-green-700 hover:ring-transparent text-sm"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
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
        <div className="flex justify-center border border-gray-300 rounded overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            pixelRatio={window.devicePixelRatio || 1}
            ref={stageRef}
            onClick={handleStageClick}
            draggable={mode === "default" && !isDraggingGroup}
            onWheel={handleWheel}
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawMove}
            onMouseUp={handleDrawEnd}
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
                mode === "drawPolygon"
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
                      onSelect={() => {
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
                    />
                  );
                }
                return (
                  <StretchableShape
                    key={shape.id}
                    shape={shape}
                    isSelected={shape.id === selectedId}
                    onSelect={() => {
                      if (isPreviewMode && shape.linkToArtboard) {
                        setActiveArtboardId(shape.linkToArtboard);
                      } else {
                        setSelectedId(shape.id);
                      }
                    }}
                    onDoubleClick={() => {
                      setSelectedId(shape.id); // ⬅️ Trigger Transformer
                    }}
                    onChange={(attrs) => updateShape(shape.id, attrs)}
                    mode={mode}
                    setSelectedIds={setSelectedIds}
                    selectedIds={selectedIds}
                    isInGroup={false}
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
                    />
                  )}
                </>
              )}
              {isDrawingPoly &&
                currentPolyPoints.map((val, idx) => {
                  if (idx % 2 === 1) return null;
                  const x = currentPolyPoints[idx];
                  const y = currentPolyPoints[idx + 1];
                  return (
                    <Circle
                      key={`dot-${idx}`}
                      x={x}
                      y={y}
                      radius={4}
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
                  }
                  return null;
                })()}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default ImageMapView;
