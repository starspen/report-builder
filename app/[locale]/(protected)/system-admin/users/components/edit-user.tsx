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
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartments, getDivisions } from "@/action/property-actions";
import Select from "react-select";
import { useEffect } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const UserRole = {
  user: "user",
  administrator: "administrator",
} as const;

const schema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    role: z.enum(["user", "administrator"], {
      required_error: "Role is required",
    }),
    division: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "user") {
        return data.division && data.department;
      }
      return !data.division && !data.department;
    },
    {
      message: "Division and Department are required for user",
      path: ["role"],
    },
  );

interface EditUserProps {
  userData: {
    name: string;
    email: string;
    role: "user" | "administrator";
    div_cd?: string;
    dept_cd?: string;
  };
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const selectStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: "36px",
    height: "36px",
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--input))",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 12px",
    height: "34px",
  }),
  input: (base: any) => ({
    ...base,
    margin: "0",
    padding: "0",
    color: "hsl(var(--foreground))",
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: "34px",
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
  option: (base: any, state: { isFocused: boolean }) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: state.isFocused
      ? "hsl(var(--accent))"
      : "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 50,
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--input))",
  }),
};

const EditUser = ({ userData, open, setOpen }: EditUserProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userData.name,
      role: userData.role,
      division: userData.div_cd || null,
      department: userData.dept_cd || null,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole === "administrator") {
      setValue("division", null);
      setValue("department", null);
    }
  }, [selectedRole, setValue]);

  const { data: divisions } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => (await getDivisions()).data,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await getDepartments()).data,
  });

  if (!divisions || !departments) return null;

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
    try {
      const reqBody = {
        email: userData.email,
        div_cd: data.division,
        dept_cd: data.department,
        ...data,
      };

      const response = await fetch("/api/user/update", {
        method: "PUT",
        body: JSON.stringify(reqBody),
      });

      const result = await response.json();
      if (result.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["user-list"] });
        setOpen(false);
        toast.success("User updated successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update user");
    } 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit User</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm">
            Edit user information.
          </DialogDescription>

          <div className="flex flex-col gap-4 pb-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input {...register("name")} className="dark:text-white" />
              {errors.name && (
                <div className="text-xs text-destructive">
                  {errors.name.message as string}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={userData.email} disabled className="bg-muted" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select
                options={Object.values(UserRole).map((role) => ({
                  value: role,
                  label: role,
                }))}
                onChange={(option) =>
                  setValue("role", option?.value as "user" | "administrator")
                }
                defaultValue={{
                  value: userData.role,
                  label: userData.role,
                }}
                styles={selectStyle}
              />
              {errors.role && (
                <div className="text-xs text-destructive">
                  {errors.role.message as string}
                </div>
              )}
            </div>

            {selectedRole === "user" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Division</Label>
                  <Select
                    options={divisionOptions}
                    onChange={(option) =>
                      setValue("division", option?.value || null)
                    }
                    defaultValue={
                      userData.div_cd
                        ? divisionOptions.find(
                            (opt: { value: string; label: string }) =>
                              opt.value === userData.div_cd,
                          )
                        : null
                    }
                    isClearable
                    styles={selectStyle}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Department</Label>
                  <Select
                    options={departmentOptions}
                    onChange={(option) =>
                      setValue("department", option?.value || null)
                    }
                    defaultValue={
                      userData.dept_cd
                        ? departmentOptions.find(
                            (opt: { value: string; label: string }) =>
                              opt.value === userData.dept_cd,
                          )
                        : null
                    }
                    isClearable
                    styles={selectStyle}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
