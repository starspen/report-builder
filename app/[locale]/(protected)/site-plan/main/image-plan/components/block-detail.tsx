"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useImage from "use-image";
import Konva from "konva";
import {
  Stage,
  Layer,
  Group,
  Image as KonvaImage,
  Line,
  Rect,
  Circle,
  Transformer,
} from "react-konva";
import { PolyUnit, Unit, UnitsDetail } from "../../../interface/unit";
import { useDrawingCanvas } from "./useDrawingCanvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface BlockDetailProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected:
    | { type: "poly"; data: PolyUnit }
    | { type: "rect"; data: Unit }
    | null;
  units: Unit[];
  polygonUnits: PolyUnit[];
}

const unitData: UnitsDetail[] = [
  {
    id: "3H-18",
    blockId: "LBP_3H",
    x: 416.72005453133784,
    y: 189.4447050053153,
    width: 84.60424362997242,
    height: 177.8132339454096,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-18",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-19",
    blockId: "LBP_3H",
    x: 497.79942383028447,
    y: 189.4447050053153,
    width: 86.01431887549347,
    height: 176.40197504371685,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-19",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-20",
    blockId: "LBP_3H",
    x: 583.813448287379,
    y: 187.3278941731773,
    width: 81.07911360930268,
    height: 179.22445408690174,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-20",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-21",
    blockId: "LBP_3H",
    x: 666.3025984134474,
    y: 186.62230348253146,
    width: 83.89926410034468,
    height: 180.63563546819344,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-21",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-22",
    blockId: "LBP_3H",
    x: 749.4968442554092,
    y: 186.62230348253146,
    width: 84.60420490121737,
    height: 181.34122615883925,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-22",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-23",
    blockId: "LBP_3H",
    x: 833.3960308982436,
    y: 189.4447050053153,
    width: 83.89918664283437,
    height: 175.69638435307098,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-23",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-23A",
    blockId: "LBP_3H",
    x: 917.2952175410779,
    y: 186.62230348253146,
    width: 81.0791136093028,
    height: 177.81319518520903,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-23A",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-12A",
    blockId: "LBP_3H",
    x: 998.3743311503807,
    y: 4.575447872845894,
    width: 81.78413186768569,
    height: 180.63563546819339,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-12A",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3H-12B",
    blockId: "LBP_3H",
    x: 1081.5684995348322,
    y: 4.575447872845894,
    width: 80.37409535091979,
    height: 179.930006017347,
    detailImage: "/images/masterplan_room.jpg",
    code: "H-12B",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  /////
  {
    id: "3E-21",
    blockId: "LBP_3E",
    x: 348.2759163920786,
    y: 187.86734405810813,
    width: 83.1169103129368,
    height: 178.34364721943768,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-21",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3E-22",
    blockId: "LBP_3E",
    x: 432.1093341498312,
    y: 188.5836052523856,
    width: 82.40036350823055,
    height: 177.6273860251602,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-22",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3E-23",
    blockId: "LBP_3E",
    x: 515.9427519075839,
    y: 186.43490035795688,
    width: 81.68389542330522,
    height: 179.77609091958894,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-23",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3E-23A",
    blockId: "LBP_3E",
    x: 598.3431547757049,
    y: 186.43490035795688,
    width: 83.11691031293685,
    height: 179.77609091958894,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-23A",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3E-25",
    blockId: "LBP_3E",
    x: 685.0418227576804,
    y: 186.43599126172816,
    width: 75.23517098040111,
    height: 180.49227342546268,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-25",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
  {
    id: "3E-26",
    blockId: "LBP_3E",
    x: 763.860389236982,
    y: 186.43490035795688,
    width: 81.6838954233051,
    height: 180.49231276966455,
    detailImage: "/images/masterplan_room.jpg",
    code: "E-26",
    status: "available",
    terrace: "240 sq ft",
    livingRoom: "248 sq ft",
    bath: "48 sq ft",
    hallway: "67 sq ft",
    bedroom: "103 sq ft",
    backGarden: "249 sq ft",
    garage: "233 sq ft",
    price: "750.000.000",
  },
];

const BlockDetail: React.FC<BlockDetailProps> = ({
  open,
  setOpen,
  selected,
}) => {
  if (!selected) return null;
  const isPoly = selected.type === "poly";
  const data = selected.data;
  const [img] = useImage(data.detailImage);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const [stageSize, setStageSize] = useState({ w: 800, h: 600 });
  const [viewScale, setViewScale] = useState(1);
  const [viewPos, setViewPos] = useState({ x: 0, y: 0 });

  const [drawnRects, setDrawnRects] = useState<Unit[]>([]);
  const [tempRect, setTempRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [tool, setTool] = useState<null | "rect" | "poly">(null);
  const [selectedRectId, setSelectedRectId] = useState<string | null>(null);

  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const filteredUnit = unitData.filter((u) => u.blockId === data.id);
  const [selectedUnit, setSelectedUnit] = useState<UnitsDetail | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const {
    drawnPolygonUnits,
    setDrawnPolygonUnits,
    currentPolyPoints,
    setCurrentPolyPoints,
  } = useDrawingCanvas([], []);

  const toImageCoords = (stage: Konva.Stage) => {
    const p = stage.getPointerPosition();
    if (!p || !img) return null;
    return {
      x: (p.x - viewPos.x) / viewScale,
      y: (p.y - viewPos.y) / viewScale,
    };
  };

  const handleLogCoordinates = () => {
    console.log("📦 RECTANGLES:");
    console.table(drawnRects);
    console.log("🌀 POLYGONS:");
    console.table(
      drawnPolygonUnits.map((p) => ({ id: p.id, points: p.points }))
    );
  };

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (img) {
        const ratio = img.height / img.width;
        setStageSize({ w: width, h: width * ratio });
      } else {
        setStageSize({ w: width, h: 600 });
      }
    });

    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [img]);

  useEffect(() => {
    if (!img) return;
    setViewScale(stageSize.w / img.width);
    setViewPos({
      x: 0,
      y: (stageSize.h - img.height * (stageSize.w / img.width)) / 2,
    });
  }, [img, stageSize.w, stageSize.h]);

  useEffect(() => {
    if (open) {
      setDrawnPolygonUnits([]);
      setDrawnRects([]);
      setCurrentPolyPoints([]);
      setTool(null);
    }
  }, [open]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = viewScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const dir = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = dir > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale < 0.3 || newScale > 5) return;

    const mousePointTo = {
      x: (pointer.x - viewPos.x) / oldScale,
      y: (pointer.y - viewPos.y) / oldScale,
    };

    setViewScale(newScale);
    setViewPos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!tool && e.target === e.target.getStage()) {
      setIsPanning(true);
      panStart.current = { x: e.evt.clientX, y: e.evt.clientY };
      stageRef.current?.container().style.setProperty("cursor", "grabbing");
      return;
    }

    if (tool === "rect") {
      const pos = toImageCoords(e.target.getStage()!);
      if (!pos) return;
      setStartPos(pos);
      setTempRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
    }

    if (tool === "poly") {
      const pos = toImageCoords(e.target.getStage()!);
      if (!pos) return;
      setCurrentPolyPoints((prev) => [...prev, pos.x, pos.y]);
    }
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (isPanning) {
      const dx = e.evt.clientX - panStart.current.x;
      const dy = e.evt.clientY - panStart.current.y;
      panStart.current = { x: e.evt.clientX, y: e.evt.clientY };
      setViewPos((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (tool === "rect" && startPos) {
      const pos = toImageCoords(e.target.getStage()!);
      if (!pos) return;
      setTempRect({
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
      });
    }
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      stageRef.current?.container().style.setProperty("cursor", "default");
      return;
    }

    if (tool === "rect" && tempRect) {
      setDrawnRects((prev) => [
        ...prev,
        {
          id: `R${prev.length + 1}`,
          ...tempRect,
          detailImage: data.detailImage,
        },
      ]);
      setTempRect(null);
      setStartPos(null);
      setTool(null);
    }

    if (tool === "poly" && currentPolyPoints.length >= 6) {
      setDrawnPolygonUnits((prev) => [
        ...prev,
        {
          id: `P${prev.length + 1}`,
          points: currentPolyPoints,
          bbox: { x: 0, y: 0, width: 0, height: 0 },
          detailImage: data.detailImage,
          status: "available",
        },
      ]);
      setCurrentPolyPoints([]);
      setTool(null);
    }
  };

  const handleSelectUnit = (unitId: string) => {
    const found = unitData.find((u) => u.id === unitId);
    if (found) {
      setSelectedUnit(found);
      console.log("🟢 Selected Unit:", found);
    }
  };

  const router = useRouter();

  const handleBookClick = () => {
    toast.success("Berhasil booking unit!", {
      description: "Silakan cek status pemesanan di dashboard.",
      className: "bg-blue-500 text-white", // tambahkan background dan warna teks
    });
    setOpen(false);
    router.push("/form");
  };

  useLayoutEffect(() => {
    if (!open) return;

    let frame = 0;
    function measure() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const fullWidth = wrapper.clientWidth;
      if (fullWidth === 0) {
        frame = requestAnimationFrame(measure);
        return;
      }

      const isMobile = window.innerWidth <= 768; // breakpoint tailwind sm
      const canvasWidth = isMobile ? fullWidth * 0.95 : fullWidth * 0.5; // 95% on mobile, 50% on desktop
      const ratio = img ? img.height / img.width : 3 / 4;
      const canvasHeight = canvasWidth * ratio;

      setStageSize({ w: canvasWidth, h: canvasHeight });

      if (img) {
        const scale = canvasWidth / img.width;
        setViewScale(scale);
        setViewPos({
          x: 0,
          y: (canvasHeight - img.height * scale) / 2,
        });
      }
    }

    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [open, img]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="sm:w-[2000vw] sm:max-w-full max-h-[90vh] overflow-auto bg-white md:max-w-full">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="mr-4">
              Detail {isPoly ? "Block" : "Unit"} {data.id}
            </DialogTitle>
            <div className="flex gap-2">
              {/* <Button onClick={handleLogCoordinates}>Log Koordinat</Button>
              <Button
                onClick={() => setTool(tool === "rect" ? null : "rect")}
                className={`px-3 py-1 text-sm rounded ${
                  tool === "rect" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                Rectangle
              </Button>
              <Button
                onClick={() => setTool(tool === "poly" ? null : "poly")}
                className={`px-3 py-1 text-sm rounded ${
                  tool === "poly" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                Polygon
              </Button> */}
              <Button
                className="bg-blue-500 text-white mt-4 hover:cursor-pointer"
                onClick={handleBookClick}
                disabled={!selectedUnit || selectedUnit.status !== "available"}
              >
                Book
              </Button>
            </div>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              <div
                ref={wrapperRef}
                className="w-full max-h-[75vh] overflow-auto border"
              >
                {img && (
                  <Stage
                    ref={stageRef}
                    width={stageSize.w}
                    height={stageSize.h}
                    onWheel={handleWheel}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{ cursor: isPanning ? "grab" : "default" }}
                  >
                    <Layer>
                      <Group
                        x={viewPos.x}
                        y={viewPos.y}
                        scaleX={viewScale}
                        scaleY={viewScale}
                      >
                        <KonvaImage
                          image={img}
                          width={img.width}
                          height={img.height}
                          listening={false}
                        />

                        {filteredUnit.map((r) => (
                          <Rect
                            key={r.id}
                            x={r.x}
                            y={r.y}
                            width={r.width}
                            height={r.height}
                            fill={
                              selectedUnit?.id === r.id
                                ? "rgba(0, 255, 0, 0.7)" // UNIT TERPILIH = NYALA
                                : r.status === "available"
                                ? "rgba(0, 255, 0, 0.35)" // Unit tersedia = hijau muda
                                : "rgba(128, 128, 128, 0.3)" // Unit tidak tersedia = abu transparan
                            }
                            stroke="dodgerblue"
                            strokeWidth={2}
                            onClick={() => handleSelectUnit(r.id)}
                            onTouchStart={() => handleSelectUnit(r.id)}
                            onMouseEnter={(e) => {
                              if (r.status !== "available") return;
                              const node = e.target as Konva.Rect;
                              if (selectedUnit?.id !== r.id) {
                                node.fill("rgba(0, 255, 0, 0.7)");
                                node.getLayer()?.batchDraw();
                              }
                              const container = node.getStage()?.container();
                              if (container) container.style.cursor = "pointer";
                            }}
                            onMouseLeave={(e) => {
                              if (r.status !== "available") return;
                              const node = e.target as Konva.Rect;
                              const isSelected = selectedUnit?.id === r.id;
                              node.fill(
                                isSelected
                                  ? "rgba(0, 255, 0, 0.7)"
                                  : "rgba(0, 255, 0, 0.35)"
                              );
                              const container = node.getStage()?.container();
                              if (container) container.style.cursor = "default";
                              node.getLayer()?.batchDraw();
                            }}
                          />
                        ))}

                        {tool === "rect" && tempRect && (
                          <Rect
                            {...tempRect}
                            fill="rgba(0,200,0,0.25)"
                            stroke="lime"
                            strokeWidth={1}
                            listening={false}
                          />
                        )}

                        {drawnPolygonUnits.map((p) => (
                          <Line
                            key={p.id}
                            points={p.points}
                            closed
                            fill="rgba(0,255,0,.25)"
                            stroke="green"
                            strokeWidth={2}
                          />
                        ))}

                        {tool === "poly" && currentPolyPoints.length >= 2 && (
                          <>
                            <Line
                              points={currentPolyPoints}
                              stroke="#6b7280"
                              dash={[10, 5]}
                            />
                            {currentPolyPoints.map((v, i) =>
                              i % 2 === 0 ? (
                                <Circle
                                  key={i}
                                  x={v}
                                  y={currentPolyPoints[i + 1]}
                                  radius={4}
                                  fill="#ef4444"
                                />
                              ) : null
                            )}
                          </>
                        )}
                      </Group>
                      <Transformer ref={transformerRef} />
                    </Layer>
                  </Stage>
                )}
              </div>
            </div>
          </DialogDescription>
          {selectedUnit && (
            <>
              <div className="text-sm text-gray-600 mt-2 border-t pt-2 sm:flex gap-4 w-full">
                <img
                  src={selectedUnit.detailImage}
                  alt={selectedUnit.code}
                  className="w-96 h-96 rounded border object-cover"
                />

                <div className="space-y-3 w-full sm:grid sm:grid-cols-2 gap-2">
                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Kode Unit</label>
                      <Input readOnly value={selectedUnit.code} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Status</label>
                      <Input readOnly value={selectedUnit.status} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Terrace</label>
                      <Input readOnly value={selectedUnit.terrace} />
                    </div>
                  </div>
                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">
                        Living Room / Kitchen
                      </label>
                      <Input readOnly value={selectedUnit.livingRoom} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Bath</label>
                      <Input readOnly value={selectedUnit.bath} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Hallway</label>
                      <Input readOnly value={selectedUnit.hallway} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Bedroom</label>
                      <Input readOnly value={selectedUnit.bedroom} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Back Garden</label>
                      <Input readOnly value={selectedUnit.backGarden} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Garage</label>
                      <Input readOnly value={selectedUnit.garage} />
                    </div>
                  </div>

                  <div className="flex flex-col-1">
                    <div className="space-y-1 w-full">
                      <label className="text-sm font-medium">Harga</label>
                      <Input readOnly value={selectedUnit.price} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlockDetail;
