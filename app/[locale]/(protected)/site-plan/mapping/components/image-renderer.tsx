"use client";
import React, { useRef, useEffect } from "react";
import {
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Image as KonvaImage,
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

export type StretchableShapeProps = {
  shape: RectShape | CircleShape | ImageShape;
  isSelected: boolean;
  onSelect: () => void;
  /** update callback – supply only changed attrs */
  onChange: (newAttrs: Partial<RectShape | CircleShape | ImageShape>) => void;
};

// -----------------------------
// 📦 Unified StretchableShape
// -----------------------------

const StretchableShape: React.FC<StretchableShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
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
      />
    );
  } else if (shape.type === "circle") {
    element = (
      <KonvaCircle
        {...common}
        radius={(shape as CircleShape).radius}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
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
