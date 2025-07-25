// shape-types.ts
export type ShapeBase = {
  id: string;
  fill: string;
  x: number;
  y: number;
  lotId?: string;
  locked: boolean; // <-- wajib agar seragam
  linkToArtboard?: string;
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

export type EllipseShape = ShapeBase & {
  type: "ellipse";
  radiusX: number;
  radiusY: number;
};

export type PolygonShape = ShapeBase & {
  type: "polygon";
  points: number[];
  status?: string;
  lot_no: string;
};

export type ImageShape = ShapeBase & {
  type: "image";
  width: number;
  height: number;
  src: string;
};
