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
import { createReport } from "@/action/create-report";
import { getTemplateList } from "@/action/get-template-list";
import { getPaperByDocument } from "@/action/get-paper";
import { PageItem, SavePaper, savePaper } from "@/action/save-paper";
import { getCompany, getDocumentId } from "@/action/get-company";
import { getTableData } from "@/action/get-table-data";
import {
  LabelPatch,
  TableCell,
  TableLabel,
  TablePatch,
} from "./component/image-renderer";

// Ubah shape table lama → punya labels[] & tables[] yang benar
function normalizeTableShapeLegacy(s: any): any {
  if (s?.type !== "table") return s;

  const next = { ...s };

  // 1) pastikan tables[] berisi satu cell area penuh table (relatif 0,0)
  if (!Array.isArray(next.tables) || next.tables.length === 0) {
    next.tables = [
      {
        x: 0,
        y: 0,
        width: Math.round(next.width ?? 0),
        height: Math.round(next.height ?? 0),
        // opsional:
        header: next.label ?? "",
        text_column: next.text_column ?? "",
        column_filter: next.column_filter ?? "",
      },
    ];
  }

  // 2) jika ada legacy text/text_column di root → jadikan 1 label
  const hasLegacyText =
    (next.text && String(next.text).trim() !== "") ||
    (next.text_column && String(next.text_column).trim() !== "");

  if (hasLegacyText) {
    const newLabel = {
      id: `lbl-${Date.now()}`,
      text: next.text ?? "",
      text_column: next.text_column ?? "",
      source_table_name: next.source_table_name ?? "",
      table_cd: next.table_cd ?? "",
      column_filter: next.column_filter ?? "",
      labelX: Math.round((next.width ?? 0) / 2), // posisi default: tengah table
      labelY: Math.round((next.height ?? 0) / 2),
      fontSize: Number(next.fontSize) || 16,
      fontFamily: next.fontFamily || "Arial",
      type: "text" as const,
    };

    next.labels = Array.isArray(next.labels)
      ? [...next.labels, newLabel]
      : [newLabel];

    // kosongkan legacy field di root agar tidak dobel
    next.text = "";
    // (boleh dikosongkan juga kalau mau benar2 pindah total)
    // next.text_column = "";
    // next.source_table_name = "";
    // next.column_filter = "";
  }

  return next;
}

