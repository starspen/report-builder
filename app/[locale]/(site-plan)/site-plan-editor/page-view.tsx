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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEntities } from "@/action/get-entities";
import { getAllProjects } from "@/action/get-project";
import MasterplanSidebar from "./component/masterplan-sidebar";
import { createMasterplan } from "@/action/post-masterplan";
import { auth } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  getMasterplanById,
  getMasterPlanData,
} from "@/action/get-masterplan-by-id";
import {
  saveMasterplan,
  SaveMasterplanPayload,
} from "@/action/save-masterplan";
import { toast } from "sonner";
import { deleteMasterplan } from "@/action/deleteMasterplan";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { FontFamily } from "./paper-size";

const Editor = () => {
  // SELALU TARUH HOOK DI SINI (tidak dalam if)
  const [entityCode, setEntityCode] = useState<string>("");
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  const [projectCode, setProjectCode] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const [masterplanCode, setMasterplanCode] = useState<string>("0");
  const [selectedMasterplan, setSelectedMasterplan] = useState<any | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(
    null
  );
  const [isLocked, setIsLocked] = useState(false);

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const { data: session } = useSession();
  const auditUser = session?.user?.email ?? "";

  const router = useRouter();

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
      title: "Masterplan 1",
      icon: Layout,
      children: [],
    },
  ]);

  const [isCreatingNewSiteplan, setIsCreatingNewSiteplan] = useState(false);
  const [siteplanName, setSiteplanName] = useState("");
  const [menuItemsHistory, setMenuItemsHistory] = useState<
    ArtboardMenuItem[][]
  >([]);
  const [artboardShapesHistory, setArtboardShapesHistory] = useState<
    { [id: string]: any[] }[]
  >([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  const [activeArtboardHistory, setActiveArtboardHistory] = useState<string[]>(
    []
  );

  const [initialMenuItems, setInitialMenuItems] = useState<ArtboardMenuItem[]>(
    []
  );
  const [initialArtboardShapes, setInitialArtboardShapes] = useState<{
    [id: string]: any[];
  }>({});

  const [selectedFont, setSelectedFont] = useState<FontFamily[]>([]); // ← array

  console.log(selectedFont, "selectedFont");

  const queryClient = useQueryClient();

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

  const handleDeleteArtboard = (id: string) => {
    // Hitung state baru dulu
    const newMenuItems = menuItems.filter((item) => item.id !== id);
    const newArtboardShapes = { ...artboardShapes };
    delete newArtboardShapes[id];

    setMenuItems(newMenuItems);
    setArtboardShapes(newArtboardShapes);

    // Reset activeArtboardId jika perlu
    if (activeArtboardId === id) {
      setActiveArtboardId(newMenuItems.length > 0 ? newMenuItems[0].id : "");
    }
    // Reset selectedId jika perlu
    if (artboardShapes[id]?.some((shape) => shape.id === selectedId)) {
      setSelectedId(null);
    }
  };

  const handleEditChild = (
    artboardId: string,
    childId: string,
    newTitle: string
  ) => {
    setArtboardShapes((prev) => ({
      ...prev,
      [artboardId]: prev[artboardId].map((shape) =>
        shape.id === childId ? { ...shape, title: newTitle } : shape
      ),
    }));
    // Jika ingin update menuItems children juga:
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === artboardId
          ? {
              ...item,
              children: item.children.map((child) =>
                child.url === `#${childId}`
                  ? { ...child, title: newTitle }
                  : child
              ),
            }
          : item
      )
    );
  };

  const handleDeleteChild = (artboardId: string, childId: string) => {
    setArtboardShapes((prev) => ({
      ...prev,
      [artboardId]: prev[artboardId].filter((shape) => shape.id !== childId),
    }));
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === artboardId
          ? {
              ...item,
              children: item.children.filter(
                (child) => child.url !== `#${childId}`
              ),
            }
          : item
      )
    );
    // Optional: reset selectedId jika child yang dihapus sedang terseleksi
    if (selectedId === childId) setSelectedId(null);
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
    enabled: !!entityCode, // pakai entityCode sekarang
  });

  // filter projects berdasarkan entity_cd
  const availableProjects =
    entityCode && allProjects
      ? allProjects.filter((p) => p.entity_cd.trim() === entityCode.trim())
      : [];

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: createMasterplan,
    onSuccess: (data) => {
      const newMasterplan = Array.isArray(data.data) ? data.data[0] : data.data;

      const masterplanId = newMasterplan.masterplan_id || newMasterplan.id;

      if (!masterplanId) {
        console.error(
          "masterplanId tidak ditemukan di response:",
          newMasterplan
        );
        return;
      }

      router.push(`/en/site-plan-editor?masterplanId=${masterplanId}`);
    },
    onError: (err: any) => {
      console.error("Gagal create masterplan:", err.message);
    },
  });

  const searchParams = useSearchParams();
  const masterplanId = searchParams?.get("masterplanId");

  const { data: masterplanDataById } = useQuery({
    queryKey: ["masterplan", masterplanId],
    queryFn: () => getMasterplanById(masterplanId!),
    enabled: !!masterplanId,
  });

  const {
    data: masterplans,
    isLoading: isLoadingMasterplans,
    isError: isErrorMasterplans,
  } = useQuery({
    queryKey: ["masterplans", entityCode, projectCode],
    queryFn: () => getMasterPlanData(entityCode, projectCode),
    enabled: !!entityCode && !!projectCode,
  });

  const handleCreateNewSiteplan = () => {
    if (!entityCode || !projectCode || !siteplanName) {
      console.warn("Mohon lengkapi entity, project, dan siteplan name.");
      return;
    }

    mutate({
      entity_cd: entityCode,
      project_no: projectCode,
      name: siteplanName,
      audit_user: auditUser, // Anda bisa ganti dinamis sesuai user login
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      setMenuItems(menuItemsHistory[historyIndex - 1]);
      setArtboardShapes(artboardShapesHistory[historyIndex - 1]);
      setActiveArtboardId(activeArtboardHistory[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);

      // Tambahkan ini:
      setTimeout(() => setIsUndoRedo(false), 0);
    }
  };

  const handleRedo = () => {
    if (historyIndex < menuItemsHistory.length - 1) {
      setIsUndoRedo(true);
      setMenuItems(menuItemsHistory[historyIndex + 1]);
      setArtboardShapes(artboardShapesHistory[historyIndex + 1]);
      setActiveArtboardId(activeArtboardHistory[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);

      // Tambahkan ini:
      setTimeout(() => setIsUndoRedo(false), 0);
    }
  };

  const { mutate: saveMasterplanMutate } = useMutation({
    mutationFn: saveMasterplan,
    onSuccess: (data) => {
      toast.success("Masterplan saved successfully!", {
        style: {
          backgroundColor: "#22c55e", // warna hijau (tailwind green-500)
          color: "white",
        },
      });
    },
    onError: (error: any) => {
      console.error("Error saving masterplan:", error.message);
      toast.error("Failed to save masterplan.", {
        style: {
          backgroundColor: "#dc2626", // warna merah (tailwind red-600)
          color: "white",
        },
      });
    },
  });

  const handleSave = () => {
    const payload: SaveMasterplanPayload = {
      id: Number(masterplanDataById?.masterplan_id),
      entity_cd: entityCode,
      project_no: projectCode,
      masterplan_name: selectedMasterplan?.masterplan_name || siteplanName,
      audit_user: session?.user?.email || "unknown@ifca.co.id",
      artboards: menuItems.map((item) => ({
        id: Number(item.id),
        title: item.title,
        type: "floor",
        shapes: (artboardShapes[item.id] || []).map(({ lotId, ...shape }) => {
          const baseShape = {
            ...shape,
            title: shape.title || shape.type || "",
            lot_no: lotId || "", // hanya kirim lot_no
          };

          // Tambahkan fontFamily kalau text
          if (shape.type === "text") {
            return {
              ...baseShape,
              fontFamily: shape.fontFamily || "Helvetica", // fallback default
              width: shape.width || 200
            };
          }

          return baseShape;
        }),
      })),
    };
    console.log(payload, "payload sep")
    saveMasterplanMutate(payload);
  };

  const { mutate: deleteMasterplanMutate } = useMutation({
    mutationFn: deleteMasterplan,
    onSuccess: () => {
      toast.success("Masterplan deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["masterplans", entityCode, projectCode],
      });
      router.refresh();
    },
    onError: (error: any) => {
      console.error("Error deleting masterplan:", error.message);
      toast.error("Failed to delete masterplan.");
    },
  });

  useEffect(() => {
    if (masterplanDataById) {
      setEntityCode(masterplanDataById.entity_cd);
      setProjectCode(masterplanDataById.project_no);
      setMasterplanCode(masterplanDataById.masterplan_id);
      setSelectedMasterplan({
        masterplan_no: masterplanDataById.masterplan_id,
        masterplan_name: masterplanDataById.masterplan_name,
      });

      const hasValidArtboards =
        Array.isArray(masterplanDataById.artboards) &&
        masterplanDataById.artboards.some(
          (a: any) => a.id && a.id !== "null" && a.shapes?.length > 0
        );

      const artboards = hasValidArtboards
        ? masterplanDataById.artboards
        : [
            {
              id: "1",
              title: "Masterplan 1",
              shapes: [],
            },
          ];

      const artboardMap = artboards.reduce(
        (acc: { [key: string]: any[] }, artboard: any) => {
          acc[artboard.id || "1"] = (artboard.shapes || [])
            .filter(
              (s: any) =>
                s &&
                typeof s.id === "string" &&
                s.id !== "null-null-null" &&
                s.type !== null &&
                s.type !== undefined
            )
            .map((shape: any) => {
              if (shape.type === "image") {
                const isBlob = shape.src?.startsWith("blob:");
                return {
                  ...shape,
                  src: isBlob ? "" : shape.src,
                  lotId: shape.lot_no || "", // ⬅️ Tambahkan ini
                };
              }

              return {
                ...shape,
                lotId: shape.lot_no || "", // ⬅️ Tambahkan ini untuk semua shape selain image
              };
            });

          return acc;
        },
        {}
      );

      setArtboardShapes(artboardMap);

      const newMenuItems = artboards.map((artboard: any, index: number) => ({
        id: artboard.id || String(index + 1),
        title: artboard.title?.trim()
          ? artboard.title
          : `Masterplan ${index + 1}`,

        icon: Layout,
        children:
          (artboard.shapes || [])
            .filter(
              (s: any) =>
                s &&
                typeof s.id === "string" &&
                s.id !== "null-null-null" &&
                s.type !== null &&
                s.type !== undefined
            )
            .map((s: any) => ({
              title: s.title || s.type || "Untitled Shape",
              url: `#${s.id}`,
              icon: Layout,
            })) || [],
      }));

      const firstArtboardId =
        artboards.length > 0 ? artboards[0].id || "1" : "1";
      setActiveArtboardId(firstArtboardId);
      setMenuItems(newMenuItems);
      setInitialMenuItems(newMenuItems); // ⬅ snapshot menu awal dari server
      setInitialArtboardShapes(artboardMap); // ⬅ snapshot shapes awal dari server
      setIsSubmitted(true);
    }
  }, [masterplanDataById]);

  const isChanged =
    JSON.stringify(menuItems) !== JSON.stringify(initialMenuItems) ||
    JSON.stringify(artboardShapes) !== JSON.stringify(initialArtboardShapes);

  useEffect(() => {
    if (!masterplanId) {
      setMasterplanCode("");
      setSelectedMasterplan(null);
    }
  }, [selectedProject, masterplanId]);

  useEffect(() => {
    // Reset state lain kalau perlu
  }, [masterplanId]);

  const isEditorMode = !!masterplanId;

  useEffect(() => {
    if (!masterplanId) {
      setEntityCode("");
      setProjectCode("");
      setSelectedEntity(null);
      setSelectedProject(null);
      setSelectedMasterplan(null);
      setIsCreatingNewSiteplan(false);
    }
  }, [masterplanId]);

  useEffect(() => {
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }

    // 🚨 cek apakah state terakhir sama dengan state yang akan ditulis
    const lastMenuState = menuItemsHistory[historyIndex];
    const lastShapeState = artboardShapesHistory[historyIndex];

    if (
      JSON.stringify(lastMenuState) === JSON.stringify(menuItems) &&
      JSON.stringify(lastShapeState) === JSON.stringify(artboardShapes)
    ) {
      return;
    }

    setMenuItemsHistory([
      ...menuItemsHistory.slice(0, historyIndex + 1),
      menuItems,
    ]);
    setArtboardShapesHistory([
      ...artboardShapesHistory.slice(0, historyIndex + 1),
      artboardShapes,
    ]);
    setActiveArtboardHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      activeArtboardId,
    ]);
    setHistoryIndex(historyIndex + 1);
  }, [menuItems, artboardShapes, activeArtboardId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, menuItemsHistory, artboardShapesHistory]);

  if (!isEditorMode && !isCreatingNewSiteplan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg">
          <CardHeader className="text-lg font-semibold text-center">
            Select Entity & Project
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Entity Selector */}
            <BasicCombobox
              options={
                entities?.map((e) => ({
                  label: e.entity_name,
                  value: e.entity_cd,
                })) || []
              }
              placeholder="Select Entity"
              value={entityCode}
              onChange={(val) => {
                setEntityCode(val);
                const found = entities?.find((e) => e.entity_cd === val);
                setSelectedEntity(found || null);
                setProjectCode(""); // reset projectCode saat entity berubah
                setSelectedProject(null);
              }}
            />

            {/* Project Selector */}
            <BasicCombobox
              options={availableProjects.map((p) => ({
                label: p.project_name,
                value: p.project_no,
              }))}
              placeholder="Select Project"
              value={projectCode}
              onChange={(val) => {
                setProjectCode(val);
                const found = availableProjects.find(
                  (p) => p.project_no === val
                );
                setSelectedProject(found || null);
              }}
              disabled={!entityCode}
            />
            <div className="flex gap-2 ">
              <BasicCombobox
                options={
                  masterplans?.map((m: any) => ({
                    label: m.name,
                    value: m.id,
                  })) || []
                }
                placeholder={
                  isLoadingMasterplans
                    ? "Loading masterplans..."
                    : "Select Masterplan"
                }
                value={masterplanCode}
                onChange={(val) => {
                  setMasterplanCode(val);
                  const found = masterplans?.find((m: any) => m.id === val);
                  setSelectedMasterplan(found || null);
                }}
                onDelete={(id) => {
                  requestAnimationFrame(() => {
                    const found = masterplans?.find((m: any) => m.id === id);
                    setPendingDeleteId(id);
                    setPendingDeleteLabel(found?.name || "");
                    setDeleteDialogOpen(true);
                  });
                }}
                disabled={!projectCode || isLoadingMasterplans}
              />

              <Button
                className="flex items-center justify-center w-1/8"
                onClick={() => setIsCreatingNewSiteplan(true)}
                disabled={!selectedProject}
              >
                Create New Siteplan
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              disabled={!selectedMasterplan}
              onClick={() => {
                if (selectedMasterplan?.id) {
                  router.push(
                    `/en/site-plan-editor?masterplanId=${selectedMasterplan.id}`
                  );
                }
              }}
            >
              Go to Editor
            </Button>
          </CardContent>
        </Card>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <h2>Confirm Delete</h2>
            </DialogHeader>
            <p>Are you sure want to delete {pendingDeleteLabel}?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (pendingDeleteId) {
                    deleteMasterplanMutate(pendingDeleteId);
                  }
                  setDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (!isEditorMode && isCreatingNewSiteplan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg">
          <CardHeader className="text-lg font-semibold text-center">
            Create New Siteplan
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Entity: <strong>{selectedEntity?.entity_name || "-"}</strong>
              </div>
              <div className="text-sm text-muted-foreground">
                Project: <strong>{selectedProject?.project_name || "-"}</strong>
              </div>

              <input
                type="text"
                value={siteplanName}
                onChange={(e) => setSiteplanName(e.target.value)}
                placeholder="Siteplan Name"
                className="border rounded w-full px-3 py-2"
              />
            </div>

            <Button
              className="w-full"
              disabled={!siteplanName}
              onClick={handleCreateNewSiteplan}
            >
              Create & Go to Editor
            </Button>

            <Button
              className="w-full"
              onClick={() => setIsCreatingNewSiteplan(false)}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RENDER EDITOR SAAT ENTITY & PROJECT TERPILIH
  return (
    <>
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
                selectedMasterplan={selectedMasterplan}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                handleDeleteArtboard={handleDeleteArtboard}
                handleEditChild={handleEditChild}
                handleDeleteChild={handleDeleteChild}
              />
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden transition-all duration-300 overflow-y-auto">
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
              selectedEntity={selectedEntity}
              selectedProject={selectedProject}
              selectedMasterplan={selectedMasterplan}
              artboardShapes={artboardShapes}
              onSave={handleSave}
              session={session}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              openMenus={openMenus}
              setOpenMenus={setOpenMenus}
              setInitialMenuItems={setInitialMenuItems}
              setInitialArtboardShapes={setInitialArtboardShapes}
              isChanged={isChanged}
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
                allShapes={artboardShapes}
                artboardShapes={artboardShapes}
                setArtboardShapes={setArtboardShapes}
                updateMenuTitle={updateMenuTitle}
                menuItems={menuItems}
                setRightSidebarOpen={setRightSidebarOpen}
                rightSidebarOpen={rightSidebarOpen}
                entityCode={entityCode}
                projectCode={projectCode}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
