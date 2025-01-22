"use client";

import { useEffect, useState } from "react";
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
import {
  getMasterUserById,
  updateMasterUser,
} from "@/action/master-user-action";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const schema = z.object({
  userId: z.string().optional(),
  userName: z.string().min(2, { message: "This field is required." }),
  userEmail: z.string().min(2, { message: "This field is required." }),
  userRole: z.object({
    value: z.string().min(1, { message: "This field is required." }),
    label: z.string().min(1, { message: "This field is required." }),
  }),
});
export const FormEdit = ({
  setIsModalOpen,
  selectedId,
}: {
  setIsModalOpen: (value: boolean) => void;
  selectedId: string;
}) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["master-user-id"],
    queryFn: async () => {
      const result = await getMasterUserById(selectedId);
      return result;
    },
  });

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
  const rolesOptions: { value: string; label: string }[] = [
    { value: "administrator", label: "Administrator" },
    { value: "maker and blaster", label: "Maker and Blaster" },
    { value: "approver", label: "Approver" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      userId: data?.data[0]?.user_id,
      userEmail: data?.data[0]?.email,
      userName: data?.data[0]?.name,
      userRole: {
        value: data?.data[0]?.role,
        label: data?.data[0]?.role,
      },
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoadingSubmit(true);
      const result = await updateMasterUser(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["master-user"],
        });
        setIsModalOpen(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoadingSubmit(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    mutation.mutate(data);
  }

  useEffect(() => {
    if (data) {
      setValue("userId", data?.data[0]?.user_id);
      setValue("userEmail", data?.data[0]?.email);
      setValue("userName", data?.data[0]?.name);
      setValue("userRole", {
        value: data?.data[0]?.role,
        label: data?.data[0]?.role,
      });
    }
  }, [data, setValue]);

  const defaultRole = data
    ? {
        value: data?.data[0]?.role,
        label: data?.data[0]?.role,
      }
    : null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <Input {...register("userId")} type="hidden" id="userId" readOnly />
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
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={rolesOptions}
                defaultValue={defaultRole}
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
            {!isLoadingSubmit && (
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogClose>
            )}

            <Button type="submit" disabled={isLoadingSubmit}>
              {isLoadingSubmit ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
