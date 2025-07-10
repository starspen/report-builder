// MasterplanSidebar.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Layout,
  Plus,
  Trash,
  Pencil,
  Check,
  X,
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
} from "@/components/ui/sidebar";
import { Shape } from "./toolbar";

export type Lot = {
  id: string;
  title: string;
  shapes: Shape[];
};

export type Block = {
  id: string;
  title: string;
  shapes: Shape[];
  lots: Lot[];
};

export type Masterplan = {
  id: string;
  title: string;
  shapes: Shape[];
  blocks: Block[];
};

type Props = {
  masterplans: Masterplan[];
  setMasterplans: React.Dispatch<React.SetStateAction<Masterplan[]>>;
  activeMasterplanId: string | null;
  activeBlockId: string | null;
  activeLotId: string | null;
  activeType: "masterplan" | "block" | "lot" | null;
  setActiveMasterplanId: (id: string | null) => void;
  setActiveBlockId: (id: string | null) => void;
  setActiveLotId: (id: string | null) => void;
  setActiveType: (type: "masterplan" | "block" | "lot") => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  leftSidebarOpen: boolean;
};

const MasterplanSidebar: React.FC<Props> = ({
  masterplans,
  setMasterplans,
  activeMasterplanId,
  activeBlockId,
  activeLotId,
  activeType,
  setActiveMasterplanId,
  setActiveBlockId,
  setActiveLotId,
  setActiveType,
  selectedId,
  setSelectedId,
  leftSidebarOpen,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAddMasterplan = () => {
    const id = Date.now().toString();
    setMasterplans((prev) => [
      ...prev,
      { id, title: `Masterplan ${prev.length + 1}`, shapes: [], blocks: [] },
    ]);
  };

  const handleAddBlock = (mpId: string) => {
    setMasterplans((prev) =>
      prev.map((mp) =>
        mp.id === mpId
          ? {
              ...mp,
              blocks: [
                ...mp.blocks,
                {
                  id: Date.now().toString(),
                  title: `Block ${mp.blocks.length + 1}`,
                  shapes: [],
                  lots: [],
                },
              ],
            }
          : mp
      )
    );
  };

  const handleAddLot = (mpId: string, blockId: string) => {
    setMasterplans((prev) =>
      prev.map((mp) => {
        if (mp.id !== mpId) return mp;
        return {
          ...mp,
          blocks: mp.blocks.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  lots: [
                    ...b.lots,
                    {
                      id: Date.now().toString(),
                      title: `Lot ${b.lots.length + 1}`,
                      shapes: [],
                    },
                  ],
                }
              : b
          ),
        };
      })
    );
  };

  const handleRename = (id: string, level: "masterplan" | "block" | "lot") => {
    setMasterplans((prev) =>
      prev.map((mp) => {
        if (level === "masterplan" && mp.id === id) {
          return { ...mp, title: editValue };
        }
        const updatedBlocks = mp.blocks.map((b) => {
          if (level === "block" && b.id === id) {
            return { ...b, title: editValue };
          }
          const updatedLots = b.lots.map((l) =>
            level === "lot" && l.id === id ? { ...l, title: editValue } : l
          );
          return { ...b, lots: updatedLots };
        });
        return { ...mp, blocks: updatedBlocks };
      })
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id: string, level: "masterplan" | "block" | "lot") => {
    setMasterplans(
      (prev) =>
        prev
          .map((mp) => {
            if (level === "masterplan" && mp.id === id) return null;
            const filteredBlocks = mp.blocks
              .map((b) => {
                if (level === "block" && b.id === id) return null;
                const filteredLots = b.lots.filter(
                  (l) => !(level === "lot" && l.id === id)
                );
                return { ...b, lots: filteredLots };
              })
              .filter(Boolean) as Block[];
            return { ...mp, blocks: filteredBlocks };
          })
          .filter(Boolean) as Masterplan[]
    );
  };

  return (
    <Sidebar className="mr-0">
      <SidebarGroup>
        <SidebarGroupLabel>Masterplans</SidebarGroupLabel>
        <SidebarGroupAction
          title="Add Masterplan"
          onClick={handleAddMasterplan}
        >
          <Plus />
        </SidebarGroupAction>
        <SidebarGroupContent />
      </SidebarGroup>
      <SidebarMenu>
        {masterplans.map((mp) => (
          <React.Fragment key={mp.id}>
            <SidebarMenuItem
              onMouseEnter={() => setHoveredId(mp.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                setActiveMasterplanId(mp.id);
                setActiveBlockId(null);
                setActiveLotId(null);
                setActiveType("masterplan");
              }}
              className={
                activeType === "masterplan" && activeMasterplanId === mp.id
                  ? "bg-gray-100"
                  : ""
              }
            >
              <SidebarMenuButton className="flex items-center justify-between w-full">
                <span className="flex items-center">
                  <Layout className="mr-2" />
                  {editingId === mp.id ? (
                    <>
                      <input
                        className="border px-1 py-0.5 rounded text-sm w-32"
                        value={editValue}
                        autoFocus
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleRename(mp.id, "masterplan")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleRename(mp.id, "masterplan");
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(mp.id, "masterplan");
                        }}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                      <button onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      {mp.title}
                      {hoveredId === mp.id && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(mp.id);
                              setEditValue(mp.title);
                            }}
                          >
                            <Pencil className="w-4 h-4 text-gray-400 ml-2" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(mp.id, "masterplan");
                            }}
                          >
                            <Trash className="w-4 h-4 text-red-500 ml-2" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddBlock(mp.id);
                            }}
                          >
                            <Plus className="w-4 h-4 text-blue-500 ml-2" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {mp.blocks.map((b) => (
              <React.Fragment key={b.id}>
                <SidebarMenuItem
                  className="pl-4"
                  onClick={() => {
                    setActiveMasterplanId(mp.id);
                    setActiveBlockId(b.id);
                    setActiveLotId(null);
                    setActiveType("block");
                  }}
                >
                  <SidebarMenuButton className="flex justify-between w-full">
                    <span>{b.title}</span>
                    <span className="flex gap-1">
                      <Plus
                        className="w-4 h-4 text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddLot(mp.id, b.id);
                        }}
                      />
                      <Trash
                        className="w-4 h-4 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(b.id, "block");
                        }}
                      />
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {b.lots.map((l) => (
                  <SidebarMenuItem
                    key={l.id}
                    className="pl-8"
                    onClick={() => {
                      setActiveMasterplanId(mp.id);
                      setActiveBlockId(b.id);
                      setActiveLotId(l.id);
                      setActiveType("lot");
                    }}
                  >
                    {l.title}
                    <Trash
                      className="w-4 h-4 text-red-500 ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(l.id, "lot");
                      }}
                    />
                  </SidebarMenuItem>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
};

export default MasterplanSidebar;
