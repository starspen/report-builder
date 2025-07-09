"use client";
import React, { useRef, useEffect, useState } from "react";
import { Line, Transformer, Circle as KonvaCircle } from "react-konva";
import type { PolygonShape } from "./toolbar";
import Konva from "konva";

interface StretchablePolygonProps {
  shape: PolygonShape;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<Event>) => void;
  onChange: (attrs: Partial<PolygonShape>) => void;
  stageScale: number; // 👈 tambahkan ini
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  isInGroup?: boolean
}

const StretchablePolygon: React.FC<StretchablePolygonProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  setSelectedIds,
  selectedIds,
  isInGroup
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Drag point handler
  const handlePointDrag = (idx: number, e: any) => {
    const newPoints = shape.points.slice();
    const stage = shapeRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const canvasX = (pointer.x - stage.x()) / stage.scaleX();
    const canvasY = (pointer.y - stage.y()) / stage.scaleY();

    newPoints[idx * 2] = canvasX;
    newPoints[idx * 2 + 1] = canvasY;

    onChange({ points: newPoints });
  };

  // Drag polygon handler
  const handleDragMove = (e: any) => {
    setIsDragging(true);
    setDragOffset({ x: e.target.x(), y: e.target.y() });
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const stage = shapeRef.current.getStage();
    const dx = node.x() / stage.scaleX();
    const dy = node.y() / stage.scaleY();

    // Geser semua points dengan delta drag
    const newPoints = shape.points.map((val, i) =>
      i % 2 === 0 ? val + dx : val + dy
    );
    // Reset posisi Line ke (0,0)
    node.x(0);
    node.y(0);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    onChange({ points: newPoints });
  };

  return (
    <>
      <Line
        ref={shapeRef}
        points={shape.points}
        fill={shape.fill}
        closed
        draggable={!isInGroup}
        opacity={0.5}
        onClick={(e) => {
          e.cancelBubble = true;
          console.log("clicked", shape.id, "shift?", e.evt.shiftKey);

          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id]
              );
            } else {
              setSelectedIds([shape.id]);
            }
          }
          onSelect(e);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />
      {isSelected &&
        shape.points.length >= 4 &&
        shape.points.map((val, idx) => {
          if (idx % 2 === 1) return null;
          const x = shape.points[idx] + (isDragging ? dragOffset.x : 0);
          const y = shape.points[idx + 1] + (isDragging ? dragOffset.y : 0);
          return (
            <KonvaCircle
              key={idx}
              x={x}
              y={y}
              radius={4 / stageScale}
              fill="#facc15"
              stroke="#333"
              strokeWidth={1 / stageScale}
              draggable
              onDragMove={(e) => handlePointDrag(idx / 2, e)}
              onClick={(e) => {
                e.cancelBubble = true;
                console.log("clicked", shape.id, "shift?", e.evt.shiftKey);

                if (setSelectedIds && selectedIds) {
                  if (e.evt.shiftKey) {
                    setSelectedIds((prev) =>
                      prev.includes(shape.id) ? prev : [...prev, shape.id]
                    );
                  } else {
                    setSelectedIds([shape.id]);
                  }
                }
                onSelect(e);
              }}
              onTap={(e) => (e.cancelBubble = true)}
            />
          );
        })}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          enabledAnchors={[]} // disable all resize
          anchorSize={12}
        />
      )}
    </>
  );
};

export default StretchablePolygon;
