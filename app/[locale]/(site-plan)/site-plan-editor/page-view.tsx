"use client";

import React, { useEffect, useState } from "react";
import ArtBoard, { ArtboardMenuItem, Masterplan } from "./component/art-board";
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
import BasicCombobox from "../../(protected)/forms/combobox/basic-combobox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEntities } from "@/action/get-entities";
import { getAllProjects } from "@/action/get-project";
import MasterplanSidebar from "./component/masterplan-sidebar";

const Editor = () => {
  // SELALU TARUH HOOK DI SINI (tidak dalam if)
  const [entity, setEntity] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [projectNumber, setProjectNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const [masterplans, setMasterplans] = useState<Masterplan[]>([]);

  const [activeMasterplanId, setActiveMasterplanId] = useState<string | null>(
    null
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeLotId, setActiveLotId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<
    "masterplan" | "block" | "lot" | null
  >(null);

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

  const {
    data: entities,
    isLoading: isLoadingEntities,
    isError: isErrorEntities,
  } = useQuery({
    queryKey: ["entities"],
    queryFn: getEntities,
  });

  const {
    data: allProjects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
    enabled: !!entity, // hanya ambil projects setelah entity dipilih
  });

  // filter projects berdasarkan entity_cd
  const availableProjects =
    entity && allProjects
      ? allProjects.filter((p) => p.entity_cd.trim() === entity.trim())
      : [];

  const buildSavePayload = () => {
    return {
      entity_cd: entity,
      project_no: projectNumber,
      artboards: Object.entries(artboardShapes).map(([id, shapes]) => {
        const title = menuItems.find((item) => item.id === id)?.title || id;
        return {
          id,
          title,
          shapes,
        };
      }),
    };
  };

  useEffect(() => {
    if (isSubmitted) {
      // Inject shape secara otomatis ke artboard "1"
      setArtboardShapes({
        "1": [
          {
            id: "rect-1",
            type: "rect",
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            fill: "#ff0000",
            title: "Red Rectangle",
          },
          {
            id: "circle-1",
            type: "circle",
            x: 300,
            y: 120,
            radius: 60,
            fill: "#00ff00",
            title: "Green Circle",
          },
          {
            id: "ellipse-1",
            type: "ellipse",
            x: 500,
            y: 150,
            radiusX: 80,
            radiusY: 40,
            fill: "#0000ff",
            title: "Blue Ellipse",
          },
          {
            id: "polygon-1",
            type: "polygon",
            x: 0,
            y: 0,
            points: [100, 100, 150, 50, 200, 100, 175, 150, 125, 150],
            fill: "#ffa500",
            title: "Orange Polygon",
          },
          {
            id: "image-1",
            type: "image",
            x: 600,
            y: 200,
            width: 100,
            height: 100,
            src: "https://example.com/sample-image.png",
            fill: "#ffffff",
            title: "Sample Image",
          },
          {
            id: "link-1",
            type: "rect",
            x: 750,
            y: 100,
            width: 120,
            height: 60,
            fill: "#cccccc",
            title: "Go to Artboard 2",
            linkToArtboard: "2",
          },
        ],
        "2": [], // Jika kamu ingin uji link ke Artboard 2
      });
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (isSubmitted) {
      const payload = buildSavePayload();
      console.log("📦 Payload siap disimpan:", payload);
    }
  }, [artboardShapes]); // trigger setelah shapes benar-benar ke-set

  // COND RENDERING ONLY IN JSX
  if (!isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg">
          <CardHeader className="text-lg font-semibold text-center">
            Select Entity & Project
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingEntities ? (
              <p>Loading entities...</p>
            ) : isErrorEntities ? (
              <p className="text-red-500">Error fetching entities</p>
            ) : (
              <>
                {/* Entity Selector */}
                <BasicCombobox
                  options={
                    entities?.map((e) => ({
                      label: e.entity_name,
                      value: e.entity_cd,
                    })) || []
                  }
                  placeholder="Select Entity"
                  value={entity}
                  onChange={(val) => {
                    setEntity(val);
                    setProjectNumber(val);
                  }}
                />

                {/* Project Selector */}
                <BasicCombobox
                  options={availableProjects.map((p) => ({
                    label: p.project_name,
                    value: p.project_no,
                  }))}
                  placeholder="Select Project"
                  value={project}
                  onChange={(val) => {
                    setProject(val);
                    setProjectNumber(val);
                  }}
                  disabled={!entity || isLoadingProjects || isErrorProjects}
                />

                {/* Submit Button */}
                <Button
                  className="w-full"
                  disabled={!entity || !project}
                  onClick={() => setIsSubmitted(true)}
                >
                  Masuk ke Editor
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // RENDER EDITOR SAAT ENTITY & PROJECT TERPILIH
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Sidebar kiri */}
      <div className="flex flex-1 w-full overflow-hidden">
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
            {/* <ArtBoard
              activeArtboardId={activeArtboardId}
              setActiveArtboardId={setActiveArtboardId}
              artboardShapes={artboardShapes}
              setArtboardShapes={setArtboardShapes}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              leftSidebarOpen={leftSidebarOpen}
            /> */}
            <MasterplanSidebar
              masterplans={masterplans}
              setMasterplans={setMasterplans}
              activeMasterplanId={activeMasterplanId}
              activeBlockId={activeBlockId}
              activeLotId={activeLotId}
              setActiveMasterplanId={setActiveMasterplanId}
              setActiveBlockId={setActiveBlockId}
              setActiveLotId={setActiveLotId}
              activeType={activeType}
              setActiveType={setActiveType}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
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
