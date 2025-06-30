"use client";

import { Unit, PolyUnit, LotDetail } from "../../../interface/unit";
import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Group,
  Circle,
  Line,
} from "react-konva";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useImage from "use-image";
import DetailImage from "./detail-image";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import Image from "next/image";
import BlockDetail from "./block-detail";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ────────────────────────────────────────────────────────────
//  TYPE HELPERS
// ────────────────────────────────────────────────────────────
export type PolygonShape = {
  id: string;
  type: "polygon";
  fill: string;
  points: number[]; // disimpan dlm koordinat gambar-asli
};

type Props = {
  units: Unit[];
  canvasWidth: number;
  canvasHeight: number;
  backgroundSrc: string;
  drawMode: boolean;
  polygonMode: boolean;
  polygonUnits: PolyUnit[];
  onPolygonFinish?: () => void;
};

type SelectedShape =
  | { type: "poly"; data: PolyUnit }
  | { type: "rect"; data: Unit };

const SiteplanCanvas: React.FC<Props> = ({
  units,
  canvasWidth,
  canvasHeight,
  backgroundSrc,
  drawMode,
  polygonMode,
  polygonUnits,
  onPolygonFinish,
}) => {
  // IMAGE & REFS --------------------------------------------------------------
  const [bgImage] = useImage(backgroundSrc);
  const stageRef = useRef<Konva.Stage | null>(null);

  // UI STATES -----------------------------------------------------------------
  const [selectedDetail, setSelectedDetail] = useState<{
    src: string;
    x: number;
    y: number;
  } | null>(null);

  const [selectedRect, setSelectedRect] = useState<Unit[]>([]);

  const [tempRect, setTempRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [polygons, setPolygons] = useState<PolygonShape[]>([]);
  const [drawnUnits, setDrawnUnits] = useState<Unit[]>([]);
  const [currentPolyPoints, setCurrentPolyPoints] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<PolyUnit | null>(null);
  const [selectedShape, setSelectedShape] = useState<SelectedShape | null>(
    null
  );
  // ZOOM & PAN STATE ----------------------------------------------------------
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  // DRAWING HELPERS -----------------------------------------------------------
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const TOLERANCE = 10;
  const SCALE_BY = 1.05;

  const handleDeleteShape = (id: string) => {
    pushSnapshot();
    setDrawnPolygonUnits((prev) => prev.filter((p) => p.id !== id));
    // kalau Anda juga punya drawnUnits:
    setDrawnUnits((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        handleDeleteShape(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const initialPolyUnits = useMemo<PolyUnit[]>(() => {
    const fromProps = polygonUnits;
    const fromStorage: PolyUnit[] = (() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("poly-units");
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return [];
          }
        }
      }
      return [];
    })();

    // Gabungkan → tapi hindari duplikat ID
    const all = [...fromStorage];

    const existingIds = new Set(all.map((p) => p.id));
    for (const p of fromProps) {
      if (!existingIds.has(p.id)) {
        all.push(p);
      }
    }

    return all;
  }, [polygonUnits]);

  const [drawnPolygonUnits, setDrawnPolygonUnits] =
    useState<PolyUnit[]>(initialPolyUnits);

  // useEffect(() => {
  //   if (selectedId) {
  //     const found = drawnPolygonUnits.find((b) => b.id === selectedId) ?? null;
  //     setSelectedBlock(found);
  //   }
  // }, [selectedId, drawnPolygonUnits]);

  const snapshot = () => ({
    units: JSON.parse(JSON.stringify(drawnUnits)),
    polys: JSON.parse(JSON.stringify(drawnPolygonUnits)),
  });

  const historyStack = useRef<{ units: Unit[]; polys: PolyUnit[] }[]>([]);
  const redoStack = useRef<{ units: Unit[]; polys: PolyUnit[] }[]>([]);

  const pushSnapshot = () => {
    historyStack.current.push(snapshot());
    redoStack.current = [];
    if (historyStack.current.length > 50) historyStack.current.shift();
  };

  const undo = () => {
    if (historyStack.current.length === 0) return;
    const prev = historyStack.current.pop()!;
    redoStack.current.push(snapshot());
    setDrawnUnits(prev.units);
    setDrawnPolygonUnits(prev.polys);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    historyStack.current.push(snapshot());
    setDrawnUnits(next.units);
    setDrawnPolygonUnits(next.polys);
  };

  useEffect(() => {
    // (opsional: debounce kalau khawatir terlalu sering)
    localStorage.setItem("poly-units", JSON.stringify(drawnPolygonUnits));
  }, [drawnPolygonUnits]);

  /** Screen-space → stage-space (setelah pan/zoom) */
  const getPointerOnStage = (stage: Konva.Stage) => {
    const abs = stage.getPointerPosition();
    if (!abs) return null;
    const scale = stage.scaleX(); // X=Y
    const pos = stage.position();
    return { x: (abs.x - pos.x) / scale, y: (abs.y - pos.y) / scale };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // ✅ listener dibuat SEKALI, aman

  // akan dipakai sesudah bgImage siap --------------------
  if (!bgImage) return <div>Loading …</div>;

  // Fit background once per render ------------------------
  const baseScale = Math.min(
    canvasWidth / bgImage.width,
    canvasHeight / bgImage.height
  );
  const offsetX = 0; // tidak di-center → kunci kiri-atas
  const offsetY = 0;

  /** Stage-space → koordinat gambar-asli */
  const toImageCoords = (stage: Konva.Stage) => {
    const p = getPointerOnStage(stage);
    if (!p) return null;
    return {
      x: (p.x - imageOffsetX) / baseScale,
      y: (p.y - imageOffsetY) / baseScale,
    };
  };

  // ───────────────────────────────────────────────────────
  //  ZOOM HANDLER
  // ───────────────────────────────────────────────────────

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const dir = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = dir > 0 ? oldScale / SCALE_BY : oldScale * SCALE_BY;
    if (newScale < 0.3 || newScale > 5) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale, // ← pakai stage.x(), stage.y()
      y: (pointer.y - stage.y()) / oldScale,
    };

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // ───────────────────────────────────────────────────────
  //  PAN TOGGLE
  // ───────────────────────────────────────────────────────
  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const clickedEmpty = e.target === stage;
    if (drawMode || polygonMode) {
      stage.draggable(false);
    } else if (clickedEmpty) {
      stage.draggable(true);
      setIsPanning(true);
    } else {
      stage.draggable(false);
    }
  };
  const handlePointerUp = () => {
    if (isPanning && stageRef.current) {
      stageRef.current.draggable(false);
      setIsPanning(false);
    }
  };

  // ───────────────────────────────────────────────────────
  //  RECTANGLE DRAW
  // ───────────────────────────────────────────────────────
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!drawMode) return;
    const pos = toImageCoords(e.target.getStage()!);
    if (!pos) return;
    setStartPos(pos);
    setTempRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseDownCombined = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
    handleMouseDown(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!drawMode || !startPos) return;
    const pos = toImageCoords(e.target.getStage()!);
    if (!pos) return;
    setTempRect({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
    });
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!drawMode || !startPos) {
      setTempRect(null);
      return;
    }
    const pos = toImageCoords(e.target.getStage()!);
    if (!pos) return;

    pushSnapshot();

    const newUnit: Unit = {
      id: `NEW_${Date.now()}`,
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
      detailImage: "",
    };

    console.log("newUnit: ", newUnit);
    setDrawnUnits((prev) => [...prev, newUnit]);
    setStartPos(null);
    setTempRect(null);
  };

  // ───────────────────────────────────────────────────────
  //  POLYGON DRAW
  // ───────────────────────────────────────────────────────
  const isNearFirst = (x: number, y: number) => {
    if (currentPolyPoints.length < 2) return false;
    const [fx, fy] = currentPolyPoints;
    return Math.hypot(x - fx, y - fy) < TOLERANCE;
  };

  const makeDummyLots = (blockCode: string, count = 4): LotDetail[] =>
    Array.from({ length: count }, (_, i) => {
      const idx = (i + 1).toString().padStart(2, "0"); // 01, 02, …
      return {
        id: `${blockCode}-${idx}`,
        code: `${blockCode}${idx}`,
        type: i % 2 === 0 ? "Standard" : "Hook",
        price: 650_000_000 + i * 50_000_000, // sekadar contoh
        size: i % 2 === 0 ? 90 : 120,
      };
    });

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (!polygonMode) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = toImageCoords(stage);
    if (!pos) return;

    const { x, y } = pos;

    // 🔹 Saat polygon selesai digambar
    if (currentPolyPoints.length >= 6 && isNearFirst(x, y)) {
      const points = [...currentPolyPoints];
      const bbox = getBBox(points);

      pushSnapshot();

      setPolygons((prev) => [
        ...prev,
        {
          id: `poly-${Date.now()}`,
          type: "polygon",
          fill: "#22c55e",
          points,
        },
      ]);

      historyStack.current.push(snapshot());
      redoStack.current = [];
      if (historyStack.current.length > 50) historyStack.current.shift();

      setDrawnPolygonUnits((prev) => {
        const newId = `P${prev.length + 1}`; // mis. P1, P2, …
        return [
          ...prev,
          {
            id: newId,
            points,
            bbox,
            detailImage: "/images/masterplan_2.jpg",
            status: "available", // contoh status
            lots: makeDummyLots(newId, 6), // ⬅️  6 kavling dummy
          },
        ];
      });

      console.log("Polygon saved:", {
        id: `P${drawnPolygonUnits.length + 1}`,
        points,
        bbox,
      });

      // 🔻 Reset titik & cursor
      setCurrentPolyPoints([]);
      stage.container().style.cursor = "default";

      // 🔻 (opsional) matikan mode gambar polygon jika ada props-nya
      if (onPolygonFinish) onPolygonFinish();

      return;
    }

    // 🔹 Masih menggambar → tambah titik & ubah cursor
    setCurrentPolyPoints((pts) => [...pts, x, y]);
    stage.container().style.cursor = "crosshair";
  };

  const getBBox = (pts: number[]) => {
    const xs = pts.filter((_, i) => i % 2 === 0);
    const ys = pts.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  const handleStageBackgroundClick = (e: KonvaEventObject<MouseEvent>) => {
    // jika target persis Stage → kosong
    if (e.target === e.target.getStage()) {
      setSelectedId(null); // hapus highlight
    }
  };

  const imageOffsetX = (canvasWidth - bgImage.width * baseScale) / 2;
  const imageOffsetY = (canvasHeight - bgImage.height * baseScale) / 2;

  console.log(selectedBlock, "selectedBlock in canvas");
  console.log(selectedRect, "selectedRect in canvas");

  return (
    <>
      <div className="flex justify-between items-center gap-4 text-white">
        <Card className="w-full bg-lime-500">
          <CardHeader>
            <CardTitle>Total Unit Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">54</p>
          </CardContent>
        </Card>
        <Card className="w-full bg-yellow-400">
          <CardHeader>
            <CardTitle>Total Unit Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">54</p>
          </CardContent>
        </Card>
        <Card className="w-full bg-[#FC8684]">
          <CardHeader>
            <CardTitle>Total Unit Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">54</p>
          </CardContent>
        </Card>
      </div>

      <Stage
        width={canvasWidth}
        height={canvasHeight}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        draggable={isPanning}
        onMouseDown={handleMouseDownCombined}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
        ref={stageRef}
        className="border mt-4"
      >
        <Layer>
          {/* GROUP DENGAN SKALA GLOBAL */}
          <Group
            scale={{ x: baseScale, y: baseScale }}
            x={imageOffsetX}
            y={imageOffsetY}
            listening={true}
          >
            {/* Background */}
            <KonvaImage
              image={bgImage}
              width={bgImage.width}
              height={bgImage.height}
              listening={false}
            />

            {/* Dummy units (data asli) */}
            {units.map((u) => (
              <Rect
                key={u.id}
                x={u.x}
                y={u.y}
                width={u.width}
                height={u.height}
                fill={
                  u.status === "sold"
                    ? "rgba(252, 133, 131, 0.8)"
                    : "rgba(0, 255, 0, 0.35)"
                }
                stroke="yellow"
                strokeWidth={2}
                onClick={() => {
                  setSelectedShape({ type: "rect", data: u });
                  if (u.status !== "sold") {
                    setOpen(true);
                  }
                }}
                onTouchStart={() => {
                  setSelectedShape({ type: "rect", data: u });
                  if (u.status !== "sold") setOpen(true);
                }}
                onMouseEnter={(e) => {
                  if (u.status !== "available") return; // hanya aktif jika available
                  const node = e.target as Konva.Line;
                  node.fill("rgba(0, 255, 0, 0.7)");
                  const container = node.getStage()?.container();
                  if (container) container.style.cursor = "pointer";
                  node.getLayer()?.batchDraw();
                }}
                onMouseLeave={(e) => {
                  if (u.status !== "available") return;
                  const node = e.target as Konva.Line;
                  node.fill("rgba(0, 255, 0, 0.35)");
                  const container = node.getStage()?.container();
                  if (container) container.style.cursor = "default";
                  node.getLayer()?.batchDraw();
                }}
              />
            ))}

            {/* Rectangle hasil draw */}
            {drawnUnits.map((u) => (
              <Rect
                key={u.id}
                x={u.x}
                y={u.y}
                width={u.width}
                height={u.height}
                fill="rgba(59,130,246,0.25)"
                stroke="dodgerblue"
                strokeWidth={2}
              />
            ))}

            {/* Polygon hasil draw */}
            {drawnPolygonUnits.map((p) => (
              <Line
                key={p.id}
                points={p.points}
                fill={
                  p.status === "available"
                    ? "rgba(0, 255, 0, 0.35)"
                    : "transparent"
                }
                closed
                onClick={() => {
                  setSelectedId(p.id);
                  setSelectedShape({ type: "poly", data: p });
                  setOpen(true);
                }}
                onTouchStart={() => {
                  setSelectedId(p.id);
                  setSelectedShape({ type: "poly", data: p });
                  setOpen(true);
                }}
                stroke={selectedId === p.id ? "#43ff64d9" : "transparent"}
                strokeWidth={2}
                draggable
                onDragStart={() => {
                  pushSnapshot();
                }}
                onDragEnd={(e) => {
                  const node = e.target as Konva.Line;
                  const dx = node.x();
                  const dy = node.y();

                  // Geser semua titik polygon
                  const newPoints = p.points.map((val, idx) =>
                    idx % 2 === 0 ? val + dx : val + dy
                  );

                  // Reset posisi node karena kita sudah update data
                  node.position({ x: 0, y: 0 });

                  const updated = drawnPolygonUnits.map((unit) =>
                    unit.id === p.id
                      ? {
                          ...unit,
                          points: newPoints,
                          bbox: getBBox(newPoints),
                        }
                      : unit
                  );
                  setDrawnPolygonUnits(updated);
                }}
                onMouseEnter={(e) => {
                  const node = e.target as Konva.Line;
                  node.fill("rgba(0, 255, 0, 0.7)"); // nyalakan
                  const container = node.getStage()?.container();
                  if (container) container.style.cursor = "pointer";
                  node.getLayer()?.batchDraw();
                }}
                onMouseLeave={(e) => {
                  const node = e.target as Konva.Line;
                  node.fill("rgba(0, 255, 0, 0.35)");
                  const container = node.getStage()?.container();
                  if (container) container.style.cursor = "default";
                  node.getLayer()?.batchDraw();
                }}
              />
            ))}

            {/* Preview rectangle */}
            {drawMode && tempRect && (
              <Rect
                x={tempRect.x}
                y={tempRect.y}
                width={tempRect.width}
                height={tempRect.height}
                fill="rgba(0,200,0,0.25)"
                stroke="lime"
                strokeWidth={1}
                listening={false}
              />
            )}

            {/* Preview polygon */}
            {polygonMode && currentPolyPoints.length >= 2 && (
              <>
                <Line
                  points={currentPolyPoints}
                  stroke="#6b7280"
                  dash={[10, 5]}
                  listening={false}
                />
                {currentPolyPoints.map((val, idx) =>
                  idx % 2 === 0 ? (
                    <Circle
                      key={idx}
                      x={val}
                      y={currentPolyPoints[idx + 1]}
                      radius={4}
                      fill="#ef4444"
                      listening={false}
                    />
                  ) : null
                )}
              </>
            )}
          </Group>

          {/* Detail pop-up pakai pixel layar → kalikan scale & offset */}
          {selectedDetail && (
            <DetailImage
              src={selectedDetail.src}
              x={selectedDetail.x * baseScale + offsetX}
              y={selectedDetail.y * baseScale + offsetY}
              onClose={() => setSelectedDetail(null)}
            />
          )}
        </Layer>
      </Stage>

      {selectedShape && (
        <BlockDetail
          open={open}
          setOpen={(v) => {
            setOpen(v);
            if (!v) setSelectedShape(null);
          }}
          selected={selectedShape}
          units={units}
          polygonUnits={polygonUnits}
        />
      )}
    </>
  );
};

export default SiteplanCanvas;
