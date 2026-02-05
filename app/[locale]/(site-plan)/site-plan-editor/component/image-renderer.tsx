"use client";
import Konva from "konva";
import React, { useRef, useEffect, useState } from "react";
import {
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Image as KonvaImage,
  Ellipse as KonvaEllipse,
  Transformer,
  Text as KonvaText,
  Label,
  Tag,
  Group,
} from "react-konva";
import useImage from "use-image";

// -----------------------------
// 🛠️  Types
// -----------------------------

type ShapeBase = {
  id: string;
  x: number;
  y: number;
  fill?: string;
  locked?: boolean;
  tableId?: string;
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

export type TextShape = ShapeBase & {
  type: "text";
  text: string;
  fontSize: number;
  width?: number; // opsional
  height?: number; // opsional
  fontFamily?: string;
  labelX?: number;
  labelY?: number;
};

export type TableLabel = {
  id: string;
  text: string;
  labelX: number; // posisi RELATIF di dalam Group table
  labelY: number;
  fontSize?: number;
  fontFamily?: string;
  width?: number;
  height?: number;
  type?: "text";
  source_table_name?: string;
  text_column?: string;
  column_filter?: string;
};

export type TableCell = {
  x: number; // relatif ke table.x (0 = kiri table)
  y: number; // relatif ke table.y (0 = atas table)
  width: number;
  height: number;
  header?: string;
  text_column?: string;
  column_filter?: string;
  labels?: TableLabel[];
  tableId?: string;
  source_table_name?: string;
};

export type Table = ShapeBase & {
  type: string;
  width: number;
  height: number;
  label?: string;
  tableId?: string;
  source_table_name?: string;
  text_column?: string;
  table_cd?: string;
  column_filter?: string;
  labels: TableLabel[];
  tables?: TableCell[];
  fontSize?: number;
};

export type LabelPatch = Partial<
  Pick<
    TableLabel,
    | "text"
    | "fontSize"
    | "fontFamily"
    | "labelX"
    | "labelY"
    | "source_table_name"
    | "text_column"
  >
>;
export type TablePatch = Partial<Table>;

export type StretchableShapeProps = {
  shape:
    | RectShape
    | CircleShape
    | ImageShape
    | EllipseShape
    | TextShape
    | Table;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<Event>) => void;
  /** update callback – supply only changed attrs */
  onChange: (
    newAttrs: Partial<
      RectShape | CircleShape | EllipseShape | ImageShape | TextShape | Table
    >,
  ) => void;
  mode?:
    | "default"
    | "drawPolygon"
    | "drawRect"
    | "drawCircle"
    | "drawEllipse"
    | "viewOnly"
    | "panning"
    | "multiSelect"
    | "drawText"
    | "drawTable";
  /** optional, untuk multi-select support */
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  isInGroup?: boolean;
  onDoubleClick?: (e: Konva.KonvaEventObject<Event>) => void;
  onContextMenu?: (
    e: any,
    coords?: { clientX: number; clientY: number },
  ) => void;

  onClick?: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  isLocked: boolean;
  listening?: boolean;
  onTap?: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  showTooltip?: boolean;
  getTooltipContent?: (shape: any) => string | null;
  containerWidth?: number;
  containerHeight?: number;
  backgroundColor?: string;
  draggable?: boolean;
  onStartEditText?: (shape: TextShape) => void;
  scaledFontSize?: number;
  stageScale?: number;
  editing?: boolean;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  tableValue: string;
  setTableValue: React.Dispatch<React.SetStateAction<string>>;
  editingTableId: string | null;
  setEditingTableId: React.Dispatch<React.SetStateAction<string | null>>;
  editingLabelId: string | null;
  setEditingLabelId: React.Dispatch<React.SetStateAction<string | null>>;
  onSelectLabel?: (tableId: string, labelId: string) => void;
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
  onTap,
  showTooltip,
  getTooltipContent,
  containerWidth,
  containerHeight,
  backgroundColor = "transparent",
  draggable,
  onStartEditText,
  scaledFontSize,
  stageScale,
  editing,
  setEditing,
  inputValue,
  setInputValue,
  tableValue,
  setTableValue,
  editingTableId,
  setEditingTableId,
  editingLabelId,
  setEditingLabelId,
  onSelectLabel,
}) => {
  const ref = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img] =
    shape.type === "image" ? useImage((shape as ImageShape).src) : [undefined];
  const [isHovered, setIsHovered] = useState(false);
  const [columns, setColumns] = useState([]); // Awal kosong
  const [editingColId, setEditingColId] = useState(null);
  const [canvasOffset, setCanvasOffset] = useState({ left: 0, top: 0 }); // Buat posisi input
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (isSelected && ref.current && trRef.current) {
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const isViewOnly = mode === "viewOnly";
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const common = {
    ref,
    x: shape.x,
    y: shape.y,
    tableId: shape.tableId,
    fill: "",
    opacity: isHovered ? 0.8 : 0.5,
    stroke: "#333",
    strokeWidth: 1,
    listening: listening ?? true,
    draggable: draggable ?? (!isViewOnly && !isInGroup && !shape.locked),
    onClick: (e: any) => {
      e.cancelBubble = true;
      onSelect(e);
      onClick?.(e); // ✅ Panggil juga handler parent
    },
    onTap: (e: any) => {
      e.cancelBubble = true;
      onSelect(e);
      onTap?.(e); // ✅ Panggil handler parent
    },
    onMouseEnter: (evt: any) => {
      try {
        setIsHovered(true);

        const node = ref.current;
        if (!node) return;

        const stage = node.getStage?.();
        if (!stage) return;

        // ubah cursor menjadi pointer
        stage.container().style.cursor = "pointer";

        // kalau tooltip diaktifkan
        if (showTooltip && getTooltipContent) {
          const pos = stage.getPointerPosition?.();
          if (!pos) return;

          const text = getTooltipContent(shape);
          if (!text) return;

          // ✅ gunakan koordinat Konva, bukan DOM
          setTooltip({
            x: pos.x + 10, // geser sedikit biar tooltip tidak tepat di atas cursor
            y: pos.y + 10,
            text,
          });
        }
      } catch (err) {
        console.warn("Tooltip error ignored:", err);
      }
    },

    onMouseMove: (evt: any) => {
      try {
        const stage = ref.current?.getStage?.();
        if (!stage) return;

        const pos = stage.getPointerPosition?.();
        if (!pos) return;

        // update posisi tooltip supaya ikut cursor
        setTooltip((prev) =>
          prev ? { ...prev, x: pos.x + 10, y: pos.y + 10 } : null,
        );
      } catch (err) {
        console.warn("Tooltip move error ignored:", err);
      }
    },

    onMouseLeave: () => {
      setIsHovered(false);
      setTooltip(null);

      const stage = ref.current?.getStage?.();
      if (stage) stage.container().style.cursor = "default";
    },
  } as const;

  const commonForImage = {
    ref,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    draggable: draggable ?? (!isInGroup && !shape.locked),
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
    } else if (shape.type === "text") {
      onChange({
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
        fontSize: (shape as TextShape).fontSize, // tetap
      });
    } else if (shape.type === "table") {
      onChange({
        x: node.x(),
        y: node.y(),
        width: node.width() * scaleX,
        height: node.height() * scaleY,
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

  const holdTimeoutRef = useRef<any>(null);
  const isHoldingRef = useRef(false);

  const table = shape as Table;

  const [text, setText] = useState<TableLabel[]>([]);
  const [textColumn, setTextColumn] = useState("");

  useEffect(() => {
    if (!table) return; // amanin kalau table undefined

    if (table.text_column) {
      setTextColumn(table.text_column);
    } else {
      setTextColumn("");
    }

    if (Array.isArray(table.labels)) {
      setText(table.labels);
    } else {
      setText([]);
    }
  }, [table]); // ✅ hanya jalan kalau table berubah

  useEffect(() => {
    if (!isSelected || !trRef.current) return;

    // Kalau table + ada label yang sedang dipilih/diedit, biarkan Transformer tetap di label
    if (shape.type === "table" && editingLabelId) return;

    if (ref.current) {
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shape.type, editingLabelId]);

  useEffect(() => {
    if (trRef.current && selectedNode) {
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNode]);

  let element = null;
  if (shape.type === "rect") {
    element = (
      <>
        <KonvaRect
          id={shape.id}
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
                  prev.includes(shape.id) ? prev : [...prev, shape.id],
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
          onTouchStart={(e) => {
            const touch = e.evt.touches?.[0];
            if (!touch) return;

            isHoldingRef.current = false;

            const clientX = touch.clientX;
            const clientY = touch.clientY;

            holdTimeoutRef.current = setTimeout(() => {
              isHoldingRef.current = true;
              onContextMenu?.(e, { clientX, clientY });
            }, 600);
          }}
          onTouchEnd={(e) => {
            clearTimeout(holdTimeoutRef.current);

            // Cegah tap setelah hold
            if (!isHoldingRef.current) {
              onTap?.(e);
            }

            setTimeout(() => {
              isHoldingRef.current = false;
            }, 50);
          }}
        />
      </>
    );
  } else if (shape.type === "table") {
    const table = shape as Table;

    element = (
      <>
        {/* RECT tabel: beri fill/stroke supaya kelihatan */}
        <KonvaRect
          width={table.width}
          height={table.height}
          fill={shape.fill ?? "#ffffff"} // <-- kelihatan di canvas putih
          stroke="#333"
          strokeWidth={1}
          id={table.id}
          ref={ref}
          x={table.x}
          y={table.y}
          draggable={draggable ?? (!isInGroup && !table.locked)}
          listening={listening ?? true}
          onClick={(e) => {
            e.cancelBubble = true;
            onSelect?.(e);
            onClick?.(e);
            setSelectedNode(ref.current);
          }}
          onDragEnd={isInGroup ? undefined : handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onContextMenu={onContextMenu}
          onDblClick={(e) => {
            e.cancelBubble = true;
            onSelect?.(e);

            // Cari posisi klik di stage → konversi jadi relatif ke tabel
            const stage = e.target.getStage();
            const pt = stage?.getPointerPosition();

            // Default di tengah tabel
            let relX = table.width / 2;
            let relY = table.height / 2;

            if (pt) {
              // absolut -> relatif
              relX = pt.x - table.x;
              relY = pt.y - table.y;
              // clamp supaya tetap di dalam rect
              relX = Math.max(0, Math.min(relX, table.width));
              relY = Math.max(0, Math.min(relY, table.height));
            }

            const newLabel: TableLabel = {
              id: `lbl-${Date.now()}`,
              text: "", // kosong, biar langsung ngetik
              labelX: relX,
              labelY: relY,
              fontSize: 16,
              type: "text",
              source_table_name: table.source_table_name ?? "",
              text_column: table.text_column ?? "",
              column_filter: table.column_filter ?? "",
            } as const;

            // tambahkan label ke table
            onChange?.({ labels: [...(table.labels ?? []), newLabel] });

            // buka editor untuk label baru
            setEditing?.(true);
            setEditingTableId(table.id);
            setEditingLabelId?.(newLabel.id);
            setInputValue(newLabel.text);
          }}
        />

        {/* label-label di dalam table */}
        {(table.labels ?? []).map((lbl) => (
          <KonvaText
            key={lbl.id}
            id={lbl.id} // id khusus label
            text={lbl.text || textColumn || ""}
            x={(Number(table.x) || 0) + (Number(lbl.labelX) || 0)}
            y={(Number(table.y) || 0) + (Number(lbl.labelY) || 0)}
            fontSize={lbl.fontSize ?? 16}
            fontFamily={lbl.fontFamily ?? "Arial"}
            fill="#222"
            draggable
            onClick={(e) => {
              e.cancelBubble = true;
              onSelect?.(e); // tetap select table
              onSelectLabel?.(table.id, lbl.id);

              const node = e.target;
              setSelectedNode(node);

              const tr = trRef.current;
              if (tr) {
                tr.nodes([node]); // ⬅️ pasang ke Konva.Text yg diklik
                tr.getLayer()?.batchDraw();
              }
            }}
            onDragMove={(e) => {
              e.cancelBubble = true; // jangan biarkan event naik
            }}
            onDragEnd={(e) => {
              const node = e.target as Konva.Text;
              const relX = node.x() - table.x;
              const relY = node.y() - table.y;

              onChange?.({
                labels: (table.labels ?? []).map((it) =>
                  it.id === lbl.id ? { ...it, labelX: relX, labelY: relY } : it,
                ),
              });
            }}
            onDblClick={(e) => {
              e.cancelBubble = true;
              onSelect?.(e);
              setEditing?.(true);
              setEditingTableId(table.id);
              onSelectLabel?.(table.id, lbl.id);
              setEditingLabelId?.(lbl.id);
              setInputValue(lbl.text);
            }}
          />
        ))}
      </>
    );
  } else if (shape.type === "ellipse") {
    element = (
      <KonvaEllipse
        id={shape.id}
        {...common}
        radiusX={(shape as EllipseShape).radiusX}
        radiusY={(shape as EllipseShape).radiusY}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        onTransformEnd={handleTransformEnd}
        draggable
        onClick={(e) => {
          e.cancelBubble = true;

          // Biarkan shape langsung di-select tanpa klik tambahan
          if (setSelectedIds && selectedIds) {
            if (e.evt.shiftKey) {
              setSelectedIds((prev) =>
                prev.includes(shape.id) ? prev : [...prev, shape.id],
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
          onDoubleClick?.(e); // 🟡 for touch
          onSelect(e);
        }}
        onContextMenu={onContextMenu}
        onTouchStart={(e) => {
          const touch = e.evt.touches?.[0];
          if (!touch) return;

          isHoldingRef.current = false;

          const clientX = touch.clientX;
          const clientY = touch.clientY;

          holdTimeoutRef.current = setTimeout(() => {
            isHoldingRef.current = true;
            onContextMenu?.(e, { clientX, clientY });
          }, 600);
        }}
        onTouchEnd={(e) => {
          clearTimeout(holdTimeoutRef.current);

          // Cegah tap setelah hold
          if (!isHoldingRef.current) {
            onTap?.(e);
          }

          setTimeout(() => {
            isHoldingRef.current = false;
          }, 50);
        }}
      />
    );
  } else if (shape.type === "circle") {
    element = (
      <KonvaCircle
        id={shape.id}
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
                prev.includes(shape.id) ? prev : [...prev, shape.id],
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
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e); // 🟡 for touch
          onSelect(e);
        }}
        onContextMenu={onContextMenu}
        onTouchStart={(e) => {
          const touch = e.evt.touches?.[0];
          if (!touch) return;

          isHoldingRef.current = false;

          const clientX = touch.clientX;
          const clientY = touch.clientY;

          holdTimeoutRef.current = setTimeout(() => {
            isHoldingRef.current = true;
            onContextMenu?.(e, { clientX, clientY });
          }, 600);
        }}
        onTouchEnd={(e) => {
          clearTimeout(holdTimeoutRef.current);

          // Cegah tap setelah hold
          if (!isHoldingRef.current) {
            onTap?.(e);
          }

          setTimeout(() => {
            isHoldingRef.current = false;
          }, 50);
        }}
      />
    );
  } else if (shape.type === "text") {
    const s = shape as TextShape;

    element = (
      <KonvaText
        id={shape.id}
        {...common}
        text={s.text}
        x={s.x}
        y={s.y}
        width={s.width ?? 100}
        height={s.height ?? 14} // optional (kalau mau jadi box fixed/clipping)
        wrap="word"
        fontFamily={s.fontFamily || "Arial"}
        fontSize={(s.fontSize ?? 14) * (1 / (stageScale || 1))}
        draggable={draggable ?? (!isInGroup && !s.locked)}
        onDragEnd={isInGroup ? undefined : handleDragEnd}
        // ✅ ini kunci: selama drag transformer, flatten scale jadi width/height real
        onTransform={(e) => {
          if (isLocked) return;
          const node = ref.current as Konva.Text;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // ubah scale jadi width/height "asli"
          const newWidth = Math.max(20, node.width() * scaleX);
          const newHeight = Math.max(10, (node.height() || 0) * scaleY);

          node.scaleX(1);
          node.scaleY(1);
          node.width(newWidth);
          node.height(newHeight); // ✅ selalu
          if (newHeight !== undefined) node.height(newHeight);
        }}
        // ✅ commit ke state setelah selesai
        onTransformEnd={(e) => {
          if (isLocked) return;
          const node = ref.current as Konva.Text;
          if (!node) return;

          onChange?.({
            x: node.x(),
            y: node.y(),
            width: node.width(),
            height: node.height(),
            fontSize: s.fontSize, // ✅ tetap, tidak pernah berubah
          });
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
          onDoubleClick?.(e);
          onSelect(e);
        }}
      />
    );
  } else {
    element = (
      <KonvaImage
        id={shape.id}
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
                prev.includes(shape.id) ? prev : [...prev, shape.id],
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

  let elements = null;
  if (shape.type === "rect") {
    elements = (
      <KonvaRect
        {...common}
        width={(shape as RectShape).width}
        height={(shape as RectShape).height}
      />
    );
  } else if (shape.type === "ellipse") {
    elements = (
      <KonvaEllipse
        {...common}
        radiusX={(shape as EllipseShape).radiusX}
        radiusY={(shape as EllipseShape).radiusY}
      />
    );
  } else if (shape.type === "circle") {
    elements = (
      <KonvaCircle {...common} radius={(shape as CircleShape).radius} />
    );
  } else {
    elements = (
      <KonvaImage
        {...common}
        image={img}
        width={(shape as ImageShape).width}
        height={(shape as ImageShape).height}
      />
    );
  }

  return (
    <>
      {element}
      {mode !== "multiSelect" && isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          enabledAnchors={
            selectedNode?.getClassName?.() === "Text"
              ? [
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                  "middle-left",
                  "middle-right",
                  "top-center",
                  "bottom-center",
                ]
              : undefined
          }
          boundBoxFunc={(oldBox, newBox) => {
            // prevent terlalu kecil
            if (newBox.width < 20 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}

      {tooltip && (
        <Label x={tooltip.x} y={tooltip.y}>
          <Tag fill="black" opacity={0.75} cornerRadius={4} />
          <KonvaText
            text={tooltip.text}
            fill="white"
            fontSize={12}
            padding={5}
          />
        </Label>
      )}
    </>
  );
};

export default StretchableShape;
