"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { assignUserToRole } from "@/action/master-user-action";
import makeAnimated from "react-select/animated";

/** ---- validation schema ---- **/
const schema = z
  .object({
    modules: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .min(1, { message: "At least one module must be selected" }),
    roles: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          module_id: z.string(),
        })
      )
      .optional(),
  })
  .refine(
    (d) =>
      !d.roles ||
      d.roles.every((r) =>
        d.modules.some((m) => m.value === r.module_id)
      ),
    {
      path: ["roles"],
      message: "All chosen roles must belong to one of the selected modules",
    }
  );

interface ModuleOption {
  value: string;
  label: string;
}

interface RoleOption extends ModuleOption {
  module_id: string;
}

interface EditUserProps {
  userData: {
    id: string;
    name: string;
    email: string;
    moduleList: Array<{ id: string; name: string }>;
    roleList: Array<{ id: string; module_id: string; name: string }>;
    module: Array<{ id: string; name: string }>;
    roles: Array<{ id: string; module_id: string; name: string }>;
  };
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUser({
  userData,
  open,
  setOpen,
}: EditUserProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      modules: userData.module.map((m) => ({
        value: m.id,
        label: m.name,
      })),
      roles: userData.roles.map((r) => ({
        value: r.id,
        module_id: r.module_id,
        label: r.name,
      })),
    },
  });

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  // All possible options
  const moduleOptions: ModuleOption[] = userData.moduleList.map((m) => ({
    value: m.id,
    label: m.name,
  }));
  const roleOptions: RoleOption[] = userData.roleList.map((r) => ({
    value: r.id,
    module_id: r.module_id,
    label: r.name,
  }));

  // Watch selected modules to filter roles
  const selectedModules = watch("modules") || [];
  const allowedModuleIds = new Set(selectedModules.map((m) => m.value));
  const filteredRoleOptions = roleOptions.filter((r) =>
    allowedModuleIds.has(r.module_id)
  );

  // Auto-remove roles if module is unselected
  useEffect(() => {
    const currentRoles = watch("roles") || [];
    const updatedRoles = currentRoles.filter((r: RoleOption) =>
      allowedModuleIds.has(r.module_id)
    );
    if (updatedRoles.length !== currentRoles.length) {
      setValue("roles", updatedRoles);
    }
  }, [selectedModules]);

  const animatedComponents = makeAnimated();

  // Shared styles for expanding and scrollable multi-selects
  const dynamicStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "auto",
      height: "auto",
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--input))",
    }),
    valueContainer: (base: any) => ({
      ...base,
      flexWrap: "wrap",
      height: "auto",
      padding: "4px 8px",
    }),
    multiValue: (base: any, state: any) =>
      state.data.isFixed ? { ...base, opacity: "0.5" } : base,
    multiValueLabel: (base: any, state: any) =>
      state.data.isFixed ? { ...base, color: "#626262", paddingRight: 6 } : base,
    multiValueRemove: (base: any, state: any) =>
      state.data.isFixed ? { ...base, display: "none" } : base,
    option: (provided: any) => ({ ...provided, fontSize: "14px" }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: "14px",
      color: "hsl(var(--muted-foreground))",
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: "14px",
      color: "hsl(var(--foreground))",
    }),
  };

  const mutation = useMutation({
    mutationFn: async (data: {
      user_id: string;
      module: { id: string; name: string }[];
      role: { id: string; module_id: string; name: string }[];
    }) => {
      const result = await assignUserToRole(data);
      return result;
    },
    onMutate: () => {
      setIsLoadingSubmit(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoadingSubmit(false);
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    const payload = {
      user_id: userData.id,
      module: data.modules.map((m) => ({
        id: m.value,
        name: m.label,
      })),
      role: (data.roles || []).map((r) => ({
        id: r.value,
        module_id: r.module_id,
        name: r.label,
      })),
    };
    mutation.mutate(payload);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Assign user</DialogTitle>
            <DialogDescription className="text-sm"></DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input value={userData.name} disabled />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input value={userData.email} disabled />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Modules</Label>
              <Controller
                name="modules"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={moduleOptions}
                    placeholder="Select modules..."
                    onChange={(val) => field.onChange(val)}
                    components={animatedComponents}
                    styles={dynamicStyles}
                  />
                )}
              />
              {errors.modules && (
                <p className="text-xs text-destructive">
                  {errors.modules.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Roles</Label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={filteredRoleOptions}
                    placeholder={
                      selectedModules.length
                        ? "Select roles..."
                        : "Pick modules first"
                    }
                    isDisabled={!selectedModules.length}
                    onChange={(val) => field.onChange(val)}
                    components={animatedComponents}
                    styles={dynamicStyles}
                  />
                )}
              />
              {errors.roles && (
                <p className="text-xs text-destructive">
                  {errors.roles.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}