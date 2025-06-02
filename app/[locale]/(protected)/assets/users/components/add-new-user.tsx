"use client";
import { useForm } from "react-hook-form";
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
import { getDepartments, getDivisions } from "@/action/property-actions";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getRolesByModules, insertMasterUser } from "@/action/master-user-action";
import { Loader2 } from "lucide-react";

const UserRole = {
  user: "user",
  administrator: "administrator",
} as const;

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
      role: z.object({
        value: z.string().min(1, { message: "This field is required." }),
        label: z.string().min(1, { message: "This field is required." }),
      }),
      division: z.string().nullable().optional(),
      department: z.string().nullable().optional(),
    })
    .refine(
      (data) => {
        if (data.role.label === "Asset User") {
          return Boolean(data.division) && Boolean(data.department);
        }
        return !data.division && !data.department;
      },
      {
        message: "Division and Department are required for Asset User",
        path: ["role"],
      }
    );

   

const selectStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: '36px',
    height: '36px',
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--input))',
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '0 12px',
    height: '34px',
  }),
  input: (base: any) => ({
    ...base,
    margin: '0',
    padding: '0',
    color: 'hsl(var(--foreground))',
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '34px',
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: '14px',
    color: 'hsl(var(--muted-foreground))',
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '14px',
    color: 'hsl(var(--foreground))',
  }),
  option: (base: any, state: { isFocused: boolean }) => ({
    ...base,
    fontSize: '14px',
    backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 50,
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--input))',
  }),
};

const AddNewUser = ({ existingEmails, setOpen }: { existingEmails: string[], setOpen: (open: boolean) => void }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema(existingEmails)),
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole === "administrator") {
      setValue("division", null);
      setValue("department", null);
    }
  }, [selectedRole, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await insertMasterUser(data)
      return result
    },
    onMutate: () => {
      setIsSubmitting(true)
    },
    onSuccess: (result) => {
      if (result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["asset-user"] })
      }
      else {
        toast.error(result.message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      reset(); 
      setOpen(false);
      setIsSubmitting(false)
    }
  })

  const {
    data: divisions,
    isLoading: isDivisionsLoading,
    isError: isDivisionsError,
  } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => (await getDivisions()).data,
  });

  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await getDepartments()).data,
  });
  const { data: roles, isLoading: isLoadingRole, error: isRoleError } = useQuery({
    queryKey: ["role-list"],
    queryFn: async () => {
      const result = await getRolesByModules('Fixed%20Asset')
      return result
    }
  })
  if (isDivisionsLoading || isDepartmentsLoading) return null;
  if (isDivisionsError || isDepartmentsError) return null;
  if (isLoadingRole || isRoleError) return null;

  const divisionOptions = divisions.map(
    ({ div_cd, descs }: { div_cd: string; descs: string }) => ({
      value: div_cd,
      label: descs,
    }),
  );
  const departmentOptions = departments.map(
    ({ dept_cd, descs }: { dept_cd: string; descs: string }) => ({
      value: dept_cd,
      label: descs,
    }),
  );

  async function onSubmit(data: any) {
    const reqBody = {
      div_cd: data.division,
      dept_cd: data.department,
      moduleName: 'Fixed Asset',
      userRole: data.role.label,
      userRoleId: data.role.value,
      userName: data.name,
      userEmail: data.email,
      // ...data,
    };
    if (reqBody) {
      mutation.mutate(reqBody)
    }
  }


  const rolesOptions = roles?.data.map((role: any) => ({
    value: role.id, // or use `role.id` if unique ID is preferred
    label: role.name
  })) || [];

  const watchedRole = watch("role");

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New User</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm">Add a new user to the system.</DialogDescription>
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="John Doe" className="dark:text-white" />
            {errors.name && (
              <div
                className={cn("text-xs", {
                  "text-destructive": errors.name,
                })}
              >
                {errors.name.message as string}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input {...register("email", {
              setValueAs: (value) => value.toLowerCase(),
            })} placeholder="john.doe@example.com" className="dark:text-white" />
            {errors.email && (
              <div
                className={cn("text-xs", {
                  "text-destructive": errors.email,
                })}
              >
                {errors.email.message as string}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select
              options={rolesOptions}
              onChange={(newValue, actionMeta) => {
                setValue("role", newValue as any);
              }}
              // onChange={(option) => setValue("role", option?.value)}
              placeholder="Select Role..."
              isClearable
              styles={selectStyle}
            />
            {errors.role && (
              <div
                className={cn("text-xs", {
                  "text-destructive": errors.role,
                })}
              >
                {errors.role.message as string}
              </div>
            )}
          </div>

          {watchedRole?.label === "Asset User" && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Division</Label>
                <Select
                  options={divisionOptions}
                  onChange={(option: { value: string; label: string } | null) =>
                    setValue("division", option?.value || null)
                  }
                  isClearable
                  placeholder="Select Division..."
                  styles={selectStyle}
                />
                {errors.division && (
                  <div
                    className={cn("text-xs", {
                      "text-destructive": errors.division,
                    })}
                  >
                    {errors.division.message as string}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Department</Label>
                <Select
                  options={departmentOptions}
                  onChange={(option: { value: string; label: string } | null) =>
                    setValue("department", option?.value || null)
                  }
                  isClearable
                  placeholder="Select Department..."
                  styles={selectStyle}
                />
                {errors.department && (
                  <div
                    className={cn("text-xs", {
                      "text-destructive": errors.department,
                    })}
                  >
                    {errors.department.message as string}
                  </div>
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
};

export default AddNewUser;