const Editor = () => {
  // SELALU TARUH HOOK DI SINI (tidak dalam if)
  const [entityCode, setEntityCode] = useState<string>("");
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  const [projectCode, setProjectCode] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const [masterplanCode, setMasterplanCode] = useState<string>("0");
  const [selectedMasterplan, setSelectedMasterplan] = useState<any | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(
    null,
  );
  const [isLocked, setIsLocked] = useState(false);

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const { data: session } = useSession();
  const auditUser = session?.user?.email ?? "";

  const router = useRouter();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [group, setGroup] = useState("");
  const [table, setTable] = useState("");
  const [columnFilter, setColumnFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");

  const [activeArtboardId, setActiveArtboardId] = useState("1");
  const [artboardShapes, setArtboardShapes] = useState<{ [id: string]: any[] }>(
    { "1": [] },
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
    [],
  );

  const [initialMenuItems, setInitialMenuItems] = useState<ArtboardMenuItem[]>(
    [],
  );
  const [initialArtboardShapes, setInitialArtboardShapes] = useState<{
    [id: string]: any[];
  }>({});

  const [selectedFont, setSelectedFont] = useState<FontFamily[]>([]); // ← array
  const [selectedLabel, setSelectedLabel] = useState<{
    tableId: string;
    labelId: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // state sudah ada:
  // const [selectedLabel, setSelectedLabel] = useState<{ tableId: string; labelId: string } | null>(null);

  const activeShapes = artboardShapes[activeArtboardId] || [];

  const pickSelectedLabel = () => {
    if (!selectedLabel) return null;
    const table = activeShapes.find(
      (s) => s.id === selectedLabel.tableId && s.type === "table",
    ) as any | undefined; // Table
    const lbl = table?.labels?.find((l: any) => l.id === selectedLabel.labelId);
    return lbl ? { table, lbl } : null;
  };

  const selectedLabelInfo = pickSelectedLabel();

  // PROXY untuk sidebar: kalau ada label terpilih → kirim object bertipe "text"
  const selectedShapeForSidebar = selectedLabelInfo
    ? {
        id: selectedLabelInfo.lbl.id,
        type: "text" as const, // ← ini yang kamu tanya
        text: selectedLabelInfo.lbl.text ?? "",
        fontSize: selectedLabelInfo.lbl.fontSize ?? 16,
        fontFamily: selectedLabelInfo.lbl.fontFamily ?? "Arial",
        locked: false,
      }
    : activeShapes.find((s) => s.id === selectedId) || null;

  // updater untuk LABEL (bukan pushHistory, cukup update artboardShapes)
  const updateLabel = (tableId: string, labelId: string, patch: LabelPatch) => {
    setArtboardShapes((prev) => {
      const page = prev[activeArtboardId] || [];
      const next = page.map((s) => {
        if (s.id !== tableId || s.type !== "table") return s;
        return {
          ...s,
          labels: (s.labels ?? []).map((l: TableLabel) =>
            l.id === labelId ? { ...l, ...patch } : l,
          ),
        };
      });
      // no-op guard
      if (next === page) return prev;
      return { ...prev, [activeArtboardId]: next };
    });
  };

  const updateTable = (
    tableId: string,
    patch: TablePatch,
    propagate: boolean,
  ) => {
    setArtboardShapes((prev) => {
      const page = prev[activeArtboardId] || [];
      const next = page.map((s) => {
        if (s.id !== tableId || s.type !== "table") return s;
        const updated = { ...s, ...patch };
        if (propagate && (patch.source_table_name || patch.text_column)) {
          updated.labels = (s.labels ?? []).map((l: TableLabel) => ({
            ...l,
            ...patch,
          }));
        }
        return updated;
      });
      if (next === page) return prev;
      return { ...prev, [activeArtboardId]: next };
    });
  };

  // satu pintu update dari Sidebar
  const handleUpdateSelected = (patch: LabelPatch | TablePatch) => {
    if (selectedLabelInfo) {
      // label aktif
      updateLabel(
        selectedLabelInfo.table.id,
        selectedLabelInfo.lbl.id,
        patch as LabelPatch,
      );
    } else if (selectedId) {
      // table/shape aktif
      const isDbMapping =
        "source_table_name" in patch ||
        "text_column" in patch ||
        "table_cd" in patch ||
        "column_filter" in patch;
      updateTable(selectedId, patch as TablePatch, isDbMapping);
    }
  };
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
          : item,
      ),
    );
  };

  const updateMenuTitle = (shapeId: string, newTitle: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeArtboardId) return item;

        const updatedChildren = item.children.map((child) =>
          child.url === `#${shapeId}` ? { ...child, title: newTitle } : child,
        );

        return { ...item, children: updatedChildren };
      }),
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
    newTitle: string,
  ) => {
    setArtboardShapes((prev) => ({
      ...prev,
      [artboardId]: prev[artboardId].map((shape) =>
        shape.id === childId ? { ...shape, title: newTitle } : shape,
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
                  : child,
              ),
            }
          : item,
      ),
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
                (child) => child.url !== `#${childId}`,
              ),
            }
          : item,
      ),
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
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
  } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompany(),
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

  const { mutate } = useMutation({
    mutationFn: createReport,
  });

  const searchParams = useSearchParams();
  const masterplanId = searchParams?.get("document_id");

  const { data: masterplanDataById } = useQuery({
    queryKey: ["document_id", masterplanId],
    queryFn: () => getPaperByDocument(masterplanId!),
    enabled: !!masterplanId,
  });

  const {
    data: masterplans,
    isLoading: isLoadingMasterplans,
    isError: isErrorMasterplans,
  } = useQuery({
    queryKey: ["masterplans", entityCode],
    queryFn: () => getDocumentId(entityCode),
    enabled: !!entityCode,
  });

  const company_cd = searchParams?.get("company_cd") ?? "";

  const {
    data: tableDataDB,
    isLoading: isLoadingCompanyCd,
    isError: isErrorCompanyCd,
  } = useQuery({
    queryKey: ["company_cd", company_cd],
    queryFn: () => getTableData(company_cd),
  });

  const handleCreateNewSiteplan = () => {
    if (!entityCode || !projectCode || !siteplanName) {
      console.warn("Mohon lengkapi entity, project, dan siteplan name.");
      return;
    }

    const randomDocumentId = `${entityCode}-${projectCode}-${Math.floor(
      Math.random() * 1000,
    )}`;

    mutate(
      {
        company_cd: "abc",
        entity_cd: entityCode,
        project_no: projectCode,
        name: siteplanName,
        audit_user: auditUser,
        document_id: randomDocumentId,
      },
      {
        onSuccess: () => {
          router.push(`/en/site-plan-editor?document_id=${randomDocumentId}`);
        },
        onError: (err) => {
          console.error("Gagal create masterplan:", err);
        },
      },
    );
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
    mutationFn: savePaper,
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
    const payload: SavePaper = {
      documentId: masterplanDataById?.document_id || "document", // bisa juga dari state/URL
      entity_cd: entityCode,
      company_cd: selectedEntity?.company_cd || "UNKNOWN",
      name: selectedMasterplan?.masterplan_name || siteplanName,
      auditUser: session?.user?.email || "unknown@ifca.co.id",
      auditDate: null, // biarkan null seperti Swagger
      pages: menuItems.map((item, index) => ({
        pageNumber: index + 1,
        paperWidth: 595.28, // ukuran A4 dalam pt
        paperHeight: 841.89,
        margin_top: 0,
        margin_right: 0,
        margin_left: 0,
        margin_bottom: 0,
        paperSize: "a4",
        items: (artboardShapes[item.id] || []).flatMap((shape, i) => {
          // === TABLE: kirim 1 item yang berisi RECT table di "tables", dan teks/label di "labels"
          if (shape.type === "table") {
            // Ambil semua label dari tabel
            const labels: TableLabel[] = (shape.labels ?? []).map(
              (lbl: any) => {
                const isFromTextColumn =
                  !lbl.text || lbl.text.trim().length === 0; // kosong berarti ambil dari text_column

                if (isFromTextColumn) {
                  // Label yang sumbernya text_column
                  return {
                    id: lbl.id,
                    text_column: shape.text_column ?? "",
                    column_filter: shape.column_filter ?? [],
                    source_table_name: shape.source_table_name ?? "",
                    labelX: Number(lbl.labelX) || 0,
                    labelY: Number(lbl.labelY) || 0,
                    fontSize: Number(lbl.fontSize) || 16,
                    fontFamily: lbl.fontFamily ?? "Arial",
                    type: "text",
                  };
                } else {
                  // Label teks manual (tanpa column_filter dan source_table_name)
                  return {
                    id: lbl.id,
                    text: lbl.text,
                    labelX: Number(lbl.labelX) || 0,
                    labelY: Number(lbl.labelY) || 0,
                    fontSize: Number(lbl.fontSize) || 16,
                    fontFamily: lbl.fontFamily ?? "Arial",
                    type: "text",
                  };
                }
              },
            );

            const tableRect: TableCell = {
              x: shape.x,
              y: shape.y,
              width: Math.round(shape.width || 0),
              height: Math.round(shape.height || 0),
              labels: labels,
            };

            const baseItem: PageItem = {
              name: `item-${i}`,
              type: shape.type,
              text: shape.text || "",
              x: shape.x,
              y: shape.y,
              fill: shape.fill || "",
              width: shape.width || 0,
              height: shape.height || 0,
              font: shape.fontFamily || "Helvetica",
              fontSize: String(Number(shape.fontSize) || 14),
              image_src: shape.image_src || "",
              tables: [],
              group: group || "",
              source_table_name: table || "",
              column_filter: columnFilter || "",
              group_type: shape.category || "default",
              position: shape.position || "absolute",
              repeating: shape.repeating || "N",
              repeating_per_page: shape.repeating_per_page || "N",
              text_column: textFilter || "",
            };

            return [baseItem];
          }

          // === NON-TABLE: tetap kirim sebagai item biasa (rect, circle, image, text, ellipse, polygon, dll)
          const baseItem: PageItem = {
            name: `item-${i}`,
            type: shape.type,
            text: shape.text || "",
            x: shape.x,
            y: shape.y,
            fill: shape.fill || "",
            width: shape.width || 0,
            height: shape.height || 0,
            font: shape.fontFamily || "Helvetica",
            fontSize: String(Number(shape.fontSize) || 14),
            image_src: shape.image_src || "",
            tables: [],
            group: group || "",
            source_table_name: shape.source_table_name || "",
            column_filter: shape.column_filter || "",
            text_column: shape.text_column || "",
            group_type: shape.category || "default",
            position: shape.position || "absolute",
            repeating: shape.repeating || "N",
            repeating_per_page: shape.repeating_per_page || "N",
          };

          return [baseItem];
        }),
      })),
    };

    console.log(payload, "payload to save");

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
      const pages = masterplanDataById.pages ?? [];

      // Set default artboard ID
      const artboardMap: { [id: string]: any[] } = {};

      const menuList = pages.map((page: any, index: number) => {
        const pageId = String(index + 1);
        const shapes = (page.items || []).map((item: any, i: number) => {
          const shape: any = {
            id: `${pageId}-${i}`,
            type: item.type,
            x: item.x,
            y: item.y,
            width: item.width ?? 100,
            height: item.height ?? 50,
            text: item.text || "",
            text_column: item.text_column || "",
            source_table_name: item.source_table_name || "",
            table_cd: item.table_cd || "",
            column_filter: item.column_filter || "",
            fontFamily: item.font || "Helvetica",
            fontSize: item.font_size ? Number(item.font_size) : 14,
            image_src: item.image_src || "",
            tables: item.tables || [],
          };
          if (shape.type === "table" && Array.isArray(item.tables)) {
            shape.labels = item.tables.map((t: any, idx: number) => ({
              id: `lbl-${Date.now()}-${idx}`,
              text: t.header || "",
              labelX: Number(t.x ?? 0),
              labelY: Math.max(0, Math.min(shape.height ?? 50, 16)), // default Y (tidak ada di spec), biar kelihatan
              fontSize: 16,
              fontFamily: "Arial",
              source_table_name: shape.source_table_name || "",
              text_column: t.text_column || "",
              table_cd: shape.table_cd || "",
              column_filter: shape.column_filter || "",
              type: "text",
            }));
          }
          return shape;
        });

        artboardMap[pageId] = shapes;

        return {
          id: pageId,
          title: `Page ${page.page_number}`,
          icon: Layout,
          children: shapes.map((s: any) => ({
            title: s.text || s.type || "Untitled",
            url: `#${s.id}`,
            icon: Layout,
          })),
        };
      });

      setArtboardShapes(artboardMap);
      setMenuItems(menuList);
      setInitialArtboardShapes(artboardMap);
      setInitialMenuItems(menuList);
      setActiveArtboardId(Object.keys(artboardMap)[0] || "1");
      setIsSubmitted(true);

      // Set metadata
      setEntityCode(masterplanDataById.entity_cd || "");
      setProjectCode(masterplanDataById.project_no || "");
      setSelectedMasterplan({
        masterplan_no: masterplanDataById.document_template_id,
        masterplan_name: masterplanDataById.document_template_name,
      });
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
                company?.map((e: any) => ({
                  label: e.company_name,
                  value: e.company_cd,
                })) || []
              }
              placeholder="Select Company"
              value={entityCode}
              onChange={(val) => {
                setEntityCode(val);
                const found = company?.find((e: any) => e.company_cd === val);
                setSelectedEntity(found || null);
                setProjectCode(""); // reset projectCode saat entity berubah
                setSelectedProject(null);
              }}
            />

            {/* Project Selector */}
            {/* <BasicCombobox
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
            /> */}
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
                  console.log(found, "found masterplan");
                  setSelectedMasterplan(found.name || null);
                }}
                onDelete={(id) => {
                  requestAnimationFrame(() => {
                    const found = masterplans?.find((m: any) => m.id === id);
                    setPendingDeleteId(id);
                    setPendingDeleteLabel(found?.label || "");
                    setDeleteDialogOpen(true);
                  });
                }}
                disabled={!entityCode || isLoadingMasterplans}
              />

              <Button
                className="flex items-center justify-center w-1/8"
                onClick={() => setIsCreatingNewSiteplan(true)}
                disabled={!entityCode}
              >
                Create New Siteplan
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              disabled={!selectedMasterplan}
              onClick={() => {
                if (selectedMasterplan) {
                  router.push(
                    `/en/site-plan-editor?document_id=${selectedMasterplan}&company_cd=${entityCode}`,
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
              onSelectLabel={(tableId, labelId) => {
                setSelectedId(tableId);
                setSelectedLabel({ tableId, labelId });
              }}
              textFilter={textFilter}
              setTextFilter={setTextFilter}
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
                tableDataDB={tableDataDB}
                companyCode={company_cd}
                projectCode={projectCode}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                selectedShape={selectedShapeForSidebar}
                onUpdateSelected={handleUpdateSelected}
                onSelectLabel={(tableId, labelId) => {
                  setSelectedId(tableId); // transformer tetap di rect table
                  setSelectedLabel({ tableId, labelId }); // sidebar tahu label mana
                }}
                group={group}
                setGroup={setGroup}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
