"use client";
import React, { useRef, useEffect } from "react";
import { Group, Rect, Transformer } from "react-konva";
import StretchableShape from "./image-renderer";
import StretchablePolygon from "./stretchable-polygon";
import { GroupShape, Shape } from "./toolbar";

interface Props {
  shape: GroupShape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<GroupShape>) => void;
  stageScale: number;
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
  setIsDraggingGroup?: React.Dispatch<React.SetStateAction<boolean>>;

  // 🆕 Tambahan untuk fitur isolate-regroup
  shapes: Shape[];
  onShapesChange: (shapes: Shape[]) => void;
  setIsolatedGroup: React.Dispatch<
    React.SetStateAction<{
      originalGroup: GroupShape;
      fromGroupId: string;
    } | null>
  >;
  setSelectedId: (id: string | null) => void;
}

const StretchableGroup: React.FC<Props> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  setSelectedIds,
  selectedIds,
  setIsDraggingGroup,
  shapes,
  onShapesChange,
  setIsolatedGroup,
  setSelectedId,
}) => {
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      x: node.x(),
      y: node.y(),
      children: shape.children.map((child) => {
        return {
          ...child,
          x: child.x * scaleX,
          y: child.y * scaleY,
        };
      }),
    });
  };

  const getGroupBoundingBox = () => {
    const xs = shape.children.map((c) => c.x);
    const ys = shape.children.map((c) => c.y);

    const widths = shape.children.map((c) =>
      c.type === "rect" || c.type === "image"
        ? c.width
        : c.type === "ellipse"
        ? c.radiusX * 2
        : c.type === "circle"
        ? c.radius * 2
        : 0
    );

    const heights = shape.children.map((c) =>
      c.type === "rect" || c.type === "image"
        ? c.height
        : c.type === "ellipse"
        ? c.radiusY * 2
        : c.type === "circle"
        ? c.radius * 2
        : 0
    );

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
    const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={shape.x}
        y={shape.y}
        draggable
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTransformEnd={(e) => {
          e.cancelBubble = true;
          setIsDraggingGroup?.(false);
          handleTransformEnd();
        }}
        onDragStart={() => setIsDraggingGroup?.(true)}
        onDragEnd={(e) => {
          setIsDraggingGroup?.(false);
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformStart={(e) => {
          e.cancelBubble = true;
          setIsDraggingGroup?.(true);
        }}
      >
        {(() => {
          const bounds = getGroupBoundingBox();
          return (
            <Rect
              x={bounds.x}
              y={bounds.y}
              width={bounds.width}
              height={bounds.height}
              fill="rgba(0,0,0,0.0)" // invisible but catch pointer events
              listening={false}
              pointerEvents="none"
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
        })()}

        {shape.children.map((child) =>
          child.type === "polygon" ? (
            <StretchablePolygon
              key={child.id}
              shape={child}
              isSelected={
                !isSelected && (selectedIds?.includes(child.id) ?? false)
              }
              onSelect={(e) => {
                e.cancelBubble = true;

                const mouseEvt = e.evt as MouseEvent; // ✅ Fix error

                if (!isSelected && setSelectedIds && selectedIds) {
                  if (mouseEvt.shiftKey) {
                    setSelectedIds((prev) =>
                      prev.includes(child.id) ? prev : [...prev, child.id]
                    );
                  } else {
                    setSelectedIds([child.id]);
                  }
                }

                onSelect(); // tetap panggil untuk setSelectedId tunggal
              }}
              onChange={(attrs) => {
                const updatedChildren = shape.children.map((c) => {
                  if (c.id === child.id) {
                    return {
                      ...c,
                      ...attrs,
                      type: c.type, // 👈 memastikan 'type' tidak menjadi union ambigu
                    } as typeof c; // 👈 bantu TypeScript tahu ini tetap tipe asli
                  }
                  return c;
                });

                onChange({ children: updatedChildren });
              }}
              stageScale={stageScale}
              setSelectedIds={setSelectedIds}
              selectedIds={selectedIds}
            />
          ) : (
            <StretchableShape
              key={child.id}
              shape={child}
              isSelected={
                !isSelected && (selectedIds?.includes(child.id) ?? false)
              }
              onSelect={(e) => {
                e.cancelBubble = true;

                const mouseEvt = e.evt as MouseEvent; // ✅ Fix error

                if (setSelectedIds && selectedIds) {
                  if (mouseEvt.shiftKey) {
                    setSelectedIds((prev) =>
                      prev.includes(child.id) ? prev : [...prev, child.id]
                    );
                  } else {
                    setSelectedIds([child.id]);
                  }
                }

                onSelect();
              }}
              onChange={(attrs) => {
                const updatedChildren = shape.children.map((c) => {
                  if (c.id === child.id) {
                    return {
                      ...c,
                      ...attrs,
                      type: c.type, // 👈 memastikan 'type' tidak menjadi union ambigu
                    } as typeof c; // 👈 bantu TypeScript tahu ini tetap tipe asli
                  }
                  return c;
                });

                onChange({ children: updatedChildren });
              }}
              mode="default"
              setSelectedIds={setSelectedIds}
              selectedIds={selectedIds}
              isInGroup={true}
              onDoubleClick={(e) => {
                e.cancelBubble = true;

                const mouseEvt = e.evt as MouseEvent;

                // Multi-select support
                if (setSelectedIds) {
                  if (mouseEvt.shiftKey) {
                    setSelectedIds((prev) =>
                      prev.includes(child.id) ? prev : [...prev, child.id]
                    );
                  } else {
                    setSelectedIds([child.id]);
                  }
                }

                // 🔽 Ambil group dan child yang diklik
                const parentGroup = shape;
                const clickedChild = child;

                // Hitung posisi absolut child terhadap canvas (bukan relatif group lagi)
                const absoluteChild = {
                  ...clickedChild,
                  x: parentGroup.x + clickedChild.x,
                  y: parentGroup.y + clickedChild.y,
                };

                // Kosongkan isi grup
                onChange({ children: [] });

                // Hapus grup lama
                const remainingShapes = shapes.filter(
                  (s) => s.id !== parentGroup.id
                );

                // Tambahkan shape hasil isolate
                const updatedShapes = [...remainingShapes, absoluteChild];
                onShapesChange(updatedShapes);

                // Simpan state untuk nanti regroup
                setIsolatedGroup({
                  originalGroup: parentGroup,
                  fromGroupId: parentGroup.id,
                });

                // Auto-select langsung agar transformer muncul
                setSelectedId(clickedChild.id);

                // Trigger klik manual agar Transformer langsung muncul
                setTimeout(() => {
                  const layer = groupRef.current?.getLayer();
                  const node = layer?.findOne(`#${clickedChild.id}`);
                  if (node) {
                    node.fire("click");
                  }
                }, 0);
              }}
            />
          )
        )}
      </Group>
      {isSelected && <Transformer ref={trRef} rotateEnabled={false} />}
    </>
  );
};

export default StretchableGroup;
