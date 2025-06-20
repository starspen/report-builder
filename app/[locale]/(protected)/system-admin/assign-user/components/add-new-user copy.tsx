"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getDepartments, getDivisions } from "@/action/property-actions";
import {
  getModules,
  getRoles,
  insertMasterUser,
} from "@/action/master-user-action"; // assume these exist
import { useEffect, useState } from "react";

const UserRole = {
  user: "user",
  administrator: "administrator",
} as const;

type ModuleOption = { value: string; label: string };
type RoleOption = ModuleOption & { module_id: string };

const selectStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: "36px",
    height: "36px",
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--input))",
  }),
  // ... your other style overrides
};

const schema = (existingEmails: string[]) =>
  z
    .object({
      name: z.string().min(3, { message: "Name must be at least 3 characters." }),
      email: z
        .string()
        .email({ message: "Your email is invalid." })
        .refine((email) => !existingEmails.includes(email), {
          message: "Email already exists.",
        }),
      role: z.enum(["user", "administrator"], {
        required_error: "Role is required",
      }),
      // modules & roles only required if role === "user"
      modules: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
        .optional(),
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
      (d) => d.role !== UserRole.user || (d.modules && d.modules.length > 0),
      {
        path: ["modules"],
        message: "At least one module must be selected",
      }
    )
    .refine(
      (d) =>
        d.role !== UserRole.user ||
        !d.roles ||
        d.roles.every((r) => d.modules!.some((m) => m.value === r.module_id)),
      {
        path: ["roles"],
        message: "All chosen roles must belong to one of the selected modules",
      }
    );

export default function AddNewUser({
  existingEmails,
  setOpen,
}: {
  existingEmails: string[];
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const { data: moduleList = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ["module-list"],
    queryFn: async () => {
      const result = await getModules();
      return result.data;
    },
  });

  const { data: roleList = [], isLoading: isRolesLoading } = useQuery({
    queryKey: ["role-list"],
    queryFn: async () => {
      const result = await getRoles();
      return result.data;
    },
  });

  // if (isModulesLoading || isRolesLoading) return (
  //   <>
  //   </>
  // )

  // console.log(moduleList)

  const moduleOptions: ModuleOption[] = moduleList.map((m: any) => ({
    value: m.id,
    label: m.name,
  }));
  const roleOptions: RoleOption[] = roleList.map((r: any) => ({
    value: r.id,
    module_id: r.module_id,
    label: r.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<z.infer<ReturnType<typeof schema>>>({
    resolver: zodResolver(schema(existingEmails)),
  });

  const selectedRole = watch("role");
  const selectedModules = watch("modules") || [];
  const allowedModuleIds = new Set(selectedModules.map((m) => m.value));
  const filteredRoleOptions = roleOptions.filter((r) =>
    allowedModuleIds.has(r.module_id)
  );

  // auto-remove roles when modules change
  useEffect(() => {
    const curr = watch("roles") || [];
    const updated = curr.filter((r: RoleOption) =>
      allowedModuleIds.has(r.module_id)
    );
    if (updated.length !== curr.length) {
      setValue("roles", updated);
    }
  }, [selectedModules]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await insertMasterUser(data);
      return result;
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: (result: any) => {
      if (result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user-list"] });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSettled: () => {
      reset();
      setOpen(false);
      setIsSubmitting(false);
    },
  });

  async function onSubmit(data: any) {
    const payload = {
      div_cd: data.division,
      dept_cd: data.department,
      userRole: data.role,
      userName: data.name,
      userEmail: data.email,
      // only include modules & roles if role === "user"
      ...(data.role === UserRole.user
        ? {
            module: data.modules.map((m: ModuleOption) => ({
              id: m.value,
              name: m.label,
            })),
            role: data.roles.map((r: RoleOption) => ({
              id: r.value,
              module_id: r.module_id,
              name: r.label,
            })),
          }
        : {}),
    };
    mutation.mutate(payload);
  }

  const animated = makeAnimated();

  if (isRolesLoading || isModulesLoading){
    return (
      <div></div>
    )
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New User</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm">
          Add a new user to the system.
        </DialogDescription>

        <div className="flex flex-col gap-4 pb-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              placeholder="John Doe"
              className="dark:text-white"
            />
            {errors.name && (
              <div className={cn("text-xs", { "text-destructive": true })}>
                {errors.name.message as string}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
              {...register("email", { setValueAs: (v) => v.toLowerCase() })}
              placeholder="john.doe@example.com"
              className="dark:text-white"
            />
            {errors.email && (
              <div className={cn("text-xs", { "text-destructive": true })}>
                {errors.email.message as string}
              </div>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select
              options={Object.values(UserRole).map((r) => ({ value: r, label: r }))}
              onChange={(opt) => setValue("role", opt!.value)}
              placeholder="Select Role..."
              isClearable
              styles={selectStyle}
            />
            {errors.role && (
              <div className={cn("text-xs", { "text-destructive": true })}>
                {errors.role.message as string}
              </div>
            )}
          </div>

          {/* Modules & Roles only if Role === "user" */}
          {selectedRole === UserRole.user && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Modules</Label>
                <Controller
                  name="modules"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={moduleOptions}
                      components={animated}
                      placeholder="Select modules..."
                      onChange={(val) => field.onChange(val)}
                      styles={selectStyle}
                    />
                  )}
                />
                {errors.modules && (
                  <p className="text-xs text-destructive">
                    {errors.modules.message as string}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Roles</Label>
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      isDisabled={!selectedModules.length}
                      options={filteredRoleOptions}
                      placeholder={
                        selectedModules.length
                          ? "Select roles..."
                          : "Pick modules first"
                      }
                      components={animated}
                      onChange={(val) => field.onChange(val)}
                      styles={selectStyle}
                    />
                  )}
                />
                {errors.roles && (
                  <p className="text-xs text-destructive">
                    {errors.roles.message as string}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
