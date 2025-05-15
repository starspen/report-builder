// File: app/modules/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignMenuToRole, createMenu, createRole, getModules } from '@/action/system-admin-action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import AddMenuDialog from './components/addMenu';
import AddRoleDialog from './components/addRole';

export default function ModulesPage() {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openAddRole, setOpenAddRole] = useState(false)
  const [openAddMenu, setOpenAddMenu] = useState(false)
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [selectedMenus, setSelectedMenus] = useState<string[]>([])
  const [initialMenus, setInitialMenus] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { data: modules, isLoading, isError } = useQuery({
    queryKey: ["module-list"],
    queryFn: async () => {
      const result = await getModules()

      return result.data
    },
  });


  useEffect(() => {
    if (!selectedModule && modules && modules.length > 0) {
      setSelectedModule(modules[0])
    }
  }, [modules, selectedModule])

  useEffect(() => {
    if (selectedModule) {
      const updated = modules.find((m: { id: any; }) => m.id === selectedModule.id)
      if (updated) setSelectedModule(updated)
    }
  }, [modules])

  // when you click a role, populate its menusAvailable
  useEffect(() => {
    if (selectedRole) {
      const ids = selectedRole.menusAvailable.map((m: any) => m.menu_id)
      setSelectedMenus(ids)
      setInitialMenus(ids)
    }
  }, [selectedRole])


  // mutations

  // 1) create role
  const addRoleMut = useMutation({
    mutationFn: async ({
      module_id,
      name
    }: {
      module_id: string;
      name: string
    }) => {
      const result = await createRole({ module_id, name });
      return result
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success("Success adding role");
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
  })

  // 2) create menu
  const addMenuMut = useMutation({
    mutationFn: async ({
      module_id,
      name
    }: {
      module_id: string;
      name: string
    }) => {
      const result = await createMenu({ module_id, name });
      return result
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success("Success adding menu");
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
  })

  // 3) assign menus to role
  const assignMut = useMutation({
    mutationFn: async ({
      role_id,
      menu_ids
    }: {
      role_id: string;
      menu_ids: { id: string }[]
    }) => {
      const result = await assignMenuToRole({ role_id, menu_ids });
      return result
    },
    onMutate: () => {
      setLoading(true)
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
  })
  const handleCancel = () => {
    setSelectedMenus([...initialMenus])
  }

  // toggle menu selection
  const toggleMenu = (id: string) =>
    setSelectedMenus(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  if (isLoading) return <div className="p-4">Loading modules...</div>
  if (isError) return <div className="p-4 text-red-600">Error loading modules</div>

  return (
    <Card className="space-y-6">
      <CardHeader><CardTitle>Modules</CardTitle></CardHeader>
      <CardContent className="p-0 flex h-full">
        {/* Sidebar */}
        <aside className="w-1/4 border-r p-4 space-y-2 overflow-auto">
          <h2 className="font-semibold">All Modules</h2>
          <ul>
            {modules.map((m: { id: string; name: string }) => (
              <li
                key={m.id}
                onClick={() => { setSelectedModule(m); setSelectedRole(null); }}
                className={`p-2 rounded cursor-pointer ${selectedModule?.id === m.id
                  ? 'bg-blue-50 font-semibold'
                  : 'hover:bg-gray-100'
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
                {selectedModule && <AddRoleDialog moduleId={selectedModule?.id} />}
              </div>

              {selectedModule?.roles.length ? (
                <ul className="space-y-1">
                  {selectedModule.roles.map((r: any) => (
                    <li
                      key={r.id}
                      onClick={() => setSelectedRole(r)}
                      className={`px-4 py-2 border rounded cursor-pointer ${selectedRole?.id === r.id ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-100'
                        }`}
                    >
                      {r.name}
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
                {selectedModule && <AddMenuDialog
                  moduleId={selectedModule?.id}
                />}
              </div>

              {selectedModule?.menus.length ? (
                <ul className="space-y-1">
                  {selectedModule.menus.map((menu: any) => (
                    <li
                      key={menu.id}
                      onClick={() => toggleMenu(menu.id)}
                      className={`px-4 py-2 border rounded cursor-pointer flex items-center space-x-2 ${selectedMenus.includes(menu.id) ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-100'
                        }`}
                    >
                      {menu.name}
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
                    onClick=
                    {() => {
                      const roleId = selectedRole?.id;
                      const moduleId = selectedModule?.id;
                      assignMut.mutate(
                        {
                          role_id: roleId,
                          menu_ids: selectedMenus.map((id) => ({ id })),
                        },
                        {
                          onSuccess: (result) => {
                            if (result.statusCode === 200 || result.statusCode === 201) {
                              toast.success("Success assigning menu to role");
                              queryClient.invalidateQueries({ queryKey: ["module-list"] }).then(() => {
                                const updatedModule = queryClient.getQueryData<any[]>(["module-list"])?.find((m) => m.id === moduleId);
                                setSelectedModule(updatedModule || null);
                                setSelectedRole(updatedModule?.roles.find((r: { id: any; }) => r.id === roleId) || null);
                              });
                            } else toast.error(result.message);
                          }
                        }
                      );
                    }}
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
  )
}

// helper to compare two arrays of strings
function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every(v => b.includes(v))
}

