"use client";

import React, { useState } from "react";
import ArtBoard, { ArtboardMenuItem } from "./component/art-board";
import ImageMapView from "./component/canvas";
import {
  CircleDashed,
  CircleIcon,
  ImageIcon,
  Layout,
  PenLine,
  Square,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Info } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import RightSideBar from "./component/right-sidebar";

const Editor = () => {
  const [activeArtboardId, setActiveArtboardId] = useState("1");
  const [artboardShapes, setArtboardShapes] = useState<{ [id: string]: any[] }>(
    { "1": [] }
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuItems, setMenuItems] = useState<ArtboardMenuItem[]>([
    {
      id: "1",
      title: "Artboard 1",
      icon: Layout,
      children: [],
    },
  ]);

  // Handler untuk update shapes pada artboard aktif
  const handleShapesChange = (shapes: any[]) => {
    const prevShapes = artboardShapes[activeArtboardId] || [];
    const prevIds = new Set(prevShapes.map((s) => s.id));
    const nextIds = new Set(shapes.map((s) => s.id));

    // 1. Update shapes per artboard
    setArtboardShapes((prev) => ({
      ...prev,
      [activeArtboardId]: shapes,
    }));

    const shapeIconMap: Record<string, React.ElementType> = {
      rect: Square,
      ellipse: CircleDashed,
      circle: CircleIcon,
      polygon: PenLine,
      image: ImageIcon, // misal kamu import icon ini
    };
    // 2. Sync child sidebar dengan shapes
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeArtboardId) return item;

        const nextChildren = shapes.map((s) => ({
          title: s.title || s.type,
          url: `#${s.id}`,
          icon: shapeIconMap[s.type] ?? Layout,
        }));

        return {
          ...item,
          children: nextChildren,
        };
      })
    );
  };

  const updateMenuTitle = (shapeId: string, newTitle: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeArtboardId) return item;

        const updatedChildren = item.children.map((child) =>
          child.url === `#${shapeId}` ? { ...child, title: newTitle } : child
        );

        return { ...item, children: updatedChildren };
      })
    );
  };

  return (
    <div className="flex w-full">
      <ArtBoard
        activeArtboardId={activeArtboardId}
        setActiveArtboardId={setActiveArtboardId}
        artboardShapes={artboardShapes}
        setArtboardShapes={setArtboardShapes}
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
      />
      <div className="flex-1 overflow-x-hidden">
        <ImageMapView
          shapes={artboardShapes[activeArtboardId] || []}
          onShapesChange={handleShapesChange}
          activeArtboardId={activeArtboardId}
          setMenuItems={setMenuItems}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>
      <div>
        <RightSideBar
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          activeArtboardId={activeArtboardId}
          setActiveArtboardId={setActiveArtboardId}
          shapes={artboardShapes[activeArtboardId]}
          artboardShapes={artboardShapes}
          setArtboardShapes={setArtboardShapes}
          updateMenuTitle={updateMenuTitle}
        />
      </div>
    </div>
  );
};

export default Editor;
