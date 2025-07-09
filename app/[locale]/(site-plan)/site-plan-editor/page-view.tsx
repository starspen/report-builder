"use client";

import React, { useState } from "react";
import ArtBoard, { ArtboardMenuItem } from "./component/art-board";
import ImageMapView, { DrawMode } from "./component/canvas";
import {
  CircleDashed,
  CircleIcon,
  ImageIcon,
  Layout,
  PenLine,
  Square,
} from "lucide-react";
import RightSideBar from "./component/right-sidebar";

const Editor = () => {
  const [activeArtboardId, setActiveArtboardId] = useState("1");
  const [artboardShapes, setArtboardShapes] = useState<{ [id: string]: any[] }>(
    { "1": [] }
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [mode, setMode] = useState<DrawMode>("default");
  const [menuItems, setMenuItems] = useState<ArtboardMenuItem[]>([
    {
      id: "1",
      title: "Artboard 1",
      icon: Layout,
      children: [],
    },
  ]);

  const handleShapesChange = (shapes: any[]) => {
    const shapeIconMap: Record<string, React.ElementType> = {
      rect: Square,
      ellipse: CircleDashed,
      circle: CircleIcon,
      polygon: PenLine,
      image: ImageIcon,
    };

    const nextChildren = shapes.map((s) => ({
      title: s.title || s.type,
      url: `#${s.id}`,
      icon: shapeIconMap[s.type] ?? Layout,
    }));

    setArtboardShapes((prev) => ({
      ...prev,
      [activeArtboardId]: shapes,
    }));

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === activeArtboardId
          ? { ...item, children: nextChildren }
          : item
      )
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
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Main layout: Sidebar kiri | Canvas | Sidebar kanan */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar kiri */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            leftSidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <div
            className={`transition-transform duration-300 transform ${
              leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } h-full`}
          >
            <ArtBoard
              activeArtboardId={activeArtboardId}
              setActiveArtboardId={setActiveArtboardId}
              artboardShapes={artboardShapes}
              setArtboardShapes={setArtboardShapes}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              leftSidebarOpen={leftSidebarOpen}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden transition-all duration-300">
          <ImageMapView
            shapes={artboardShapes[activeArtboardId] || []}
            setArtboardShapes={setArtboardShapes}
            onShapesChange={handleShapesChange}
            activeArtboardId={activeArtboardId}
            setActiveArtboardId={setActiveArtboardId}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isPreviewMode={isPreviewMode}
            setIsPreviewMode={setIsPreviewMode}
            setRightSidebarOpen={setRightSidebarOpen}
            rightSidebarOpen={rightSidebarOpen}
            setLeftSidebarOpen={setLeftSidebarOpen}
            mode={mode}
            setMode={setMode}
          />
        </div>

        {/* Sidebar kanan */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            !rightSidebarOpen ? "w-0" : "w-fit"
          } overflow-hidden`}
        >
          <div
            className={`transition-transform duration-300 transform ${
              rightSidebarOpen ? "translate-x-0" : "translate-x-full"
            } h-full`}
          >
            <RightSideBar
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              activeArtboardId={activeArtboardId || ""}
              setActiveArtboardId={setActiveArtboardId}
              shapes={artboardShapes[activeArtboardId]}
              artboardShapes={artboardShapes}
              setArtboardShapes={setArtboardShapes}
              updateMenuTitle={updateMenuTitle}
              menuItems={menuItems}
              setRightSidebarOpen={setRightSidebarOpen}
              rightSidebarOpen={rightSidebarOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
