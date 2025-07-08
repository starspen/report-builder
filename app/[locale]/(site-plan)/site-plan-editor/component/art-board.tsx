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
}

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
}) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [artboardCount, setArtboardCount] = useState(2);
  const [artboardId, setArtboardId] = useState("2");
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toggleSidebar } = useSidebar();

  const handleToggle = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};

    menuItems.forEach((item) => {
      if (item.children && item.children.length > 0) {
        newOpenMenus[item.title] = true; // otomatis buka jika ada child
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [menuItems]);

  const handleAddArtboard = () => {
    // Cari ID dan count tertinggi dari menuItems
    const lastId = menuItems.reduce((max, item) => {
      const idNum = parseInt(item.id, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    const newId = (lastId + 1).toString();
    const newTitle = `Artboard ${lastId + 1}`;
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

  const handleDeleteArtboard = (id: string) => {
    setMenuItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      // Jika yang dihapus adalah artboard aktif
      if (activeArtboardId === id && updated.length > 0) {
        setActiveArtboardId(updated[0].id); // pindahkan ke artboard pertama yang tersisa
      } else if (updated.length === 0) {
        setActiveArtboardId(""); // kosongkan
      }

      return updated;
    });

    setArtboardShapes((prev) => {
      const newShapes = { ...prev };
      delete newShapes[id];
      return newShapes;
    });

    // Hapus juga selectedId kalau id-nya dari artboard yang dihapus
    if (artboardShapes[id]?.some((shape) => shape.id === selectedId)) {
      setSelectedId(null);
    }
  };

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

  function truncate(str: string, max: number) {
    return str.length > max ? str.slice(0, max) + "..." : str;
  }

  useEffect(() => {
    const handleToggle = () => toggleSidebar();
    document.addEventListener("toggle-left-sidebar", handleToggle);
    return () => {
      document.removeEventListener("toggle-left-sidebar", handleToggle);
    };
  }, [toggleSidebar]);

  return (
    <div className="flex">
      <Sidebar className="mr-0">
        <SidebarGroup>
          <SidebarGroupLabel>Artboard</SidebarGroupLabel>
          <SidebarGroupAction
            title="Add new artboard"
            onClick={handleAddArtboard}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Plus />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new artboard</p>
              </TooltipContent>
            </Tooltip>
          </SidebarGroupAction>
          <SidebarGroupContent />
        </SidebarGroup>
        <SidebarMenu>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <SidebarMenuItem
                onMouseEnter={() => setHoveredMenuId(item.id)}
                onMouseLeave={() => setHoveredMenuId(null)}
                onClick={() => setActiveArtboardId(item.id)}
                className={activeArtboardId === item.id ? "bg-gray-100" : ""}
              >
                <SidebarMenuButton
                  onClick={() => handleToggle(item.title)}
                  className="flex items-center w-full justify-between"
                >
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
                            if (e.key === "Enter") handleEditSave(item.id);
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
                        {/* Trash tetap tampil saat edit */}
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
                        {truncate(item.title, 18)}
                        {item.icon === Layout && hoveredMenuId === item.id && (
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
                    {item.children &&
                      item.children.length > 0 &&
                      (openMenus[item.title] ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-2 h-4 w-4" />
                      ))}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {openMenus[item.title] &&
                item.children.map((child) => {
                  const isActive = selectedId === child.url.replace("#", "");
                  const Icon = child.icon;
                  return (
                    <SidebarMenuItem key={child.url}>
                      <a
                        href={child.url}
                        onClick={(e) => {
                          e.preventDefault();
                          const shapeId = child.url.replace("#", "");
                          setActiveArtboardId(item.id);
                          setSelectedId(shapeId);
                        }}
                        className={`block w-full rounded px-3 py-1 text-sm ${
                          isActive
                            ? "bg-primary-100 text-primary font-semibold pl-8"
                            : "text-muted-foreground hover:text-primary pl-8"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          {child.title}
                        </div>
                      </a>
                    </SidebarMenuItem>
                  );
                })}
            </React.Fragment>
          ))}
        </SidebarMenu>
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
