"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import StretchableShape from "@/app/[locale]/(site-plan)/site-plan-editor/component/image-renderer";
import {
  Shape,
  PolygonShape,
  RectShape,
  CircleShape,
  ImageShape,
  EllipseShape,
} from "@/app/[locale]/(site-plan)/site-plan-editor/component/toolbar";

interface ViewOnlyCanvasProps {
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
}

const ViewOnlyCanvas: React.FC<ViewOnlyCanvasProps> = ({
  shapes,
  onShapeClick,
}) => {
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = scale;

    const pointer = stageRef.current.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <Stage
        width={2000}
        height={550}
        ref={stageRef}
        className="border border-gray-300 rounded"
        draggable
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setPosition(e.target.position());
        }}
      >
        <Layer>
          {shapes.map((shape) => {
            if (shape.type === "polygon") {
              const s = shape as PolygonShape;
              return (
                <Line
                  key={s.id}
                  x={s.x}
                  y={s.y}
                  points={s.points}
                  fill={s.fill}
                  closed
                  draggable={false}
                  opacity={0.5}
                  onClick={() => onShapeClick?.(shape)}
                />
              );
            }

            if (shape.type === "group") return null;

            if (
              shape.type === "rect" ||
              shape.type === "circle" ||
              shape.type === "image" ||
              shape.type === "ellipse"
            ) {
              return (
                <StretchableShape
                  key={shape.id}
                  shape={
                    shape as RectShape | CircleShape | ImageShape | EllipseShape
                  }
                  isSelected={false}
                  onSelect={() => onShapeClick?.(shape)}
                  onChange={() => {}}
                />
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ViewOnlyCanvas;
