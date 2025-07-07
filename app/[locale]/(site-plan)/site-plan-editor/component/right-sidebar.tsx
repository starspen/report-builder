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
import { Plus } from "lucide-react";
import React, { useEffect } from "react";

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
}

const RightSideBar: React.FC<RightSideBarProps> = ({
  setSelectedId,
  selectedId,
  activeArtboardId,
  setActiveArtboardId,
  shapes,
  setArtboardShapes,
  updateMenuTitle,
}) => {
  const selectedShape = shapes.find((s) => s.id === selectedId);
  const [localTitle, setLocalTitle] = React.useState(
    selectedShape?.title || selectedShape?.type || ""
  );

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
    <div>
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
                      <Input id="x" value={selectedShape.x} />
                    </div>
                  )}

                  {"y" in selectedShape && (
                    <div className="space-y-1 col-span-1">
                      <Label htmlFor="y">Y</Label>
                      <Input id="y" value={selectedShape.y} />
                    </div>
                  )}

                  {"width" in selectedShape && (
                    <div className="space-y-1 col-span-1 mr-2 mt-2">
                      <Label htmlFor="width">Width</Label>
                      <Input id="width" value={selectedShape.width} />
                    </div>
                  )}

                  {"height" in selectedShape && (
                    <div className="space-y-1 col-span-1 mt-2">
                      <Label htmlFor="height">Height</Label>
                      <Input id="height" value={selectedShape.height} />
                    </div>
                  )}

                  {"radius" in selectedShape && (
                    <div className="space-y-1 col-span-1">
                      <Label htmlFor="radius">Radius</Label>
                      <Input id="radius" value={selectedShape.radius} />
                    </div>
                  )}

                  {"radiusX" in selectedShape && (
                    <div className="space-y-1 col-span-1">
                      <Label htmlFor="radiusX">Radius X</Label>
                      <Input id="radiusX" value={selectedShape.radiusX} />
                    </div>
                  )}

                  {"radiusY" in selectedShape && (
                    <div className="space-y-1 col-span-1">
                      <Label htmlFor="radiusY">Radius Y</Label>
                      <Input id="radiusY" value={selectedShape.radiusY} />
                    </div>
                  )}

                  {selectedShape.points && (
                    <div className="space-y-1 col-span-2">
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        value={selectedShape.points.join(", ")}
                      />
                    </div>
                  )}
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
    </div>
  );
};

export default RightSideBar;
