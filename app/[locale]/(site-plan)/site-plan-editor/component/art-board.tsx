"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Layout,
  Plus,
  Trash,
  Pencil,
  Check,
  X,
  ChevronLeft,
  PanelLeft,
  Square,
  CircleIcon,
  CircleDashed,
  ImageIcon,
  PenLine,
} from "lucide-react";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shape } from "./toolbar";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableMenuItem from "./sortable-menu-item";

type ArtboardChild = {
  title: string;
  url: string;
  icon?: React.ElementType;
};

export type ArtboardMenuItem = {
  id: string;
  title: string;
  icon: React.ElementType;
  children: ArtboardChild[];
};

interface MasterplanType {
  masterplan_no: string;
  masterplan_name: string;
}

interface ArtBoardProps {
  activeArtboardId: string;
  setActiveArtboardId: (id: string) => void;
  artboardShapes: { [id: string]: any[] };
  menuItems: ArtboardMenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<ArtboardMenuItem[]>>;
  setArtboardShapes: React.Dispatch<
    React.SetStateAction<{ [id: string]: any[] }>
  >;
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  leftSidebarOpen: boolean;
  selectedMasterplan: MasterplanType | null;
  openMenus: { [key: string]: boolean };
  setOpenMenus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  handleDeleteArtboard: (id: string) => void;
  handleEditChild: (
    artboardId: string,
    childId: string,
    newTitle: string
  ) => void;
  handleDeleteChild: (artboardId: string, childId: string) => void;
}

export type Lot = {
  id: string;
  title: string;
  shapes: Shape[];
};

export type Block = {
  id: string;
  title: string;
  shapes: Shape[]; // ✅ block bisa punya shapes
  lots: Lot[];
};

export type Masterplan = {
  id: string;
  title: string;
  shapes: Shape[]; // ✅ masterplan juga bisa punya shapes (misalnya image)
  blocks: Block[];
};

