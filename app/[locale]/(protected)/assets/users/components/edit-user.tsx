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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartments, getDivisions } from "@/action/property-actions";
import Select from "react-select";
import { useEffect } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getRolesByModules, updateMasterUser } from "@/action/master-user-action";

const UserRole = {
  user: "user",
  administrator: "administrator",
} as const;

const schema = (userData: string[]) => z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
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
      return true;
    },
    {
      message: "Division and Department are required for Asset User",
      path: ["role"],
    }
  );

interface EditUserProps {
  // userData: {
  //   name: string;
  //   email: string;
  //   role: "user" | "administrator";
  //   div_cd?: string;
  //   dept_cd?: string;
  // };
  userData: any;
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
  console.log(userData)
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: userData.name,
      role: userData.roles[0],
      division: userData.div_cd || null,
      department: userData.dept_cd || null,
    },
    resolver: zodResolver(schema(userData.roles)),
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole === "administrator") {
      setValue("division", null);
      setValue("department", null);
    }
  }, [selectedRole, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await updateMasterUser(data)
      return result
    },
    onMutate: () => {
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
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
    }
  })

  const { data: divisions } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => (await getDivisions()).data,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await getDepartments()).data,
  });

  const {
    data: roles,
    isLoading: isLoadingRole,
    error: isRoleError,
  } = useQuery({
    queryKey: ["role-list"],
    queryFn: async () => {
      const result = await getRolesByModules("Fixed%20Asset");
      return result;
    },
  });

  useEffect(() => {
    if (divisions && departments && roles) {
      const divisionOptions = divisions.map(
        ({ div_cd, descs }: { div_cd: string; descs: string }) => ({
          value: div_cd,
          label: descs,
        })
      );
      const departmentOptions = departments.map(
        ({ dept_cd, descs }: { dept_cd: string; descs: string }) => ({
          value: dept_cd,
          label: descs,
        })
      );
      const rolesOptions =
        roles?.data.map((role: any) => ({
          value: role.id, // or use `role.id` if unique ID is preferred
          label: role.name,
        })) || [];

      // find the matching option objects
      const defaultRole = rolesOptions.find((opt: { value: string, label: string }) => opt.label === userData.roles[0]);
      const defaultDiv = userData.div_cd
        ? divisionOptions.find(
          (opt: { value: string; label: string }) =>
            opt.value === userData.div_cd
        )
        : null;
      const defaultDept = userData.dept_cd
        ? departmentOptions.find(
          (opt: { value: string; label: string }) =>
            opt.value === userData.dept_cd
        )
        : null;

      reset({
        name: userData.name,
        role: defaultRole || { value: "", label: "" },
        division: defaultDiv?.value || null,
        department: defaultDept?.value || null,
      });
    }
  }, [divisions, departments, roles, reset, userData]);

  if (!divisions || !departments || !roles) return null;

  const divisionOptions = divisions.map(
    ({ div_cd, descs }: { div_cd: string; descs: string }) => ({
      value: div_cd,
      label: descs,
    })
  );

  const departmentOptions = departments.map(
    ({ dept_cd, descs }: { dept_cd: string; descs: string }) => ({
      value: dept_cd,
      label: descs,
    })
  );
  const rolesOptions =
    roles?.data.map((role: any) => ({
      value: role.id,
      label: role.name,
    })) || [];


  const watchedRole = watch("role");
  async function onSubmit(data: any) {
    const isAssetUser = data.role.label === "Asset User";
    const reqBody = {
      div_cd: isAssetUser ? data.division : null,
      dept_cd: isAssetUser ? data.department : null,
      moduleName: 'Fixed Asset',
      userRole: data.role.label,
      userRoleId: data.role.value,
      userName: data.name,
      userEmail: data.email,
      userId: userData.id
      // ...data,
    };
    if (reqBody) {
      mutation.mutate(reqBody)
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
                options={rolesOptions}
                value={watch("role")}
                onChange={(opt) => setValue("role", opt as any)}
                placeholder="Select Role..."
                isClearable
                styles={selectStyle}
              />
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message as string}</p>
              )}
            </div>

            {watchedRole?.label === "Asset User" && (
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
                            opt.value === userData.div_cd
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
                            opt.value === userData.dept_cd
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
