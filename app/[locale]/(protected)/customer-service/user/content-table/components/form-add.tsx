"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRolesByModules, insertMasterUser } from "@/action/master-user-action";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Loader2 } from "lucide-react";

const schema = z.object({
  userName: z.string().min(2, { message: "This field is required." }),
  userEmail: z.string().min(2, { message: "This field is required." }),
  userRole: z.object({
    value: z.string().min(1, { message: "This field is required." }),
    label: z.string().min(1, { message: "This field is required." }),
  }),
  moduleName: z.string().optional()
});
export const FormAdd = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const animatedComponents = makeAnimated();
  const styles = {
    multiValue: (base: any, state: any) => {
      return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
    },
    multiValueLabel: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, color: "#626262", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base: any, state: any) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoading(true);
      const result = await insertMasterUser(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["cs-user"],
        });
        reset()
        setIsModalOpen(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    const payload: any = {
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole.label,
      userRoleId: data.userRole.value,
      moduleName: 'Customer Service'
    };
    mutation.mutate(payload);
  }
  const { data, isLoading: isLoadingRole } = useQuery({
    queryKey: ["role-list"],
    queryFn: async () => {
      const result = await getRolesByModules('Customer%20Service')
      return result
    }
  })
  if (isLoading || isLoadingRole) {
    // return (
    //   <div className=" h-screen flex items-center flex-col space-y-2">
    //     <span className=" inline-flex gap-1  items-center">
    //       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //       Loading...
    //     </span>
    //   </div>
    // );
    null
  }
  const rolesOptions = data?.data.map((role: any) => ({
    value: role.id, // or use `role.id` if unique ID is preferred
    label: role.name
  })) || [];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add User</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.userName,
                })}
              >
                Name
              </Label>
              <Input
                {...register("userName")}
                type="text"
                id="userName"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.userName,
                })}
              />
              {errors.userName && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.userName,
                  })}
                >
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="userEmail"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.userEmail,
                })}
              >
                Email
              </Label>
              <Input
                {...register("userEmail")}
                type="email"
                id="userEmail"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.userEmail,
                })}
              />
              {errors.userEmail && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.userEmail,
                  })}
                >
                  {errors.userEmail.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="userRole"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.userRole,
                })}
              >
                Role
              </Label>
              <Select
                {...register("userRole")}
                id="userRole"
                isClearable={false}
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={rolesOptions}
                styles={styles}
                onChange={(newValue, actionMeta) => {
                  setValue("userRole", newValue as any);
                }}
                className={cn("react-select", {
                  "border-destructive focus:border-destructive":
                    errors.userRole,
                })}
                classNamePrefix="select"
                placeholder="Choose Role"
              />
              {errors.userRole && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.userRole,
                  })}
                >
                  {errors.userRole.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            {!isLoading && (
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogClose>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
