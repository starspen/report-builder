"use client";
import Konva from "konva";
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
  locked: boolean;
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
  onSelect: (e: Konva.KonvaEventObject<Event>) => void;
  /** update callback – supply only changed attrs */
  onChange: (
    newAttrs: Partial<RectShape | CircleShape | EllipseShape | ImageShape>
  ) => void;
  mode?:
    | "default"
    | "drawPolygon"
    | "drawRect"
    | "drawCircle"
    | "drawEllipse"
    | "viewOnly";
  /** optional, untuk multi-select support */
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  isInGroup?: boolean;
  onDoubleClick?: (e: Konva.KonvaEventObject<Event>) => void;
  onContextMenu?: (e: any) => void;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  isLocked: boolean;
  listening?: boolean;
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
  setSelectedIds,
  selectedIds,
  isInGroup,
  onDoubleClick,
  onContextMenu,
  onClick,
  isLocked,
  listening,
}) => {
  const ref = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img] =
    shape.type === "image" ? useImage((shape as ImageShape).src) : [undefined];
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isSelected && ref.current && trRef.current) {
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const isViewOnly = mode === "viewOnly";

  const common = {
    ref,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    opacity: isHovered ? 0.8 : 0.5,
    stroke: "#333",
    strokeWidth: 1,
    listening: listening ?? true,
    draggable: !isViewOnly && !isInGroup && !shape.locked,
    onClick: onSelect,
    onTap: onSelect,
    onMouseEnter: () => {
      setIsHovered(true);
      const container = ref.current?.getStage()?.container();
      if (container) container.style.cursor = "pointer";
    },
    onMouseLeave: () => {
      setIsHovered(false);
      const container = ref.current?.getStage()?.container();
      if (container) container.style.cursor = "default";
    },
  } as const;

  const commonForImage = {
    ref,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    draggable: !isInGroup && !shape.locked,
    onClick: onSelect,
    onTap: onSelect,
    listening: listening ?? true,
  } as const;

  const handleTransformEnd = () => {
    if (isLocked) return;
    const node = ref.current;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    if (shape.type === "rect") {
      onChange({
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
        fill: shape.fill,
      });
    } else if (shape.type === "ellipse") {
      onChange({
        x: node.x(),
        y: node.y(),
        radiusX: node.radiusX() * scaleX,
        radiusY: node.radiusY() * scaleY,
        fill: shape.fill,
      });
    } else if (shape.type === "circle") {
      onChange({
        x: node.x(),
        y: node.y(),
        radius: node.radius() * scaleX,
        fill: shape.fill,
      });
    } else {
      onChange({
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
      });
    }
  };

  const handleDragEnd = (e: any) => {
    if (isLocked) return;
    const node = e.target;
    const x = node.x(); // sudah otomatis dihitung dalam konteks Group
    const y = node.y();
    onChange({ x, y });
  };

  let element = null;
  if (shape.type === "rect") {
    element = (
      <KonvaRect
        {...common}
        width={(shape as RectShape).width}
        height={(shape as RectShape).height}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;

          // Biarkan shape langsung di-select tanpa klik tambahan
          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id]
              );
            } else {
              setSelectedIds([shape.id]);
            }
          }

          // Panggil onSelect satu kali, cukup
          onSelect(e);
          onClick?.(e);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 optional
          onSelect(e);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e);
          onSelect(e); // 🟡 for touch
        }}
        onContextMenu={onContextMenu}
      />
    );
  } else if (shape.type === "ellipse") {
    element = (
      <KonvaEllipse
        {...common}
        radiusX={(shape as EllipseShape).radiusX}
        radiusY={(shape as EllipseShape).radiusY}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;

          // Biarkan shape langsung di-select tanpa klik tambahan
          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id]
              );
            } else {
              setSelectedIds([shape.id]);
            }
          }

          // Panggil onSelect satu kali, cukup
          onSelect(e);
          onClick?.(e);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 optional
          onSelect(e);
          console.log("click count:", e.evt.detail);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 for touch
          onSelect(e);
        }}
        onContextMenu={onContextMenu}
      />
    );
  } else if (shape.type === "circle") {
    element = (
      <KonvaCircle
        {...common}
        radius={(shape as CircleShape).radius}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;

          // Biarkan shape langsung di-select tanpa klik tambahan
          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id]
              );
            } else {
              setSelectedIds([shape.id]);
            }
          }

          // Panggil onSelect satu kali, cukup
          onSelect(e);
          onClick?.(e);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 optional
          onSelect(e);
          onClick?.(e);

          console.log("click count:", e.evt.detail);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 for touch
          onSelect(e);
        }}
        onContextMenu={onContextMenu}
      />
    );
  } else {
    element = (
      <KonvaImage
        {...commonForImage}
        image={img}
        width={(shape as ImageShape).width}
        height={(shape as ImageShape).height}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={(e) => {
          e.cancelBubble = true;

          // Biarkan shape langsung di-select tanpa klik tambahan
          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id]
              );
            } else {
              setSelectedIds([shape.id]);
            }
          }

          // Panggil onSelect satu kali, cukup
          onSelect(e);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        draggable={
          !isViewOnly && isSelected && mode === "default" && !shape.locked
        }
        listening={listening}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 optional
          onSelect(e);
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 for touch
          onSelect(e);
        }}
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
