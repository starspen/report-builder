"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Image as KonvaImage,
  Ellipse as KonvaEllipse,
  Transformer,
} from "react-konva";
import useImage from "use-image";

// -----------------------------
// 🛠️  Types
// -----------------------------

type ShapeBase = {
  id: string;
  x: number;
  y: number;
  fill: string;
};

export type RectShape = ShapeBase & {
  type: "rect";
  width: number;
  height: number;
};
export type CircleShape = ShapeBase & { type: "circle"; radius: number };
export type ImageShape = ShapeBase & {
  type: "image";
  src: string;
  width: number;
  height: number;
};

export type EllipseShape = ShapeBase & {
  type: "ellipse";
  radiusX: number;
  radiusY: number;
};

export type StretchableShapeProps = {
  shape: RectShape | CircleShape | ImageShape | EllipseShape;
  isSelected: boolean;
  onSelect: () => void;
  /** update callback – supply only changed attrs */
  onChange: (
    newAttrs: Partial<RectShape | CircleShape | EllipseShape | ImageShape>
  ) => void;
  mode: "default" | "drawPolygon";
};

// -----------------------------
// 📦 Unified StretchableShape
// -----------------------------

const StretchableShape: React.FC<StretchableShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  mode,
}) => {
  const ref = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img] =
    shape.type === "image" ? useImage((shape as ImageShape).src) : [undefined];

  useEffect(() => {
    if (isSelected && ref.current && trRef.current) {
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const common = {
    ref,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    opacity: 0.5,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
  } as const;

  const commonForImage = {
    ref,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
  } as const;

  const handleTransformEnd = () => {
    const node = ref.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    if (shape.type === "rect") {
      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      });
    } else if (shape.type === "ellipse") {
      onChange({
        x: node.x(),
        y: node.y(),
        radiusX: Math.max(5, node.radiusX() * scaleX),
        radiusY: Math.max(5, node.radiusY() * scaleY),
      });
    } else if (shape.type === "circle") {
      onChange({
        x: node.x(),
        y: node.y(),
        radius: Math.max(5, node.radius() * scaleX),
      });
    } else {
      // image
      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      });
    }
  };

  const handleDragEnd = (e: any) =>
    onChange({ x: e.target.x(), y: e.target.y() });

  let element = null;
  if (shape.type === "rect") {
    element = (
      <KonvaRect
        {...common}
        width={(shape as RectShape).width}
        height={(shape as RectShape).height}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      />
    );
  } else if (shape.type === "ellipse") {
    element = (
      <KonvaEllipse
        {...common}
        radiusX={(shape as EllipseShape).radiusX}
        radiusY={(shape as EllipseShape).radiusY}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      />
    );
  } else if (shape.type === "circle") {
    element = (
      <KonvaCircle
        {...common}
        radius={(shape as CircleShape).radius}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
      />
    );
  } else {
    element = (
      <KonvaImage
        {...commonForImage}
        image={img}
        width={(shape as ImageShape).width}
        height={(shape as ImageShape).height}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        listening={mode !== "drawPolygon"}
      />
    );
  }

  return (
    <>
      {element}
      {isSelected && <Transformer ref={trRef} rotateEnabled={false} />}
    </>
  );
};

export default StretchableShape;
