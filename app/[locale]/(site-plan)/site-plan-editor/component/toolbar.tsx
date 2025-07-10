"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

// -----------------------------
// 🛠️  Types
// -----------------------------

export type ShapeBase = {
  id: string;
  fill: string;
  x: number;
  y: number;
};

export type RectShape = ShapeBase & {
  type: "rect";
  width: number;
  height: number;
};

export type CircleShape = ShapeBase & {
  type: "circle";
  radius: number;
};

export type EllipseShape = {
  id: string;
  type: "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
};

export type PolygonShape = ShapeBase & {
  type: "polygon";
  points: number[]; // [x1, y1, x2, y2, ...]
};

export type ImageShape = ShapeBase & {
  type: "image";
  src: string;
  width: number;
  height: number;
};

export type GroupChildShape =
  | RectShape
  | CircleShape
  | EllipseShape
  | ImageShape
  | PolygonShape; // Polygon bisa kamu pakai di StretchablePolygon

export type GroupShape = {
  id: string;
  type: "group";
  x: number;
  y: number;
  children: GroupChildShape[]; // bisa rect, image, polygon, dll
};

export type Shape = GroupChildShape | GroupShape;

// -----------------------------
// 🧰 Toolbar Component
// -----------------------------

interface ToolbarProps {
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddPolygon: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRect,
  onAddCircle,
  onAddPolygon,
  onClear,
}) => (
  <div className="flex gap-2 mb-2">
    <button
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      onClick={onAddRect}
    >
      Rectangle
    </button>
    <button
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      onClick={onAddCircle}
    >
      Circle
    </button>
    <button
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      onClick={onAddPolygon}
    >
      Polygon
    </button>
    <button
      className="px-3 py-1 rounded bg-red-200 hover:bg-red-300"
      onClick={onClear}
    >
      Clear
    </button>
  </div>
);

export default Toolbar;
