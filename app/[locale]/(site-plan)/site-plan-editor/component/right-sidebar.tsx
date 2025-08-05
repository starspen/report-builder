"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelRight, Plus, Undo2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArtboardMenuItem } from "./art-board";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getLotData } from "@/action/getLot";
import BasicCombobox from "@/app/[locale]/(protected)/forms/combobox/basic-combobox";
import { LOT_COLOR_MAP } from "./canvas";
import { font, FontFamily } from "../paper-size";
import { formatMonthCaption } from "react-day-picker";

export interface Shape {
  fontSize?: number;
  fontFamily: string;
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  fill?: string;
  title?: string;
  linkToArtboard?: string;
  linkToShapeId?: string;
  category?: "block" | "unit";
  lotId?: string;
  status?: string;
  locked?: boolean;
  lot_img?: string;
  entity_cd?: string;
  project_no?: string;
  lot_no?: string;
}

interface RightSideBarProps {
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
  shapes: Shape[];
  allShapes: any;
  artboardShapes: { [id: string]: any[] };
  setArtboardShapes: React.Dispatch<
    React.SetStateAction<{ [id: string]: any[] }>
  >;
  updateMenuTitle: (shapeId: string, newTitle: string) => void;
  menuItems: ArtboardMenuItem[];
  selectedFont?: FontFamily[];
  setSelectedFont?: React.Dispatch<React.SetStateAction<FontFamily[]>>;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entityCode: string;
  projectCode: string;
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightSideBar: React.FC<RightSideBarProps> = ({
  setSelectedId,
  selectedId,
  activeArtboardId,
  setActiveArtboardId,
  shapes,
  allShapes,
  setArtboardShapes,
  updateMenuTitle,
  menuItems,
  rightSidebarOpen,
  setRightSidebarOpen,
  entityCode,
  projectCode,
  isLocked,
  setIsLocked,
  selectedFont,
  setSelectedFont,
}) => {
  const selectedShape = shapes?.find((s) => s.id === selectedId);
  console.log(selectedShape, "selectedShape");
  const [localTitle, setLocalTitle] = React.useState(
    selectedShape?.title || selectedShape?.type || ""
  );

  const { toggleSidebar } = useSidebar();

  const handleUpdateShape = (id: string, updates: Partial<Shape>) => {
    setArtboardShapes((prev) => {
      const nextShapes = prev[activeArtboardId].map((s) => {
        if (s.id === id) {
          return {
            ...s,
            ...updates,
          };
        }
        return s;
      });

      return {
        ...prev,
        [activeArtboardId]: nextShapes,
      };
    });
  };

  const handleLockToggle = () => {
    if (!selectedShape) return;

    // Update the shape's locked state
    const updatedShape = { ...selectedShape, locked: !selectedShape.locked };

    // Update the shape in the artboard shapes state
    setArtboardShapes((prev) => {
      const updatedShapes = prev[activeArtboardId].map((s) =>
        s.id === selectedShape.id ? updatedShape : s
      );
      return {
        ...prev,
        [activeArtboardId]: updatedShapes,
      };
    });
  };

  console.log("entityCode:", entityCode, "projectCode:", projectCode);

  // console.log(allShapes)
  // console.log(shapes)
  const { data: lotOptions, isLoading: isLoadingLots } = useQuery({
    queryKey: ["lots", entityCode, projectCode],
    queryFn: () => getLotData(entityCode, projectCode),
    enabled: !!entityCode && !!projectCode,
  });
  const usedLotsAll = Object.values(allShapes) // get arrays of shapes per artboard
    .flat() // flatten into one big Shape[]
    .filter((s: any) => s.lotId) // keep only those with a lotId
    .map((s: any) => s.lotId!) // extract the lotId string
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  console.log(usedLotsAll);
  useEffect(() => {
    console.log("lotOptions result:", lotOptions);
  }, [lotOptions]);

  useEffect(() => {
    if (selectedShape) {
      setLocalTitle(selectedShape.title || selectedShape.type || "");
    }
  }, [selectedShape]);

  return (
    <div className="relative">
      {rightSidebarOpen && (
        <Sidebar variant="sidebar" side="right" className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              {selectedShape ? (
                <form
                  className="space-y-4 p-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-2">
                    <div className="space-y-1 col-span-2 mb-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        disabled={selectedShape.locked}
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdateShape(selectedShape.id, {
                              title: localTitle, // ← simpan ke shape
                            });
                            updateMenuTitle(selectedShape.id, localTitle);
                          }
                        }}
                        onBlur={() => {
                          handleUpdateShape(selectedShape.id, {
                            title: localTitle,
                          });
                          updateMenuTitle(selectedShape.id, localTitle);
                        }}
                      />
                    </div>

                    {"x" in selectedShape && (
                      <div className="space-y-1 col-span-1 mr-2">
                        <Label htmlFor="x">X</Label>
                        <Input
                          id="x"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.x ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              x: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"y" in selectedShape && (
                      <div className="space-y-1 col-span-1">
                        <Label htmlFor="y">Y</Label>
                        <Input
                          id="y"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.y ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              y: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"width" in selectedShape && (
                      <div className="space-y-1 col-span-1 mr-2 mt-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          disabled={selectedShape.locked}
                          id="width"
                          type="number"
                          value={selectedShape.width ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              width: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"height" in selectedShape && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.height ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              height: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radius" in selectedShape && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radius">Radius</Label>
                        <Input
                          id="radius"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.radius ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              radius: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radiusX" in selectedShape && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radiusX">Radius X</Label>
                        <Input
                          id="radiusX"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.radiusX ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              radiusX: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radiusY" in selectedShape && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radiusY">Radius Y</Label>
                        <Input
                          id="radiusY"
                          disabled={selectedShape.locked}
                          type="number"
                          value={selectedShape.radiusY ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              radiusY: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {selectedShape.points && (
                      <div className="space-y-1 col-span-2">
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          disabled={selectedShape.locked}
                          type="text"
                          value={selectedShape.points.join(", ")}
                          onChange={(e) => {
                            const points = e.target.value
                              .split(",")
                              .map((val) => parseFloat(val.trim()))
                              .filter((val) => !isNaN(val));
                            handleUpdateShape(selectedShape.id, { points });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleLockToggle}
                      className="w-full mb-4"
                    >
                      {selectedShape.locked
                        ? "Unlock Position"
                        : "Lock Position"}
                    </Button>
                  </div>

                  {selectedShape?.type === "text" && (
                    <div className="space-y-1 col-span-1 mt-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="fontSize"
                          disabled={selectedShape.locked}
                          type="number"
                          className="w-full"
                          value={selectedShape.fontSize || 14}
                          onChange={(e) =>
                            handleUpdateShape(selectedShape.id, {
                              fontSize: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {selectedShape?.type === "text" && (
                    <div className="space-y-1 col-span-1 mt-2">
                      <Label>Font Family</Label>
                      <BasicCombobox
                      options={font.map((item) => ({
                        label: item.name,
                        value: item.name,
                      }))}
                      placeholder="Select Destination"
                      value={selectedShape?.fontFamily || ""}
                      onChange={(val) => {
                        if (!selectedShape) return;
                        handleUpdateShape(selectedShape.id, {
                          fontFamily: val,
                        });
                      }}
                    />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 justify-between">
                      Shape Group
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {selectedShape.category && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(selectedShape.id, {
                                  category: undefined,
                                });
                              }}
                              className="text-sm text-red-600 hover:underline"
                              variant="ghost"
                              size="sm"
                            >
                              <Undo2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Group</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <BasicCombobox
                      options={[
                        { label: "Block", value: "block" },
                        { label: "Unit", value: "unit" },
                      ]}
                      placeholder="Select Group"
                      value={selectedShape?.category || ""}
                      onChange={(val) => {
                        if (!selectedShape) return;
                        handleUpdateShape(selectedShape.id, {
                          category: val as "block" | "unit",
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkTo"
                      className="flex items-center gap-2 justify-between"
                    >
                      Link to Artboard{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {selectedShape.linkToArtboard && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(selectedShape.id, {
                                  linkToArtboard: "",
                                });
                              }}
                              className="text-sm text-red-600 hover:underline"
                              variant="ghost"
                              size="sm"
                            >
                              <Undo2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Destination</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <BasicCombobox
                      options={menuItems.map((item) => ({
                        label: item.title,
                        value: item.id,
                      }))}
                      placeholder="Select Destination"
                      value={selectedShape?.linkToArtboard || ""}
                      onChange={(val) => {
                        if (!selectedShape) return;
                        handleUpdateShape(selectedShape.id, {
                          linkToArtboard: val,
                        });
                      }}
                    />
                  </div>

                  {lotOptions && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="lot"
                        className="flex items-center gap-2 justify-between"
                      >
                        Assign Lot{" "}
                        {selectedShape.lotId && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                onClick={() => {
                                  if (!selectedShape) return;

                                  handleUpdateShape(selectedShape.id, {
                                    lotId: "",
                                    fill: LOT_COLOR_MAP.DEFAULT,
                                  });
                                }}
                                className="text-sm text-red-600 hover:underline"
                                variant="ghost"
                                size="sm"
                              >
                                <Undo2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reset Lot</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Label>
                      <BasicCombobox
                        options={[
                          // 1) All lotOptions except those in usedLotsAll (unless it's the selectedShape’s lot)
                          ...lotOptions
                            .map((lot: any) => ({
                              label: `${lot.lot_no} (${lot.status})`,
                              value: lot.lot_no,
                              status: lot.status, // tambahkan ini untuk akses cepat saat onChange
                            }))
                            .filter((opt: any) => {
                              const isUsed = usedLotsAll.includes(opt.value);
                              const isMine = opt.value === selectedShape?.lotId;
                              return !isUsed || isMine;
                            }),

                          // 2) Fallback for selectedShape.lotId if it isn’t in lotOptions
                          ...(selectedShape?.lotId &&
                          !lotOptions.some(
                            (lot: any) => lot.lot_no === selectedShape.lotId
                          )
                            ? [
                                {
                                  label: `${selectedShape.lotId} (Unknown)`,
                                  value: selectedShape.lotId,
                                  status: "Unknown",
                                },
                              ]
                            : []),
                        ]}
                        placeholder="Select Lot"
                        value={selectedShape?.lotId || ""}
                        onChange={(val) => {
                          if (!selectedShape) return;

                          // Ambil status dari lotOptions atau dari options
                          const lotInfo = lotOptions.find(
                            (lot: any) => lot.lot_no === val
                          );

                          let fill = LOT_COLOR_MAP.DEFAULT; // default abu
                          if (lotInfo?.status === "A") fill = LOT_COLOR_MAP.A;
                          else if (lotInfo?.status === "B")
                            fill = LOT_COLOR_MAP.B;

                          handleUpdateShape(selectedShape.id, {
                            lotId: val,
                            fill:
                              lotInfo?.status === "A"
                                ? LOT_COLOR_MAP.A
                                : lotInfo?.status === "B"
                                ? LOT_COLOR_MAP.B
                                : LOT_COLOR_MAP.DEFAULT,
                          });
                        }}
                      />
                    </div>
                  )}

                  {selectedShape?.lotId && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 justify-between">
                        Lot Image{" "}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {selectedShape.lot_img && (
                              <Button
                                type="button"
                                onClick={() => {
                                  handleUpdateShape(selectedShape.id, {
                                    lot_img: "",
                                  });
                                }}
                                className="text-sm text-red-600 hover:underline"
                                variant="ghost"
                                size="sm"
                              >
                                <Undo2 className="w-4 h-4" />
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset Image</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        type="file"
                        className="read-only:bg-white"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file || !selectedShape) return;

                          const reader = new FileReader();
                          reader.onload = () => {
                            const base64 = reader.result as string;

                            // Simpan lot image ke shape
                            handleUpdateShape(selectedShape.id, {
                              lot_img: base64,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {selectedShape.lot_img && (
                        <div className="mt-2">
                          <img
                            src={selectedShape.lot_img}
                            alt="Lot Preview"
                            className="max-h-40 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedShape?.fill !== undefined && selectedShape?.id && (
                    <div className="space-y-2">
                      <Label htmlFor="fillColor">Fill Color</Label>
                      <Input
                        id="fillColor"
                        type="color"
                        value={selectedShape.fill || "#000000"}
                        onChange={(e) => {
                          if (selectedShape?.id) {
                            handleUpdateShape(selectedShape.id, {
                              fill: e.target.value,
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  No shape selected.
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
      )}
    </div>
  );
};

export default RightSideBar;
