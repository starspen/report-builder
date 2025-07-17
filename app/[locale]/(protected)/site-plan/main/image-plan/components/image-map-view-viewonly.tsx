"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import StretchableShape from "@/app/[locale]/(site-plan)/site-plan-editor/component/image-renderer";
import {
  PolygonShape,
  RectShape,
  CircleShape,
  ImageShape,
  EllipseShape,
} from "@/app/[locale]/(site-plan)/site-plan-editor/component/toolbar";
import { Shape } from "@/app/[locale]/(site-plan)/site-plan-editor/component/right-sidebar";
import Konva from "konva";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface ViewOnlyCanvasProps {
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
  menuItems: { id: string; title: string }[];
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
}

const ViewOnlyCanvas: React.FC<ViewOnlyCanvasProps> = ({
  shapes,
  onShapeClick,
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
      return;
    }
    if (shape.lotId) {
      router.push("/en/site-plan/form");
    }
  };

  const contextMenuRef = useRef<HTMLDivElement>(null);

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
          x: pointer?.x || 0,
          y: pointer?.y || 0,
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

  return (
    <div ref={containerRef} className="relative w-full h-[550px] z-0">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        className="border border-gray-300 rounded"
        draggable
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onDragEnd={(e) => setPosition(e.target.position())}
      >
        <Layer>
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
                  lotId={s.lotId}
                  status={s.status}
                  onMouseEnter={() => {
                    setHoveredShapeId(s.id);
                    const container = stageRef.current?.container();
                    if (container) container.style.cursor = "pointer";
                  }}
                  onMouseLeave={() => {
                    setHoveredShapeId(null);
                    const container = stageRef.current?.container();
                    if (container) container.style.cursor = "default";
                  }}
                  onClick={(e) => {
                    if (e.evt instanceof MouseEvent && e.evt.button === 2) {
                      return; // Ignore right click
                    }
                    handleShapeClick(s);
                  }}
                  onContextMenu={(e) => {
                    e.evt.preventDefault();

                    const stage = e.target.getStage();
                    if (!stage) return;

                    const pointer = stage.getPointerPosition();
                    const container = stage.container();
                    const rect = container?.getBoundingClientRect();

                    if (pointer && rect) {
                      setContextMenu({
                        visible: true,
                        x: e.evt.clientX,
                        y: e.evt.clientY,
                        shape: { ...s },
                      });
                    }
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
                  onChange={() => {}}
                  mode="viewOnly"
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    if ("lotId" in shape && shape.lotId) {
                      const pointer = stageRef.current.getPointerPosition();
                      setContextMenu({
                        visible: true,
                        x: pointer?.x || 0,
                        y: pointer?.y || 0,
                        shape,
                      });
                    }
                  }}
                />
              );
            }

            return null;
          })}
        </Layer>
      </Stage>

      {contextMenu.visible && contextMenu.shape && (
        <div
          ref={contextMenuRef}
          className={`${
            contextMenu.shape.type === "polygon" ? "fixed" : "absolute"
          } bg-white shadow-md border rounded z-50`}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
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
                  router.push("/en/site-plan/view-spec")
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
                    className="absolute left-full top-0 ml-2 bg-white border rounded shadow-md z-50 w-auto"
                    style={{ minWidth: "200px" }}
                  >
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        alert("Sales/Reserve History clicked");
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);
                      }}
                    >
                      Sales/Reserve History
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        alert("A/c Summary clicked");
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);
                      }}
                    >
                      A/c Summary
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      onClick={() => {
                        alert("Schedule Billing clicked");
                        setContextMenu({ ...contextMenu, visible: false });
                        setShowSubMenu(false);
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
                  router.push("/en/site-plan/view-spec")
                }}
              >
                Lot Specification
              </p>
              <p
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => {
                  window.location.href = `/en/site-plan/form`;
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
