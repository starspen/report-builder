"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import StretchableShape from "@/app/[locale]/(site-plan)/site-plan-editor/component/image-renderer";
import {
  PolygonShape,
  RectShape,
  CircleShape,
  ImageShape,
  EllipseShape,
} from "@/app/[locale]/(site-plan)/site-plan-editor/component/toolbar";
import { Shape } from "@/app/[locale]/(site-plan)/site-plan-editor/component/right-sidebar";
import Konva from "konva";

interface ViewOnlyCanvasProps {
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
  menuItems: { id: string; title: string }[];
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
}

const ViewOnlyCanvas: React.FC<ViewOnlyCanvasProps> = ({
  shapes,
  onShapeClick,
}) => {
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 550 });

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

  const centerShapes = () => {
    const stage = stageRef.current;
    if (!stage || shapes.length === 0) return;

    const layer = stage.getLayers()[0];
    const group = new Konva.Group();

    // Tambahkan semua shape sementara ke group untuk hitung bounding box
    shapes.forEach((shape) => {
      const dummy = new Konva.Rect({
        x: shape.x || 0,
        y: shape.y || 0,
        width: "width" in shape ? shape.width || 0 : 10,
        height: "height" in shape ? shape.height || 0 : 10,
      });
      group.add(dummy);
    });

    const box = group.getClientRect();
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const centerX = stageWidth / 2 - (box.x + box.width / 2) * scale;
    const centerY = stageHeight / 2 - (box.y + box.height / 2) * scale;

    setPosition({ x: centerX, y: centerY });
  };

  React.useEffect(() => {
    // Delay centering to ensure render is ready
    const timeout = setTimeout(() => {
      centerShapes();
    }, 100); // bisa disesuaikan
    return () => clearTimeout(timeout);
  }, [shapes, scale]);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[550px]">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
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
                  mode="viewOnly"
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
