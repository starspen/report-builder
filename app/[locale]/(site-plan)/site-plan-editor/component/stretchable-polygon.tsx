"use client";
import React, { useRef, useEffect, useState } from "react";
import { Line, Transformer, Circle as KonvaCircle } from "react-konva";
import Konva from "konva";
import type { PolygonShape } from "./toolbar";
import { LOT_COLOR_MAP } from "./canvas";

interface StretchablePolygonProps {
  shape: PolygonShape;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<Event>) => void;
  onChange: (attrs: Partial<PolygonShape>) => void;
  stageScale: number;
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  isInGroup?: boolean;
}

const StretchablePolygon: React.FC<StretchablePolygonProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  setSelectedIds,
  selectedIds,
  isInGroup = false,
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Transformer support
  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handlePointDrag = (idx: number, e: any) => {
    const newPoints = [...shape.points];
    const stage = shapeRef.current.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const canvasX = (pointer.x - stage.x()) / stage.scaleX();
    const canvasY = (pointer.y - stage.y()) / stage.scaleY();

    newPoints[idx * 2] = canvasX - shape.x;
    newPoints[idx * 2 + 1] = canvasY - shape.y;

    onChange({ points: newPoints });
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const absPos = node.absolutePosition();

    const stage = node.getStage();
    const scaleX = stage.scaleX();
    const scaleY = stage.scaleY();
    const stageX = stage.x();
    const stageY = stage.y();

    // Hitung posisi baru relatif terhadap canvas (bukan terhadap parent)
    const newX = (absPos.x - stageX) / scaleX;
    const newY = (absPos.y - stageY) / scaleY;

    // Reset posisi node agar tidak offset dobel
    node.position({ x: 0, y: 0 });

    onChange({
      x: newX,
      y: newY,
      points: shape.points,
    });
  };

  return (
    <>
      <Line
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        points={shape.points}
        fill={shape.fill || LOT_COLOR_MAP.DEFAULT}
        closed
        opacity={0.5}
        draggable={!isInGroup}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onClick={(e) => {
          e.cancelBubble = true;
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
      />
      {/* Points hanya muncul jika polygon tidak di dalam group */}
      {!isInGroup &&
        isSelected &&
        shape.points.length >= 4 &&
        shape.points.map((val, idx) => {
          if (idx % 2 === 1) return null;
          const x = shape.x + shape.points[idx];
          const y = shape.y + shape.points[idx + 1];
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
      {isSelected && !isInGroup && (
        <Transformer ref={trRef} rotateEnabled={false} enabledAnchors={[]} />
      )}
    </>
  );
};

export default StretchablePolygon;
