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
import {
  AcSummary,
  PolyUnit,
  ScheduleBilling,
  Unit,
  UnitSalesData,
  UnitsDetail,
} from "../../../interface/unit";
import { useDrawingCanvas } from "./useDrawingCanvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { acSummaryData, scheduleData, unitData, unitSalesData } from "../data";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentTable from "@/app/[locale]/(protected)/master-data/user/content-table";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

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
    // toast.success("Berhasil booking unit!", {
    //   description: "Silakan cek status pemesanan di dashboard.",
    //   className: "bg-blue-500 text-white", // tambahkan background dan warna teks
    // });
    setOpen(false);
    router.push("form");
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

  const getMatchedSalesUnit = (
    selectedUnit: Unit | null
  ): UnitSalesData | null => {
    if (!selectedUnit) return null;
    return unitSalesData.find((sale) => sale.id === selectedUnit.id) || null;
  };

  const matchedSalesUnit = getMatchedSalesUnit(selectedUnit);

  const getMatchedAcSummary = (selectedUnit: Unit | null): AcSummary | null => {
    if (!selectedUnit) return null;
    return acSummaryData.find((x) => x.unitId === selectedUnit.id) || null;
  };

  const matchedAcSummary = getMatchedAcSummary(selectedUnit);

  const [scheduleBillingData, setScheduleBillingData] =
    useState<ScheduleBilling[]>(scheduleData);
  const [filteredData, setFilteredData] = useState<ScheduleBilling[]>([]);

  useEffect(() => {
    if (selectedUnit?.id) {
      const match = scheduleBillingData.filter(
        (x) => x.unitId === selectedUnit?.id
      );
      console.log("match:", match);
      setFilteredData(match);
    } else {
      setFilteredData([]);
    }
  }, [scheduleBillingData, selectedUnit]);

  return (
    <>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* <DialogContent className="w-[90%] max-w-full sm:max-w-[90%] max-h-[85vh] overflow-y-auto"> */}
          <DialogContent size="5xl">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="mr-4">
                Detail {isPoly ? "Block" : "Unit"} {data.id}
              </DialogTitle>
              <div className="flex gap-2">
                {/* <Button onClick={handleLogCoordinates}>Log Koordinat</Button>
              <Button
                onClick={() => setTool(tool === "rect" ? null : "rect")}
                className={`px-3 py-1 text-sm rounded ${
                  tool === "rect" ? "bg-blue-600 text-white" : "bg-blue-600"
                }`}
              >
                Rectangle
              </Button>
              <Button
                onClick={() => setTool(tool === "poly" ? null : "poly")}
                className={`px-3 py-1 text-sm rounded ${
                  tool === "poly" ? "bg-blue-600 text-white" : "bg-blue-600"
                }`}
              >
                Polygon
              </Button> */}
                <Button
                  className="bg-blue-500 text-white mt-4 hover:cursor-pointer"
                  onClick={handleBookClick}
                  disabled={
                    !selectedUnit || selectedUnit.status !== "available"
                  }
                >
                  Book
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div
                ref={wrapperRef}
                className="w-full max-w-full overflow-hidden"
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
                                ? r.status === "available"
                                  ? "rgba(0, 255, 0, 0.7)" // Unit dipilih dan tersedia = hijau terang
                                  : "rgba(255, 0, 0, 0.5)" // Unit dipilih tapi sudah sold = merah solid
                                : r.status === "available"
                                ? "rgba(0, 255, 0, 0.35)" // Unit tersedia = hijau muda
                                : "rgba(252, 133, 131, 0.3)" // Unit tidak tersedia = merah muda
                            }
                            stroke="dodgerblue"
                            strokeWidth={2}
                            onClick={() => handleSelectUnit(r.id)}
                            onTouchStart={() => handleSelectUnit(r.id)}
                            onMouseEnter={(e) => {
                              const node = e.target as Konva.Rect;
                              const container = node.getStage()?.container();

                              if (container) container.style.cursor = "pointer";

                              const isSelected = selectedUnit?.id === r.id;

                              // Jika unit sedang dipilih
                              if (isSelected) {
                                if (r.status === "available") {
                                  node.fill("rgba(0, 255, 0, 0.7)"); // hijau tebal
                                } else if (r.status === "sold") {
                                  node.fill("rgba(255, 0, 0, 0.5)"); // merah solid
                                }
                              }
                              // Jika tidak sedang dipilih tapi available, kasih efek hover hijau
                              else if (r.status === "available") {
                                node.fill("rgba(0, 255, 0, 0.55)"); // hijau hover
                              }
                              // Jika tidak dipilih dan status sold
                              else if (r.status === "sold") {
                                node.fill("rgba(252, 133, 131, 0.8)"); // merah muda hover
                              }

                              node.getLayer()?.batchDraw();
                            }}
                            onMouseLeave={(e) => {
                              const node = e.target as Konva.Rect;
                              const container = node.getStage()?.container();

                              if (container) container.style.cursor = "default";

                              const isSelected = selectedUnit?.id === r.id;

                              if (isSelected) {
                                if (r.status === "sold") {
                                  node.fill("rgba(255, 0, 0, 0.5)");
                                } else {
                                  node.fill("rgba(0, 255, 0, 0.7)");
                                }
                              } else if (r.status === "available") {
                                node.fill("rgba(0, 255, 0, 0.35)");
                              } else if (r.status === "sold") {
                                node.fill("rgba(252, 133, 131, 0.3)");
                              }

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
            {selectedUnit && (
              <>
                {selectedUnit.status === "sold" ? (
                  <Tabs defaultValue="lot-spec">
                    <TabsList className="flex w-full flex-col sm:flex-row sm:w-fit">
                      {" "}
                      <TabsTrigger value="lot-spec" className="w-full">
                        Lot Specification
                      </TabsTrigger>
                      <TabsTrigger value="sales-reserve" className="w-full">
                        Sales / Reservation
                      </TabsTrigger>
                      <TabsTrigger value="schedule-billing" className="w-full">
                        Schedule Billing Enquiry
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="lot-spec">
                      <div className="text-sm text-gray-600 mt-2 border-t pt-2 sm:flex gap-4 lg:w-full">
                        <img
                          src={selectedUnit.detailImage}
                          alt={selectedUnit.code}
                          className="w-full h-96 rounded border object-cover"
                        />

                        <div className="w-full sm:grid sm:grid-cols-2 gap-2">
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Property Type
                              </label>
                              <Input
                                readOnly
                                value={selectedUnit.propertyType}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Lot No
                              </label>
                              <Input readOnly value={selectedUnit.lotNo} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Description
                              </label>
                              <Input
                                readOnly
                                value={selectedUnit.description}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Address
                              </label>
                              <Input readOnly value={selectedUnit.address} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Lot Type
                              </label>
                              <Input readOnly value={selectedUnit.lotType} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Block
                              </label>
                              <Input readOnly value={selectedUnit.block} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Zone
                              </label>
                              <Input readOnly value={selectedUnit.zone} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Direction
                              </label>
                              <Input readOnly value={selectedUnit.direction} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Level
                              </label>
                              <Input readOnly value={selectedUnit.level} />
                            </div>
                          </div>

                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Area UOM
                              </label>
                              <Input readOnly value={selectedUnit.areaUOM} />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Build-up Area
                              </label>
                              <Input
                                readOnly
                                value={selectedUnit.buildUpArea}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Theme
                              </label>
                              <Input readOnly value={selectedUnit.theme} />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Class
                              </label>
                              <Input readOnly value={selectedUnit.class} />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Category
                              </label>
                              <Input readOnly value={selectedUnit.category} />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Reference No.
                              </label>
                              <Input
                                readOnly
                                value={selectedUnit.referenceNo}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col-1">
                            <div className="space-y-1 w-full">
                              <label className="text-sm font-medium">
                                Remarks
                              </label>
                              <Input readOnly value={selectedUnit.remarks} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sales-reserve">
                      <Tabs defaultValue="sales-history">
                        <TabsList>
                          <TabsTrigger value="sales-history">
                            Sales / Reserve History
                          </TabsTrigger>
                          <TabsTrigger value="ac-summary">
                            A/c Summary
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="sales-history">
                          {/* <DataTable columns={columns} data={scheduleBillingData} /> */}
                          <div className="w-full overflow-x-auto">
                            <Table className="table-auto border-collapse">
                              <TableCaption className="px-4 py-2 text-sm">
                                A list of your recent invoices.
                              </TableCaption>
                              <TableHeader className="bg-gray-100">
                                <TableRow>
                                  <TableHead className="text-left px-4 py-2">
                                    Debtor Acct
                                  </TableHead>
                                  <TableHead className="text-left px-4 py-2">
                                    Debtor Name
                                  </TableHead>
                                  <TableHead className="text-left px-4 py-2">
                                    Sales Date
                                  </TableHead>
                                  <TableHead className="text-left px-4 py-2">
                                    PPJB Date
                                  </TableHead>
                                  <TableHead className="text-left px-4 py-2">
                                    AJB Date
                                  </TableHead>
                                  <TableHead className="text-left px-4 py-2">
                                    Key Collection Date
                                  </TableHead>
                                  <TableHead className="text-right px-4 py-2">
                                    Sales Price
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {matchedSalesUnit && (
                                  <TableRow className="border-b">
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.debtorAcct}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.debtorName}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.salesDate}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.ppjbDate}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.ajbDate}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 whitespace-nowrap">
                                      {matchedSalesUnit.keyCollectionDate}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-right">
                                      {matchedSalesUnit.salesPrice}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>

                        <TabsContent value="ac-summary">
                          {matchedAcSummary && (
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                              {/* A/c Summary Section */}
                              <div className="w-full md:w-1/2 space-y-2">
                                <div className="text-md font-bold mt-2">
                                  A/c Summary {selectedUnit.id}
                                </div>

                                <div>
                                  <Label htmlFor="invoice">Invoice</Label>
                                  <Input
                                    id="invoice"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.invoice)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="interest">Interest</Label>
                                  <Input
                                    id="interest"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.interest)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="debitNote">Debit Note</Label>
                                  <Input
                                    id="debitNote"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.debitNote)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="tax">Tax</Label>
                                  <Input
                                    id="tax"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.tax)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="creditNote">
                                    Credit Note
                                  </Label>
                                  <Input
                                    id="creditNote"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.creditNote)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="receipt">Receipt</Label>
                                  <Input
                                    id="receipt"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.receipt)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="forex">Forex Gain/Loss</Label>
                                  <Input
                                    id="forex"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.forex)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="balance">Balance</Label>
                                  <Input
                                    id="balance"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.balance)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="deposit">Deposit</Label>
                                  <Input
                                    id="deposit"
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.deposit)}
                                    readOnly
                                  />
                                </div>
                              </div>

                              {/* Aging Section */}
                              <div className="w-full md:w-1/2 space-y-2">
                                <div className="text-md font-bold mt-2">
                                  Aging {selectedUnit.id}
                                </div>

                                <div>
                                  <Label>&lt;= 15 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.invoice)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>16-30 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.interest)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>31-45 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.debitNote)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>46-60 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.tax)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>61-90 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.creditNote)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>91-145 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.receipt)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>&gt; 145 Days</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.forex)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>Total Aging Amount</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.balance)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>Unallocated Amount</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.deposit)}
                                    readOnly
                                  />
                                </div>
                                <div>
                                  <Label>Balance</Label>
                                  <Input
                                    value={new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(matchedAcSummary.deposit)}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    <TabsContent value="schedule-billing" className="w-full">
                      {/* Horizontal scroll + center + max width */}
                      <div className="w-full overflow-x-auto">
                        <div className="mx-auto max-w-screen-sm">
                          {/* Batasi tinggi + vertical scroll */}
                          <div className="max-h-[50vh] overflow-y-auto">
                            <Table className="w-full table-fixed">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="px-4 py-2">
                                    Bill Date
                                  </TableHead>
                                  <TableHead className="px-4 py-2">
                                    Type
                                  </TableHead>
                                  <TableHead className="px-4 py-2">
                                    Trx.
                                  </TableHead>
                                  <TableHead className="px-4 py-2">
                                    Description
                                  </TableHead>
                                  <TableHead className="px-4 py-2">
                                    Forex
                                  </TableHead>
                                  <TableHead className="px-4 py-2 text-right">
                                    Trx. Amount
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredData.map((x) => (
                                  <TableRow key={x.id}>
                                    <TableCell className="px-4 py-2">
                                      {x.billDate}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                      {x.type}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                      {x.trx}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                      {x.description}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                      {x.forex}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-right">
                                      {x.trxAmount.toLocaleString("id-ID")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-sm text-gray-600 mt-2 border-t pt-2 sm:flex gap-4 w-full">
                    <img
                      src={selectedUnit.detailImage}
                      alt={selectedUnit.code}
                      className="h-96 rounded border object-cover"
                    />

                    <div className="w-full sm:grid sm:grid-cols-2 gap-2">
                      <div className="flex flex-col-1">
                        <div className="space-y-1 w-full">
                          <label className="text-sm font-medium">
                            Unit Code
                          </label>
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
                          <label className="text-sm font-medium">
                            Back Garden
                          </label>
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
                          <label className="text-sm font-medium">Price</label>
                          <Input readOnly value={selectedUnit.price} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default BlockDetail;