const ArtBoard: React.FC<ArtBoardProps> = ({
  activeArtboardId,
  setActiveArtboardId,
  artboardShapes,
  menuItems,
  setMenuItems,
  setArtboardShapes,
  setSelectedId,
  selectedId,
  leftSidebarOpen,
  selectedMasterplan,
  openMenus,
  setOpenMenus,
  handleDeleteArtboard,
  handleEditChild,
  handleDeleteChild,
}) => {
  const [artboardCount, setArtboardCount] = useState(2);
  const [artboardId, setArtboardId] = useState("2");
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editChildValue, setEditChildValue] = useState("");
  const [hoveredChildId, setHoveredChildId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [wasOpenBeforeDrag, setWasOpenBeforeDrag] = useState<{
    [id: string]: boolean;
  }>({});

  const { toggleSidebar } = useSidebar();

  const handleToggle = (id: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setOpenMenus((prev) => {
      const updated = { ...prev };

      menuItems.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (updated[item.id] === undefined) {
            updated[item.id] = true; // hanya set auto open kalau belum ada state
          }
        }
      });

      return updated;
    });
  }, [menuItems]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    setDraggingItemId(active.id);

    // Simpan status semua item (apakah open atau tidak)
    const snapshot: { [id: string]: boolean } = {};
    menuItems.forEach((item) => {
      snapshot[item.id] = openMenus[item.id] ?? false;
    });
    setWasOpenBeforeDrag(snapshot);

    // Collapse item yang sedang di-drag
    setOpenMenus((prev) => ({
      ...prev,
      [active.id]: false,
    }));
  };

  const handleAddArtboard = () => {
    // Cari ID dan count tertinggi dari menuItems
    const lastId = menuItems.reduce((max, item) => {
      const idNum = parseInt(item.id, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    const newId = (lastId + 1).toString();
    const newTitle = `Masterplan ${lastId + 1}`;
    // Tambahkan item baru
    setMenuItems((prev) => [
      ...prev,
      {
        id: newId,
        title: newTitle,
        icon: Layout,
        children: [],
      },
    ]);
    setArtboardShapes((prev) => ({
      ...prev,
      [newId]: [],
    }));
    setActiveArtboardId(newId);
    setArtboardCount(lastId + 1);
    setArtboardId(newId);
  };

  // const handleDeleteArtboard = (id: string) => {
  //   setMenuItems((prevMenuItems) => {
  //     const updatedMenuItems = prevMenuItems.filter((item) => item.id !== id);

  //     // Jika yang dihapus adalah artboard aktif
  //     if (activeArtboardId === id && updatedMenuItems.length > 0) {
  //       setActiveArtboardId(updatedMenuItems[0].id);
  //     } else if (updatedMenuItems.length === 0) {
  //       setActiveArtboardId("");
  //     }

  //     // Gabungkan update artboardShapes di sini
  //     setArtboardShapes((prevArtboardShapes) => {
  //       const newShapes = { ...prevArtboardShapes };
  //       delete newShapes[id];
  //       return newShapes;
  //     });

  //     // Hapus juga selectedId kalau id-nya dari artboard yang dihapus
  //     if (artboardShapes[id]?.some((shape) => shape.id === selectedId)) {
  //       setSelectedId(null);
  //     }

  //     return updatedMenuItems;
  //   });
  // };

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: editValue } : item
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  function truncate(str: any, max: number) {
    return str.length > max ? str.slice(0, max) + "..." : str;
  }

  useEffect(() => {
    const handleToggle = () => toggleSidebar();
    document.addEventListener("toggle-left-sidebar", handleToggle);
    return () => {
      document.removeEventListener("toggle-left-sidebar", handleToggle);
    };
  }, [toggleSidebar]);

  const getShapeIcon = (type: string) => {
    switch (type) {
      case "rect":
        return Square;
      case "circle":
        return CircleIcon;
      case "ellipse":
        return CircleDashed;
      case "polygon":
        return PenLine;
      case "image":
        return ImageIcon;
      case "group":
        return Layout;
      default:
        return Layout;
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setDraggingItemId(null);

    // Tidak berpindah posisi, tidak perlu reorder
    if (!over || active.id === over.id) return;

    const oldIndex = menuItems.findIndex((item) => item.id === active.id);
    const newIndex = menuItems.findIndex((item) => item.id === over.id);

    // Lakukan reorder
    setMenuItems((items) => arrayMove(items, oldIndex, newIndex));

    // Tutup semua dropdown setelah reorder
    setOpenMenus((prev) => ({ ...prev }));
  };

  return (
    <div className="flex">
      <Sidebar className="mr-0 overflow-y-auto max-h-screen">
        <SidebarGroup>
          <SidebarGroupLabel>
            {selectedMasterplan?.masterplan_name || "Masterplan"}
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={handleAddArtboard}>
             <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent />
        </SidebarGroup>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menuItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <SidebarMenu>
              {menuItems.map((item) => {
                const shapes = artboardShapes[item.id] || [];
                return (
                  <React.Fragment key={item.id}>
                    <SortableMenuItem id={item.id}>
                      <SidebarMenuItem
                        onMouseEnter={() => setHoveredMenuId(item.id)}
                        onMouseLeave={() => setHoveredMenuId(null)}
                        onClick={() => setActiveArtboardId(item.id)}
                        className={
                          activeArtboardId === item.id ? "bg-gray-100" : ""
                        }
                      >
                        <SidebarMenuButton className="flex items-center w-full justify-between">
                          <span className="flex items-center">
                            <item.icon className="mr-2" />
                            {editingId === item.id ? (
                              <>
                                <input
                                  className="border px-1 py-0.5 rounded text-sm w-32"
                                  value={editValue}
                                  autoFocus
                                  onChange={handleEditChange}
                                  onBlur={() => handleEditSave(item.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleEditSave(item.id);
                                    if (e.key === "Escape") handleEditCancel();
                                  }}
                                />
                                <button
                                  type="button"
                                  title="Save"
                                  className="ml-1 text-green-600 hover:text-green-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave(item.id);
                                  }}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  title="Cancel"
                                  className="ml-1 text-gray-400 hover:text-gray-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCancel();
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete artboard"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteArtboard(item.id);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 transition-opacity"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                {truncate(item.title || "", 18)}
                                {item.icon === Layout &&
                                  hoveredMenuId === item.id && (
                                    <>
                                      <button
                                        type="button"
                                        title="Rename"
                                        className="ml-2 text-gray-400 hover:text-primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartEdit(item.id, item.title);
                                        }}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Delete artboard"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteArtboard(item.id);
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700 transition-opacity"
                                      >
                                        <Trash className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                              </>
                            )}
                          </span>
                          <span className="flex items-center">
                            {shapes.length > 0 &&
                              (openMenus[item.id] ? (
                                <ChevronDown
                                  className="ml-2 h-4 w-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(item.id);
                                  }}
                                />
                              ) : (
                                <ChevronRight
                                  className="ml-2 h-4 w-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(item.id);
                                  }}
                                />
                              ))}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Render shapes & groups */}
                      {openMenus[item.id] && (
                        <>
                          {/* Collapsible Block Group */}
                          {shapes.some((s) => s.category === "block") && (
                            <>
                              <SidebarMenuItem className="pl-4 font-semibold text-xs uppercase opacity-70">
                                <SidebarMenuButton
                                  className="w-full flex justify-between px-3 py-1 text-sm"
                                  onClick={() =>
                                    setOpenMenus((prev) => ({
                                      ...prev,
                                      [`block-group-${item.id}`]:
                                        !prev[`block-group-${item.id}`],
                                    }))
                                  }
                                >
                                  <span className="flex items-center gap-2">
                                    Block
                                  </span>
                                  {openMenus[`block-group-${item.id}`] !==
                                  false ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              {openMenus[`block-group-${item.id}`] !== false &&
                                shapes
                                  .filter(
                                    (shape) =>
                                      shape.category === "block" &&
                                      shape.type !== "group"
                                  )
                                  .map((shape) => {
                                    const isActive = selectedId === shape.id;
                                    const isEditing =
                                      editingChildId === shape.id;
                                    return (
                                      <SidebarMenuItem
                                        key={shape.id}
                                        onMouseEnter={() =>
                                          setHoveredChildId(shape.id)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredChildId(null)
                                        }
                                      >
                                        <a
                                          href={`#${shape.id}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setActiveArtboardId(item.id);
                                            setSelectedId(shape.id);
                                          }}
                                          className={`block w-full rounded px-3 py-1 text-sm pl-12 ${
                                            isActive
                                              ? "bg-primary-100 text-primary font-semibold"
                                              : "text-muted-foreground hover:text-primary"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            {React.createElement(
                                              getShapeIcon(shape.type),
                                              {
                                                className: "w-4 h-4",
                                              }
                                            )}
                                            {isEditing ? (
                                              <>
                                                <input
                                                  className="border px-1 py-0.5 rounded text-sm w-24"
                                                  value={editChildValue}
                                                  autoFocus
                                                  maxLength={18}
                                                  onChange={(e) =>
                                                    setEditChildValue(
                                                      e.target.value
                                                    )
                                                  }
                                                  onBlur={() => {
                                                    handleEditChild(
                                                      item.id,
                                                      shape.id,
                                                      editChildValue
                                                    );
                                                    setEditingChildId(null);
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      handleEditChild(
                                                        item.id,
                                                        shape.id,
                                                        editChildValue
                                                      );
                                                      setEditingChildId(null);
                                                    }
                                                    if (e.key === "Escape")
                                                      setEditingChildId(null);
                                                  }}
                                                />
                                                <button
                                                  type="button"
                                                  title="Save"
                                                  className="ml-1 text-green-600 hover:text-green-800"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditChild(
                                                      item.id,
                                                      shape.id,
                                                      editChildValue
                                                    );
                                                    setEditingChildId(null);
                                                  }}
                                                >
                                                  <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                  type="button"
                                                  title="Cancel"
                                                  className="ml-1 text-gray-400 hover:text-gray-600"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingChildId(null);
                                                  }}
                                                >
                                                  <X className="w-4 h-4" />
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                {truncate(
                                                  shape.title || "",
                                                  8
                                                ) || shape.type}
                                                {hoveredChildId ===
                                                  shape.id && (
                                                  <div className="flex items-center gap-1 ml-auto">
                                                    <button
                                                      type="button"
                                                      title="Edit"
                                                      className="ml-2 text-gray-400 hover:text-primary"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingChildId(
                                                          shape.id
                                                        );
                                                        setEditChildValue(
                                                          shape.title || ""
                                                        );
                                                      }}
                                                    >
                                                      <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      title="Delete"
                                                      className="ml-2 text-red-500 hover:text-red-700 transition-opacity"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChild(
                                                          item.id,
                                                          shape.id
                                                        );
                                                      }}
                                                    >
                                                      <Trash className="w-4 h-4" />
                                                    </button>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </a>
                                      </SidebarMenuItem>
                                    );
                                  })}
                            </>
                          )}

                          {/* Collapsible Unit Group */}
                          {shapes.some((s) => s.category === "unit") && (
                            <>
                              <SidebarMenuItem className="pl-4 font-semibold text-xs uppercase opacity-70">
                                <SidebarMenuButton
                                  className="w-full flex justify-between px-3 py-1 text-sm"
                                  onClick={() =>
                                    setOpenMenus((prev) => ({
                                      ...prev,
                                      [`unit-group-${item.id}`]:
                                        !prev[`unit-group-${item.id}`],
                                    }))
                                  }
                                >
                                  <span className="flex items-center gap-2">
                                    Unit
                                  </span>
                                  {openMenus[`unit-group-${item.id}`] !==
                                  false ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </>
                          )}

                          {/* Ungrouped Shapes */}
                          {shapes
                            .filter((s) => !s.category && s.type !== "group")
                            .map((shape) => {
                              const isActive = selectedId === shape.id;
                              const isEditing = editingChildId === shape.id;
                              return (
                                <SidebarMenuItem
                                  key={shape.id}
                                  onMouseEnter={() =>
                                    setHoveredChildId(shape.id)
                                  }
                                  onMouseLeave={() => setHoveredChildId(null)}
                                >
                                  <a
                                    href={`#${shape.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setActiveArtboardId(item.id);
                                      setSelectedId(shape.id);
                                    }}
                                    className={`block w-full rounded px-3 py-1 text-sm pl-12 ${
                                      isActive
                                        ? "bg-primary-100 text-primary font-semibold"
                                        : "text-muted-foreground hover:text-primary"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {React.createElement(
                                        getShapeIcon(shape.type),
                                        {
                                          className: "w-4 h-4",
                                        }
                                      )}
                                      {isEditing ? (
                                        <>
                                          <input
                                            className="border px-1 py-0.5 rounded text-sm w-24"
                                            value={editChildValue}
                                            autoFocus
                                            onChange={(e) =>
                                              setEditChildValue(e.target.value)
                                            }
                                            onBlur={() => {
                                              handleEditChild(
                                                item.id,
                                                shape.id,
                                                editChildValue
                                              );
                                              setEditingChildId(null);
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleEditChild(
                                                  item.id,
                                                  shape.id,
                                                  editChildValue
                                                );
                                                setEditingChildId(null);
                                              }
                                              if (e.key === "Escape")
                                                setEditingChildId(null);
                                            }}
                                          />
                                          <button
                                            type="button"
                                            title="Save"
                                            className="ml-1 text-green-600 hover:text-green-800"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditChild(
                                                item.id,
                                                shape.id,
                                                editChildValue
                                              );
                                              setEditingChildId(null);
                                            }}
                                          >
                                            <Check className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            title="Cancel"
                                            className="ml-1 text-gray-400 hover:text-gray-600"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingChildId(null);
                                            }}
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          {truncate(shape.title || "", 8) ||
                                            shape.type}
                                          {hoveredChildId === shape.id && (
                                            <div className="flex items-center gap-1 ml-auto">
                                              <button
                                                type="button"
                                                title="Edit"
                                                className="ml-2 text-gray-400 hover:text-primary flex "
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingChildId(shape.id);
                                                  setEditChildValue(
                                                    shape.title || ""
                                                  );
                                                }}
                                              >
                                                <Pencil className="w-4 h-4" />
                                              </button>
                                              <button
                                                type="button"
                                                title="Delete"
                                                className="ml-2 text-red-500 hover:text-red-700 transition-opacity"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteChild(
                                                    item.id,
                                                    shape.id
                                                  );
                                                }}
                                              >
                                                <Trash className="w-4 h-4" />
                                              </button>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </a>
                                </SidebarMenuItem>
                              );
                            })}
                        </>
                      )}
                    </SortableMenuItem>
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SortableContext>
          <DragOverlay>
            {draggingItemId ? (
              <div className="w-full px-2 py-1 bg-white shadow rounded border text-sm font-medium">
                {menuItems.find((item) => item.id === draggingItemId)?.title}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Sidebar>

      {/* <div className="flex-1 relative">
        <div
          onClick={toggleSidebar}
          className="absolute z-20 w-fit p-1 border-1 bg-[#fafafa] border border-l-0 top-0 hover:bg-gray-100 hover:cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="w-6 h-6" />
        </div>
      </div> */}
    </div>
  );
};

export default ArtBoard;
