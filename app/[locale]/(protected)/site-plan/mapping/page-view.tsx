"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import Toolbar from "./components/toolbar";
import type {
  Shape,
  PolygonShape,
  RectShape,
  CircleShape,
  ImageShape,
} from "./components/toolbar";
import StretchableRC from "./components/image-renderer";
import StretchableShape from "./components/image-renderer";
import { Button } from "@/components/ui/button";

const ImageMapView = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const stageRef = useRef<any>(null);
  const [isDrawingPoly, setIsDrawingPoly] = useState(false);
  const [currentPolyPoints, setCurrentPolyPoints] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const TOLERANCE = 10;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const undoStack = useRef<Shape[][]>([]);
  const redoStack = useRef<Shape[][]>([]);

  const pushHistory = (next: Shape[]) => {
    undoStack.current.push(shapes); // simpan snapshot sebelum berubah
    redoStack.current = []; // bersihkan redo setelah aksi baru
    setShapes(next);
  };

  // -------- Handlers --------
  const addRect = () => {
    const newRect: RectShape = {
      id: `rect-${Date.now()}`,
      type: "rect",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: "#ef4444",
    };
    pushHistory([...shapes, newRect]);
  };

  const addCircle = () =>
    setShapes((prev) => [
      ...prev,
      {
        id: `circle-${Date.now()}`,
        type: "circle",
        x: 150,
        y: 150,
        radius: 50,
        fill: "#3b82f6",
      } as CircleShape,
    ]);

  const startPolygon = () => {
    if (isDrawingPoly) {
      setIsDrawingPoly(false);
      setCurrentPolyPoints([]);
    } else {
      setIsDrawingPoly(true);
      setCurrentPolyPoints([]);
    }
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
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const stage = stageRef.current;
      const maxWidth = stage?.width() || 800;
      const maxHeight = stage?.height() || 550;
      let width = img.width;
      let height = img.height;

      // scale down if too large
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }
      const newImgShape: ImageShape = {
        id: `img-${Date.now()}`,
        type: "image",
        // letakkan di pojok kiri-atas; ubah ke (0,0) atau center sesuai selera
        x: 0,
        y: 0,
        fill: "",
        src: url,
        width, // ⬅️ gunakan ukuran hasil scaling
        height, // ⬅️
      };

      setShapes((prev: Shape[]): Shape[] => [...prev, newImgShape]);
    };
    img.src = url;
    // reset input so same file can be selected again if needed
    e.target.value = "";
  };

  const handleStageClick = () => {
    if (!isDrawingPoly) return;
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;

    // If near the first point and enough points, close the polygon
    if (currentPolyPoints.length >= 6 && isCloseToFirstPoint(x, y)) {
      const newPoly: PolygonShape = {
        id: `polygon-${Date.now()}`,
        type: "polygon",
        fill: "#22c55e",
        x: currentPolyPoints[0],
        y: currentPolyPoints[1],
        points: currentPolyPoints,
      };
      console.log(newPoly, "newPoly");
      setShapes((prev) => [...prev, newPoly]);
      setIsDrawingPoly(false);
      setCurrentPolyPoints([]);
      return;
    }

    const triggerUpload = () => {
      fileInputRef.current?.click();
    };

    // Add new point
    setCurrentPolyPoints((pts) => [...pts, x, y]);
  };

  // 1.  Perluas tipe attrs:
  const updateShape = (
    id: string,
    attrs: Partial<RectShape | CircleShape | ImageShape>
  ) => {
    setShapes(
      (prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...attrs } : s)) as Shape[]
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    const next = shapes.filter((s) => s.id !== selectedId);
    pushHistory(next);
    setSelectedId(null);
  };

  const undo = () => {
    if (!undoStack.current.length) return;
    redoStack.current.push(shapes);
    setShapes(undoStack.current.pop()!);
    setSelectedId(null);
  };

  const redo = () => {
    if (!redoStack.current.length) return;
    undoStack.current.push(shapes);
    setShapes(redoStack.current.pop()!);
    setSelectedId(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // DELETE
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
      // UNDO  (Ctrl/Cmd + Z)
      else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        undo();
      }
      // REDO  (Ctrl/Cmd+Shift+Z  atau  Ctrl/Cmd+Y)
      else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        redo();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shapes, selectedId]);

  const clearAll = () => {
    setShapes([]);
    setIsDrawingPoly(false);
    setCurrentPolyPoints([]);
  };

  return (
    <div className="p-4 select-none">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Button
          onClick={addRect}
          variant="outline"
          className="hover:cursor-pointer"
        >
          Rectangle
        </Button>
        <Button
          onClick={addCircle}
          variant="outline"
          className="hover:cursor-pointer"
        >
          Circle
        </Button>
        <Button
          onClick={startPolygon}
          style={{ background: isDrawingPoly ? "#facc15" : undefined }}
          variant="outline"
          className="hover:cursor-pointer"
        >
          {isDrawingPoly ? "Finish / Cancel" : "Polygon"}
        </Button>
        <Button
          onClick={clearAll}
          variant="outline"
          className="hover:cursor-pointer"
        >
          Clear
        </Button>
      </div>

      <Stage
        width={2000}
        height={550}
        ref={stageRef}
        className="border border-gray-300 rounded overflow-x-hidden"
        onClick={handleStageClick}
      >
        <Layer>
          {/* Existing shapes */}
          {shapes.map((shape) => {
            // ⬢ Polygon — tetap manual
            if (shape.type === "polygon") {
              const s = shape as PolygonShape;
              return (
                <Line
                  key={s.id}
                  points={s.points}
                  fill={s.fill}
                  closed
                  draggable
                  opacity={0.5}
                />
              );
            }

            // ▢ ◯ 🖼️  Semua selain polygon ➜ StretchableShape
            return (
              <StretchableShape
                key={shape.id}
                shape={shape} // Rect | Circle | Image
                isSelected={shape.id === selectedId}
                onSelect={() => setSelectedId(shape.id)} // klik ➜ pilih
                onChange={(attrs) => updateShape(shape.id, attrs)}
              />
            );
          })}
          {/* Live drawing preview */}
          {isDrawingPoly && currentPolyPoints.length >= 2 && (
            <Line
              points={currentPolyPoints}
              stroke="#6b7280"
              dash={[10, 5]}
              closed={false}
            />
          )}
          {isDrawingPoly &&
            currentPolyPoints.map((val, idx) => {
              if (idx % 2 === 1) return null; // only handle x once per pair
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
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageMapView;
