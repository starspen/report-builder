"use client";
import React, { useRef, useEffect, useState } from "react";
import { Line, Transformer, Circle as KonvaCircle } from "react-konva";
import type { PolygonShape } from "./toolbar";

interface StretchablePolygonProps {
  shape: PolygonShape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<PolygonShape>) => void;
}

const StretchablePolygon: React.FC<StretchablePolygonProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
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
    newPoints[idx * 2] = e.target.x();
    newPoints[idx * 2 + 1] = e.target.y();
    onChange({ points: newPoints });
  };

  // Drag polygon handler
  const handleDragMove = (e: any) => {
    setIsDragging(true);
    setDragOffset({ x: e.target.x(), y: e.target.y() });
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const dx = node.x();
    const dy = node.y();
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
        draggable
        opacity={0.5}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
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
              radius={4}
              fill="#facc15"
              stroke="#333"
              strokeWidth={1}
              draggable
              onDragMove={(e) => handlePointDrag(idx / 2, e)}
              onClick={(e) => (e.cancelBubble = true)}
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
