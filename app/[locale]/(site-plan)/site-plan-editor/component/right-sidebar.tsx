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
import { PanelRight, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArtboardMenuItem } from "./art-board";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Shape {
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
}

interface RightSideBarProps {
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
  shapes: Shape[];
  artboardShapes: { [id: string]: any[] };
  setArtboardShapes: React.Dispatch<
    React.SetStateAction<{ [id: string]: any[] }>
  >;
  updateMenuTitle: (shapeId: string, newTitle: string) => void;
  menuItems: ArtboardMenuItem[];
  rightSidebarOpen: boolean;
  setRightSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightSideBar: React.FC<RightSideBarProps> = ({
  setSelectedId,
  selectedId,
  activeArtboardId,
  setActiveArtboardId,
  shapes,
  setArtboardShapes,
  updateMenuTitle,
  menuItems,
  rightSidebarOpen,
  setRightSidebarOpen,
}) => {
  const selectedShape = shapes?.find((s) => s.id === selectedId);
  const [localTitle, setLocalTitle] = React.useState(
    selectedShape?.title || selectedShape?.type || ""
  );
  const { toggleSidebar } = useSidebar();

  const handleUpdateShape = (id: string, updates: Partial<Shape>) => {
    setArtboardShapes((prev) => ({
      ...prev,
      [activeArtboardId]: prev[activeArtboardId].map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  useEffect(() => {
    if (selectedShape) {
      setLocalTitle(selectedShape.title || selectedShape.type || "");
    }
  }, [selectedShape]);

  return (
    <div className="relative">
      {rightSidebarOpen && (
        <Sidebar variant="sidebar" side="right">
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
                    <Label htmlFor="linkTo">Link to Artboard</Label>
                    <Select
                      value={selectedShape?.linkToArtboard || ""}
                      onValueChange={(val) => {
                        if (!selectedShape) return;
                        handleUpdateShape(selectedShape.id, {
                          linkToArtboard: val,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Artboard Tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
