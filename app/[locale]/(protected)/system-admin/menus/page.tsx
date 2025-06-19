// File: app/modules/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignMenuToRole,
  createMenu,
  createRole,
  getModules,
} from "@/action/system-admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import AddMenuDialog from "./components/addMenu";
import AddRoleDialog from "./components/addRole";
import EditMenuDialog from "./components/editMenu";
import EditRoleDialog from "./components/editRole";
import DeleteMenuDialog from "./components/deleteMenu";
import DeleteRoleDialog from "./components/deleteRole";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";

export default function ModulesPage() {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddRole, setOpenAddRole] = useState(false);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [initialMenus, setInitialMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: modules,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["module-list"],
    queryFn: async () => {
      const result = await getModules();

      return result.data;
    },
  });

  useEffect(() => {
    if (!selectedModule && modules && modules.length > 0) {
      setSelectedModule(modules[0]);
    }
  }, [modules, selectedModule]);

  useEffect(() => {
    if (selectedModule) {
      setSelectedRole(null);
      setSelectedMenus([]);
      setInitialMenus([]);
    }
  }, [selectedModule]);

  useEffect(() => {
    if (!selectedModule) return;

    const updatedModule = modules.find(
      (m: { id: any }) => m.id === selectedModule.id
    );
    if (!updatedModule) return;

    setSelectedModule(updatedModule);

    if (selectedRole) {
      const updatedRole = updatedModule.roles.find(
        (r: { id: any }) => r.id === selectedRole.id
      );
      setSelectedRole(updatedRole || null);
      if (updatedRole) {
        const menuIds = updatedRole.menusAvailable.map((m: any) => m.menu_id);
        setSelectedMenus(menuIds);
        setInitialMenus(menuIds);
      } else {
        // if that role no longer exists, clear menus
        setSelectedMenus([]);
        setInitialMenus([]);
      }
    }
  }, [modules]);

  // when you click a role, populate its menusAvailable
  useEffect(() => {
    if (selectedRole) {
      const ids = selectedRole.menusAvailable.map((m: any) => m.menu_id);
      setSelectedMenus(ids);
      setInitialMenus(ids);
    }
  }, [selectedRole]);

  // 3) assign menus to role
  const assignMut = useMutation({
    mutationFn: async ({
      role_id,
      menu_ids,
    }: {
      role_id: string;
      menu_ids: { id: string }[];
    }) => {
      const result = await assignMenuToRole({ role_id, menu_ids });
      return result;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success("Success assigning menu to role");
        queryClient.invalidateQueries({
          queryKey: ["module-list"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (err: any) => toast.error(err.message),
    onSettled: () => {
      setLoading(false);
    },
  });
  const handleCancel = () => {
    setSelectedMenus([...initialMenus]);
  };

  // toggle menu selection
  const toggleMenu = (id: string) =>
    setSelectedMenus((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  if (isLoading) return <div className="p-4">Loading modules...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Error loading modules</div>;

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard/home">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dashboard/home">System Admin</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Menus</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex h-full">
          {/* Sidebar */}
          <aside className="w-1/4 border-r p-4 space-y-2 overflow-auto">
            <h2 className="font-semibold">All Modules</h2>
            <ul>
              {modules.map((m: { id: string; name: string }) => (
                <li
                  key={m.id}
                  onClick={() => {
                    setSelectedModule(m);
                    setSelectedRole(null);
                  }}
                  className={`p-2 rounded cursor-pointer ${
                    selectedModule?.id === m.id
                      ? "bg-default-100 font-semibold"
                      : "hover:bg-default-200"
                  }`}
                >
                  {m.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main pane */}
          <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">{selectedModule?.name}</h1>

            <div className="grid grid-cols-2 gap-6">
              {/* Roles Panel */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-medium">Roles</h2>
                  {selectedModule && (
                    <AddRoleDialog moduleId={selectedModule.id} />
                  )}
                </div>
                {selectedModule?.roles.length ? (
                  <ul className="space-y-1">
                    {selectedModule.roles.map((r: any) => (
                      <li
                        key={r.id}
                        className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${
                          selectedRole?.id === r.id
                            ? "bg-default-100 font-semibold"
                            : "hover:bg-default-200"
                        }`}
                        onClick={() => setSelectedRole(r)}
                      >
                        <span>{r.name}</span>
                        <div className="flex space-x-2">
                          <EditRoleDialog
                            role={r}
                            moduleId={selectedModule.id}
                          />
                          <DeleteRoleDialog
                            role={r}
                            moduleId={selectedModule.id}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No roles yet.</p>
                )}
              </section>

              {/* Menus Panel */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-medium">Menus</h2>
                  {selectedModule && (
                    <AddMenuDialog moduleId={selectedModule.id} />
                  )}
                </div>
                {selectedModule?.menus.length ? (
                  <ul className="space-y-1">
                    {selectedModule.menus.map((m: any) => (
                      <li
                        key={m.id}
                        className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${
                          !selectedRole
                            ? "opacity-50 cursor-not-allowed"
                            : selectedMenus.includes(m.id)
                            ? "bg-default-100 font-semibold"
                            : "hover:bg-default-200"
                        }`}
                        onClick={() => selectedRole && toggleMenu(m.id)}
                      >
                        <span>{m.name}</span>
                        <div className="flex space-x-2">
                          <EditMenuDialog
                            menu={m}
                            moduleId={selectedModule.id}
                          />
                          <DeleteMenuDialog
                            menu={m}
                            moduleId={selectedModule.id}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No menus yet.</p>
                )}

                {!arraysEqual(selectedMenus, initialMenus) && (
                  <div className="mt-4 space-x-2">
                    <Button
                      className="relative"
                      onClick={() =>
                        assignMut.mutate({
                          role_id: selectedRole.id,
                          menu_ids: selectedMenus.map((id) => ({ id })),
                        })
                      }
                      disabled={loading}
                    >
                      Update
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </main>
        </CardContent>
      </Card>
    </>
  );
}

// helper to compare two arrays of strings
function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v) => b.includes(v));
}
