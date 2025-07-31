"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Label,
  Text as KonvaText,
  Tag as Tags,
} from "react-konva";
import StretchableShape from "@/app/[locale]/(site-plan)/site-plan-editor/component/image-renderer";
import {
  PolygonShape,
  RectShape,
  CircleShape,
  ImageShape,
  EllipseShape,
} from "@/app/[locale]/(protected)/site-plan/main/image-plan/components/shape-types";
import { Shape } from "@/app/[locale]/(site-plan)/site-plan-editor/component/right-sidebar";
import Konva from "konva";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { backIn } from "framer-motion";

interface ViewOnlyCanvasProps {
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
  menuItems: { id: string; title: string }[];
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
  mode:
    | "default"
    | "drawPolygon"
    | "drawRect"
    | "drawCircle"
    | "viewOnly"
    | "drawEllipse";
}

const ViewOnlyCanvas: React.FC<ViewOnlyCanvasProps> = ({
  shapes,
  onShapeClick,
  activeArtboardId,
  setActiveArtboardId,
  mode,
}) => {
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 550 });
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    shape?: Shape;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const [submenuLeft, setSubmenuLeft] = useState<"100%" | "-100%">("100%");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = scale;

    const pointer = stageRef.current.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const centerShapes = () => {
    const stage = stageRef.current;
    if (!stage || shapes.length === 0) return;

    const group = new Konva.Group();
    shapes.forEach((shape) => {
      const dummy = new Konva.Rect({
        x: shape.x || 0,
        y: shape.y || 0,
        width: "width" in shape ? shape.width || 0 : 10,
        height: "height" in shape ? shape.height || 0 : 10,
      });
      group.add(dummy);
    });

    const box = group.getClientRect();
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const centerX = stageWidth / 2 - (box.x + box.width / 2) * scale;
    const centerY = stageHeight / 2 - (box.y + box.height / 2) * scale;

    setPosition({ x: centerX, y: centerY });
  };

  const router = useRouter();

  const handleShapeClick = (shape: Shape) => {
    if (shape.status === "B") {
      if (shape.lotId && shape.entity_cd && shape.project_no) {
        const query = new URLSearchParams({
          lot_no: shape.lotId,
          entity_cd: shape.entity_cd,
          project_no: shape.project_no,
        }).toString();

        router.push(`/en/site-plan/view-spec?${query}`);
      } else {
        console.warn("Shape missing lotId, entity_cd, or project_no", shape);
      }
    } else if (shape.lotId && shape.entity_cd && shape.project_no) {
      const query = new URLSearchParams({
        lot_no: shape.lotId,
        entity_cd: shape.entity_cd,
        project_no: shape.project_no,
      }).toString();

      router.push(`/en/site-plan/form?${query}`);
    } else {
      console.warn("Shape missing lotId, entity_cd, or project_no", shape);
    }
  };

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const openContextMenu = (
    e: any,
    shape: Shape,
    override?: { clientX: number; clientY: number }
  ) => {
    if (!shape.lot_no) {
      return;
    }
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    if (!rect) return;

    e.evt.preventDefault();

    const clientX = override?.clientX ?? e.evt.clientX;
    const clientY = override?.clientY ?? e.evt.clientY;

    const estimatedMenuWidth = 220;
    const estimatedMenuHeight = 150;
    const padding = 8;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    if (x + estimatedMenuWidth > rect.width) {
      x = rect.width - estimatedMenuWidth - padding;
    }

    if (y + estimatedMenuHeight > rect.height) {
      y = rect.height - estimatedMenuHeight - padding;
    }

    setContextMenu({
      visible: true,
      x,
      y,
      shape: { ...shape },
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      centerShapes();
    }, 100);
    return () => clearTimeout(timeout);
  }, [shapes, scale]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleStageContextMenu = (e: any) => {
      e.evt.preventDefault();
      const shape = e.target;
      const attrs = shape?.attrs;

      if (attrs?.lotId) {
        const pointer = stage.getPointerPosition();
        setContextMenu({
          visible: true,
          x: Number(pointer?.x) ?? 0,
          y: Number(pointer?.y) ?? 0,

          shape: attrs as Shape,
        });
      }
    };

    stage.on("contextmenu", handleStageContextMenu);
    return () => {
      stage.off("contextmenu", handleStageContextMenu);
    };
  }, []);

  useEffect(() => {
    const preventDefaultMenu = (e: MouseEvent) => {
      if (contextMenu.visible) e.preventDefault();
    };
    document.addEventListener("contextmenu", preventDefaultMenu);
    return () =>
      document.removeEventListener("contextmenu", preventDefaultMenu);
  }, [contextMenu.visible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Jika contextMenu atau submenu terbuka
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setShowSubMenu(false);
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (!showSubMenu || !submenuRef.current || !containerRef.current) return;

    const submenuWidth = submenuRef.current.offsetWidth || 200;
    const containerRect = containerRef.current.getBoundingClientRect();
    const submenuX = contextMenu.x + 200 + submenuWidth; // 200 = lebar menu utama

    if (submenuX > containerRect.width) {
      setSubmenuLeft("-100%"); // tampil ke kiri
    } else {
      setSubmenuLeft("100%"); // tampil normal ke kanan
    }
  }, [showSubMenu, contextMenu.x]);

  const holdTimeoutRef = useRef<any>(null);
  const isHoldingRef = useRef(false);

  return (
    <div ref={containerRef} className="relative w-full h-[550px] z-0">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        className="border border-gray-300 rounded"
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onDragEnd={(e) => setPosition(e.target.position())}
      >
        <Layer style={{ borderRadius: "12px" }}>
          {shapes.map((shape) => {
            if (shape.type === "polygon") {
              const s = shape as PolygonShape;
              return (
                <Line
                  key={s.id}
                  x={s.x}
                  y={s.y}
                  points={s.points}
                  fill={s.fill}
                  closed
                  draggable={false}
                  opacity={hoveredShapeId === s.id ? 0.8 : 0.5}
                  status={s.status}
                  onMouseEnter={() => {
                    setHoveredShapeId(s.id);
                    const container = stageRef.current?.container();
                    if (container) container.style.cursor = "pointer";

                    const stage = stageRef.current;
                    if (!stage) return;
                    const pos = stage.getPointerPosition();
                    if (!pos) return;

                    if (s.lot_no) {
                      // ✅ hanya kalau ada lot_no
                      setTooltip({
                        x: pos.x + 10,
                        y: pos.y + 10,
                        text: `Lot No: ${s.lot_no}`,
                      });
                    } else {
                      setTooltip(null); // ✅ kalau tidak ada lot_no, tooltip dihapus
                    }
                  }}
                  // ✅ Tooltip ikut bergerak bersama cursor
                  onMouseMove={() => {
                    const stage = stageRef.current;
                    if (!stage) return;
                    const pos = stage.getPointerPosition();
                    if (!pos) return;

                    setTooltip((prev) =>
                      prev ? { ...prev, x: pos.x + 10, y: pos.y + 10 } : null
                    );
                  }}
                  // ✅ Tooltip hilang saat mouse keluar
                  onMouseLeave={() => {
                    setHoveredShapeId(null);
                    const container = stageRef.current?.container();
                    if (container) container.style.cursor = "default";
                    setTooltip(null);
                  }}
                  stroke="#333"
                  strokeWidth={1}
                  onClick={(e) => {
                    if (e.evt instanceof MouseEvent && e.evt.button === 2) {
                      return; // Ignore right click
                    }
                    if (shape.linkToArtboard) {
                      setActiveArtboardId(shape.linkToArtboard);
                    }
                    handleShapeClick(s);
                  }}
                  onTap={() => {
                    if (isHoldingRef.current) return;
                    if (shape.linkToArtboard) {
                      setActiveArtboardId(shape.linkToArtboard);
                    }
                    handleShapeClick(s);
                  }}
                  // onSelect={() => {
                  //   if (shape.linkToArtboard) {
                  //     setActiveArtboardId(shape.linkToArtboard);
                  //   }
                  // }}
                  onContextMenu={(e) => openContextMenu(e, s)}
                  onTouchStart={(e) => {
                    const touch = e.evt.touches?.[0];
                    if (!touch) return;

                    const clientX = touch.clientX;
                    const clientY = touch.clientY;

                    isHoldingRef.current = false;

                    holdTimeoutRef.current = setTimeout(() => {
                      isHoldingRef.current = true;
                      openContextMenu(e, s, { clientX, clientY }); // ✅ Param ke-2 adalah `s`
                    }, 600);
                  }}
                  onTouchEnd={() => {
                    clearTimeout(holdTimeoutRef.current);

                    setTimeout(() => {
                      isHoldingRef.current = false;
                    }, 50);
                  }}
                />
              );
            }

            if (shape.type === "group") return null;

            if (
              shape.type === "rect" ||
              shape.type === "circle" ||
              shape.type === "image" ||
              shape.type === "ellipse"
            ) {
              return (
                <StretchableShape
                  key={shape.id}
                  shape={
                    shape as RectShape | CircleShape | ImageShape | EllipseShape
                  }
                  isSelected={false}
                  onSelect={() => onShapeClick?.(shape)}
                  onClick={(e) => {
                    if (e.evt instanceof MouseEvent && e.evt.button === 2) {
                      return; // Ignore right click
                    }

                    handleShapeClick(shape);
                  }}
                  onTap={() => {
                    handleShapeClick(shape); // ✅ treat tap like click
                  }}
                  onChange={() => {}}
                  mode="viewOnly"
                  onContextMenu={(e, coords) =>
                    openContextMenu(e, shape, coords)
                  }
                  isLocked={!!shape.locked}
                  showTooltip={true}
                  getTooltipContent={(s) =>
                    s.lot_no ? `Lot No: ${s.lot_no}` : null
                  }
                  containerWidth={300} // ✅ ukuran div container
                  containerHeight={300}
                  backgroundColor="#f0f0f0" // ✅ warna background
                />
              );
            }

            return null;
          })}
          {tooltip && (
            <Label x={tooltip.x} y={tooltip.y}>
              <Tags fill="black" opacity={0.75} cornerRadius={4} />
              <KonvaText
                text={tooltip.text}
                fill="white"
                fontSize={12}
                padding={5}
              />
            </Label>
          )}
        </Layer>
      </Stage>

      {contextMenu.visible && contextMenu.shape && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white shadow-md border rounded z-50"
          style={{
            top: Number.isFinite(contextMenu.y) ? contextMenu.y : 0,
            left: Number.isFinite(contextMenu.x) ? contextMenu.x : 0,
            padding: "0.5rem",
          }}
        >
          {"status" in contextMenu.shape && contextMenu.shape.status === "B" ? (
            <>
              <p
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-auto"
                onClick={() => {
                  setContextMenu({ ...contextMenu, visible: false });
                  setShowSubMenu(false);
                  const shape = contextMenu.shape;

                  // Pastikan semua parameter tersedia
                  if (shape?.lot_no && shape?.entity_cd && shape?.project_no) {
                    const query = new URLSearchParams({
                      lot_no: shape.lot_no,
                      entity_cd: shape.entity_cd,
                      project_no: shape.project_no,
                    }).toString();

                    router.push(`/en/site-plan/view-spec?${query}`);
                  } else {
                    console.warn("Shape missing required fields", shape);
                  }
                }}
              >
                Lot Specification
              </p>

              <div className="relative">
                {/* <p
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => setShowSubMenu(!showSubMenu)}
                >
                  Sales/Reservation
                </p> */}

                <p
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex justify-between items-center gap-2 w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubMenu((prev) => !prev);
                  }}
                >
                  Sales/Reservation <ChevronRight className="w-5 h-5" />
                </p>

                {showSubMenu && (
                  <div
                    ref={submenuRef}
                    className="absolute top-0 bg-white border rounded shadow-md z-50 w-auto"
                    style={{
                      minWidth: "200px",
                      left: submenuLeft,
                      marginLeft: "0.5rem",
                    }}
                  >
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);

                        const shape = contextMenu.shape;

                        // Pastikan semua parameter tersedia
                        if (
                          shape?.lot_no &&
                          shape?.entity_cd &&
                          shape?.project_no
                        ) {
                          const query = new URLSearchParams({
                            lot_no: shape.lot_no ?? shape.lotId,
                            entity_cd: shape.entity_cd,
                            project_no: shape.project_no,
                          }).toString();

                          router.push(
                            `/en/site-plan/sales-reserve-history?${query}`
                          );
                        } else {
                          console.warn("Shape missing required fields", shape);
                        }
                      }}
                    >
                      Sales/Reserve History
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);
                        const shape = contextMenu.shape;

                        // Pastikan semua parameter tersedia
                        if (
                          shape?.lot_no &&
                          shape?.entity_cd &&
                          shape?.project_no
                        ) {
                          const query = new URLSearchParams({
                            lot_no: shape.lot_no ?? shape.lotId,
                            entity_cd: shape.entity_cd,
                            project_no: shape.project_no,
                          }).toString();

                          router.push(`/en/site-plan/ac-summary?${query}`);
                        } else {
                          console.warn("Shape missing required fields", shape);
                        }
                      }}
                    >
                      A/c Summary
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);

                        const shape = contextMenu.shape;

                        // Pastikan semua parameter tersedia
                        if (
                          shape?.lot_no &&
                          shape?.entity_cd &&
                          shape?.project_no
                        ) {
                          const query = new URLSearchParams({
                            lot_no: shape.lot_no ?? shape.lotId,
                            entity_cd: shape.entity_cd,
                            project_no: shape.project_no,
                          }).toString();

                          router.push(
                            `/en/site-plan/schedule-billing?${query}`
                          );
                        } else {
                          console.warn("Shape missing required fields", shape);
                        }
                      }}
                    >
                      Schedule Billing
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => {
                  setContextMenu({ ...contextMenu, visible: false });

                  const shape = contextMenu.shape;

                  // Pastikan semua parameter tersedia
                  if (shape?.lot_no && shape?.entity_cd && shape?.project_no) {
                    const query = new URLSearchParams({
                      lot_no: shape.lot_no,
                      entity_cd: shape.entity_cd,
                      project_no: shape.project_no,
                    }).toString();

                    router.push(`/en/site-plan/view-spec?${query}`);
                  } else {
                    console.warn("Shape missing required fields", shape);
                  }
                }}
              >
                Lot Specification
              </p>
              <p
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => {
                  setContextMenu({ ...contextMenu, visible: false });

                  const shape = contextMenu.shape;

                  // Pastikan semua parameter tersedia
                  if (shape?.lot_no && shape?.entity_cd && shape?.project_no) {
                    const query = new URLSearchParams({
                      lot_no: shape.lot_no,
                      entity_cd: shape.entity_cd,
                      project_no: shape.project_no,
                    }).toString();

                    router.push(`/en/site-plan/form?${query}`);
                  } else {
                    console.warn("Shape missing required fields", shape);
                  }
                }}
              >
                Go to Booking Form
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewOnlyCanvas;
