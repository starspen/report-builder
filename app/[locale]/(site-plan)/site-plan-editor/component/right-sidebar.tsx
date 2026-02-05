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
import { getColumnData } from "@/action/get-column";
import { BasicMultiCombobox } from "@/app/[locale]/(protected)/forms/combobox/basic-multi-combobox";

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
  category?:
    | "default"
    | "header"
    | "header-repeating"
    | "footer"
    | "footer-repeating";
  lotId?: string;
  status?: string;
  locked?: boolean;
  lot_img?: string;
  entity_cd?: string;
  project_no?: string;
  lot_no?: string;
  position?: string;
  repeating?: "Y" | "N";
  repeating_per_page: "Y" | "N";
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
  tableDataDB: any[];
  companyCode: string;
  projectCode: string;
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectLabel?: (tableId: string, labelId: string) => void;
  selectedShape: any | null;
  onUpdateSelected: (patch: Partial<any>) => void;
  group: string;
  setGroup: React.Dispatch<React.SetStateAction<string>>;
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
  tableDataDB,
  projectCode,
  isLocked,
  setIsLocked,
  selectedFont,
  setSelectedFont,
  onSelectLabel,
  selectedShape: selectedShapeProp,
  onUpdateSelected,
  companyCode,
  group,
  setGroup,
}) => {
  const computedSelected =
    selectedShapeProp ?? shapes?.find((s) => s.id === selectedId) ?? null;

  const isProxy =
    !!selectedShapeProp && !shapes?.some((s) => s.id === selectedShapeProp.id);

  const applyPatch = (patch: Partial<any>) => {
    if (isProxy)
      smartUpdate(patch); // lewat onUpdateSelected -> updateLabel / updateTable
    else if (computedSelected?.id)
      handleUpdateShape(computedSelected.id, patch);
  };

  const [localTitle, setLocalTitle] = React.useState(
    computedSelected?.title || computedSelected?.type || "",
  );

  const [selectedTableName, setSelectedTableName] = useState("");
  const [selectedColName, setSelectedColName] = useState("");
  const [selectedTableCd, setSelectedTableCd] = useState("");
  const [selectedColFilter, setSelectedColFilter] = useState<string[]>([]);
  const [localTable, setLocalTable] = useState("");
  const [localColumnFilter, setLocalColumnFilter] = useState("");
  const [localTextColumn, setLocalTextColumn] = useState("");

  useEffect(() => {
    if (computedSelected) {
      setLocalTitle(computedSelected.title || computedSelected.type || "");
    }
  }, [computedSelected]);

  const handleUpdateShape = (id: string, updates: Partial<Shape>) => {
    setArtboardShapes((prev) => {
      const nextShapes = prev[activeArtboardId].map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      );
      return { ...prev, [activeArtboardId]: nextShapes };
    });
  };

  const smartUpdate = (patch: Partial<any>) => {
    if (onUpdateSelected) {
      // untuk label proxy (type: "text" hasil proxy)
      onUpdateSelected(patch);
    } else if (computedSelected?.id) {
      // untuk shape text biasa
      handleUpdateShape(computedSelected.id, patch);
    }
  };

  const handleLockToggle = () => {
    if (!computedSelected) return;

    // Update the shape's locked state
    const updatedShape = {
      ...computedSelected,
      locked: !computedSelected.locked,
    };

    // Update the shape in the artboard shapes state
    setArtboardShapes((prev) => {
      const updatedShapes = prev[activeArtboardId].map((s) =>
        s.id === computedSelected.id ? updatedShape : s,
      );
      return {
        ...prev,
        [activeArtboardId]: updatedShapes,
      };
    });
  };

  // pemanggilan useQuery
  const { data: columnDataDB = [] } = useQuery<any[]>({
    queryKey: ["columns", companyCode, selectedTableName],
    queryFn: () => getColumnData(companyCode!, selectedTableName!),
    enabled: !!companyCode && !!selectedTableName,
  });

  const { data: lotOptions, isLoading: isLoadingLots } = useQuery({
    queryKey: ["lots", companyCode, projectCode],
    queryFn: () => getLotData(companyCode, projectCode),
    enabled: !!companyCode && !!projectCode,
  });
  const usedLotsAll = Object.values(allShapes) // get arrays of shapes per artboard
    .flat() // flatten into one big Shape[]
    .filter((s: any) => s.lotId) // keep only those with a lotId
    .map((s: any) => s.lotId!) // extract the lotId string
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  useEffect(() => {}, [lotOptions]);

  useEffect(() => {
    if (computedSelected) {
      setLocalTitle(computedSelected.title || computedSelected.type || "");
    }
  }, [computedSelected]);

  useEffect(() => {
    setSelectedTableName((computedSelected as any)?.source_table_name ?? "");
    setSelectedColName((computedSelected as any)?.text_column ?? "");
    setSelectedTableCd((computedSelected as any)?.table_cd ?? "");
    setSelectedColFilter((computedSelected as any)?.column_filter ?? "");
  }, [computedSelected?.id]);

  useEffect(() => {
    if (!computedSelected?.id) return;

    setLocalTable((computedSelected as any)?.source_table_name ?? "");
    setLocalTextColumn((computedSelected as any)?.text_column ?? "");
    setLocalColumnFilter((computedSelected as any)?.column_filter ?? "");
  }, [computedSelected?.id]);

  return (
    <div className="relative">
      {rightSidebarOpen && (
        <Sidebar variant="sidebar" side="right" className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              {computedSelected ? (
                <form
                  className="space-y-4 p-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-2">
                    <div className="space-y-1 col-span-2 mb-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        disabled={computedSelected.locked}
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdateShape(computedSelected.id, {
                              title: localTitle, // ← simpan ke shape
                            });
                            applyPatch({ title: localTitle });
                            if (!isProxy)
                              updateMenuTitle(computedSelected.id, localTitle);
                          }
                        }}
                        onBlur={() => {
                          handleUpdateShape(computedSelected.id, {
                            title: localTitle,
                          });
                          applyPatch({ title: localTitle });
                          if (!isProxy)
                            updateMenuTitle(computedSelected.id, localTitle);
                        }}
                      />
                    </div>

                    <div className="col-span-2 mb-2">
                      <Label htmlFor="group">Group</Label>
                      <Input
                        id="group"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 mb-2 space-y-2">
                      <Label className="flex items-center gap-2 justify-between">
                        Group Type
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {computedSelected.category && (
                              <Button
                                type="button"
                                onClick={() => {
                                  applyPatch({ category: localTitle });
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
                          { label: "default", value: "default" },
                          { label: "header", value: "header" },
                          {
                            label: "header-repeating",
                            value: "header-repeating",
                          },
                          { label: "footer", value: "footer" },
                          {
                            label: "footer-repeating",
                            value: "footer-repeating",
                          },
                        ]}
                        placeholder="Select Group"
                        value={computedSelected?.category || ""}
                        onChange={(val) => {
                          if (!computedSelected) return;
                          handleUpdateShape(computedSelected.id, {
                            category: val as
                              | "default"
                              | "header"
                              | "header-repeating"
                              | "footer"
                              | "footer-repeating",
                          });
                        }}
                      />
                    </div>

                    {"x" in computedSelected && (
                      <div className="space-y-1 col-span-1 mr-2">
                        <Label htmlFor="x">X</Label>
                        <Input
                          id="x"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.x ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              x: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"y" in computedSelected && (
                      <div className="space-y-1 col-span-1">
                        <Label htmlFor="y">Y</Label>
                        <Input
                          id="y"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.y ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              y: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"width" in computedSelected && (
                      <div className="space-y-1 col-span-1 mr-2 mt-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          disabled={computedSelected.locked}
                          id="width"
                          type="number"
                          value={computedSelected.width ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              width: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"height" in computedSelected && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.height ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              height: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radius" in computedSelected && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radius">Radius</Label>
                        <Input
                          id="radius"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.radius ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              radius: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radiusX" in computedSelected && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radiusX">Radius X</Label>
                        <Input
                          id="radiusX"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.radiusX ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              radiusX: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {"radiusY" in computedSelected && (
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="radiusY">Radius Y</Label>
                        <Input
                          id="radiusY"
                          disabled={computedSelected.locked}
                          type="number"
                          value={computedSelected.radiusY ?? 0}
                          onChange={(e) =>
                            handleUpdateShape(computedSelected.id, {
                              radiusY: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}

                    {computedSelected.points && (
                      <div className="space-y-1 col-span-2">
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          disabled={computedSelected.locked}
                          type="text"
                          value={computedSelected.points.join(", ")}
                          onChange={(e) => {
                            const points = e.target.value
                              .split(",")
                              .map((val) => parseFloat(val.trim()))
                              .filter((val) => !isNaN(val));
                            handleUpdateShape(computedSelected.id, { points });
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
                      {computedSelected.locked
                        ? "Unlock Position"
                        : "Lock Position"}
                    </Button>
                  </div>

                  {computedSelected?.type === "text" && (
                    <>
                      <div className="space-y-1 col-span-1 mt-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Input
                          id="fontSize"
                          type="number"
                          className="w-full"
                          value={computedSelected.fontSize ?? 14}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            if (!isNaN(v)) smartUpdate({ fontSize: v });
                          }}
                        />
                      </div>

                      <div className="space-y-1 col-span-1 mt-2">
                        <Label>Font Family</Label>
                        <BasicCombobox
                          options={font.map((f) => ({
                            label: f.name,
                            value: f.name,
                          }))}
                          placeholder="Select font"
                          value={computedSelected.fontFamily ?? "Arial"}
                          onChange={(val) => smartUpdate({ fontFamily: val })}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Select From Database</Label>
                    <Input
                      value={localTable}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalTable(v);
                        applyPatch({ source_table_name: v });

                        setSelectedTableName(v); // supaya query kolom jalan
                      }}
                    />
                  </div>

                  {selectedTableName && (
                    <div className="space-y-2">
                      <Label>Select Column</Label>
                      <BasicCombobox
                        options={(Array.isArray(columnDataDB)
                          ? columnDataDB
                          : []
                        ).map((col: string) => ({ label: col, value: col }))}
                        placeholder="Select column"
                        value={selectedColName}
                        onChange={(val) => {
                          setSelectedColName(val);
                          applyPatch({ text_column: val });
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Text Column</Label>
                    <Input
                      value={localTextColumn}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalTextColumn(v);

                        if (computedSelected?.type === "text" && !isProxy) {
                          applyPatch({ text_column: v, text: v });
                        } else {
                          applyPatch({ text_column: v });
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Column Filter</Label>
                    <Input
                      value={localColumnFilter}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalColumnFilter(v);
                        applyPatch({ column_filter: v });
                      }}
                    />
                  </div>

                  <div className="col-span-2 mb-2 space-y-2">
                    <Label className="flex items-center gap-2 justify-between">
                      Position
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {computedSelected.category && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(computedSelected.id, {
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
                          <p>Reset Position</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <BasicCombobox
                      options={[
                        { label: "absolute", value: "absolute" },
                        { label: "relative", value: "relative" },
                      ]}
                      placeholder="Select Position"
                      value={computedSelected?.position || ""}
                      onChange={(val) => {
                        if (!computedSelected) return;
                        handleUpdateShape(computedSelected.id, {
                          position: val as "absolute" | "relative",
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-2 mb-2 space-y-2">
                    <Label className="flex items-center gap-2 justify-between">
                      Repeating
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {computedSelected.repeating && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(computedSelected.id, {
                                  repeating: undefined,
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
                          <p>Reset Repeating</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <BasicCombobox
                      options={[
                        { label: "Y", value: "Y" },
                        { label: "N", value: "N" },
                      ]}
                      placeholder="Select Repeating"
                      value={computedSelected?.repeating || ""}
                      onChange={(val) => {
                        if (!computedSelected) return;
                        handleUpdateShape(computedSelected.id, {
                          repeating: val as "Y" | "N",
                        });
                      }}
                    />
                  </div>

                  <div className="col-span-2 mb-2 space-y-2">
                    <Label className="flex items-center gap-2 justify-between">
                      Repeating Per Page
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {computedSelected.repeating_per_page && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(computedSelected.id, {
                                  repeating_per_page: undefined,
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
                          <p>Reset Repeating Per Page</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <BasicCombobox
                      options={[
                        { label: "Y", value: "Y" },
                        { label: "N", value: "N" },
                      ]}
                      placeholder="Select Repeating Per Page"
                      value={computedSelected?.repeating_per_page || ""}
                      onChange={(val) => {
                        if (!computedSelected) return;
                        handleUpdateShape(computedSelected.id, {
                          repeating_per_page: val as "Y" | "N",
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
                          {computedSelected.linkToArtboard && (
                            <Button
                              type="button"
                              onClick={() => {
                                handleUpdateShape(computedSelected.id, {
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
                      value={computedSelected?.linkToArtboard || ""}
                      onChange={(val) => {
                        if (!computedSelected) return;
                        handleUpdateShape(computedSelected.id, {
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
                        {computedSelected.lotId && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                onClick={() => {
                                  if (!computedSelected) return;

                                  handleUpdateShape(computedSelected.id, {
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
                          // 1) All lotOptions except those in usedLotsAll (unless it's the computedSelected’s lot)
                          ...lotOptions
                            .map((lot: any) => ({
                              label: `${lot.lot_no} (${lot.status})`,
                              value: lot.lot_no,
                              status: lot.status, // tambahkan ini untuk akses cepat saat onChange
                            }))
                            .filter((opt: any) => {
                              const isUsed = usedLotsAll.includes(opt.value);
                              const isMine =
                                opt.value === computedSelected?.lotId;
                              return !isUsed || isMine;
                            }),

                          // 2) Fallback for computedSelected.lotId if it isn’t in lotOptions
                          ...(computedSelected?.lotId &&
                          !lotOptions.some(
                            (lot: any) => lot.lot_no === computedSelected.lotId,
                          )
                            ? [
                                {
                                  label: `${computedSelected.lotId} (Unknown)`,
                                  value: computedSelected.lotId,
                                  status: "Unknown",
                                },
                              ]
                            : []),
                        ]}
                        placeholder="Select Lot"
                        value={computedSelected?.lotId || ""}
                        onChange={(val) => {
                          if (!computedSelected) return;

                          // Ambil status dari lotOptions atau dari options
                          const lotInfo = lotOptions.find(
                            (lot: any) => lot.lot_no === val,
                          );

                          let fill = LOT_COLOR_MAP.DEFAULT; // default abu
                          if (lotInfo?.status === "A") fill = LOT_COLOR_MAP.A;
                          else if (lotInfo?.status === "B")
                            fill = LOT_COLOR_MAP.B;

                          handleUpdateShape(computedSelected.id, {
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

                  {computedSelected?.lotId && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 justify-between">
                        Lot Image{" "}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {computedSelected.lot_img && (
                              <Button
                                type="button"
                                onClick={() => {
                                  handleUpdateShape(computedSelected.id, {
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
                          if (!file || !computedSelected) return;

                          const reader = new FileReader();
                          reader.onload = () => {
                            const base64 = reader.result as string;

                            // Simpan lot image ke shape
                            handleUpdateShape(computedSelected.id, {
                              lot_img: base64,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {computedSelected.lot_img && (
                        <div className="mt-2">
                          <img
                            src={computedSelected.lot_img}
                            alt="Lot Preview"
                            className="max-h-40 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {computedSelected?.fill !== undefined &&
                    computedSelected?.id && (
                      <div className="space-y-2">
                        <Label htmlFor="fillColor">Fill Color</Label>
                        <Input
                          id="fillColor"
                          type="color"
                          value={computedSelected.fill || "#000000"}
                          onChange={(e) => {
                            if (computedSelected?.id) {
                              handleUpdateShape(computedSelected.id, {
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
