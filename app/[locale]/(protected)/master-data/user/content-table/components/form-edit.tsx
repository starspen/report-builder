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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMasterUser } from "@/action/master-user-action";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Task } from "./columns";

const schema = z.object({
  userId: z.string().optional(),
  userName: z.string().min(2, { message: "This field is required." }),
  userEmail: z.string().min(2, { message: "This field is required." }),
  userRole: z.object({
    value: z.string().min(1, { message: "This field is required." }),
    label: z.string().min(1, { message: "This field is required." }),
  }),
  range: z
    .array(
      z.object({ value: z.string(), label: z.string() })
    )
    .optional(),
});

export const FormEdit = ({
  setIsModalOpen,
  row,
  range,
}: {
  setIsModalOpen: (value: boolean) => void;
  row: Task;
  range: Task[]; // list of amt_range objects
}) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();
  const animatedComponents = makeAnimated();
  const styles = {
    multiValue: (base: any, state: any) =>
      state.data.isFixed ? { ...base, opacity: "0.5" } : base,
    multiValueLabel: (base: any, state: any) =>
      state.data.isFixed ? { ...base, color: "#626262", paddingRight: 6 } : base,
    multiValueRemove: (base: any, state: any) =>
      state.data.isFixed ? { ...base, display: "none" } : base,
    option: (provided: any) => ({ ...provided, fontSize: "14px" }),
  };

  const rolesOptions = [
    { value: "administrator", label: "Administrator" },
    { value: "maker and blaster", label: "Maker & Blaster" },
    { value: "maker", label: "Maker" },
    { value: "blaster", label: "Blaster" },
    { value: "approver", label: "Approver" },
  ];

  // build range options from `range` prop
  const rangeOptions = range.map((r) => ({
    value: r.rowID,
    label: `${r.min}-${r.max}`,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      userId: row.user_id,
      userEmail: row.email,
      userName: row.name,
      userRole: { value: row.role, label: row.role },
      range: row.amt_range?.map((a) => ({ value: a.rowID, label: `${a.min}-${a.max}` })),
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setIsLoadingSubmit(true);
      return updateMasterUser(data);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["master-user"] });
        setIsModalOpen(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => toast.error(error.message),
    onSettled: () => setIsLoadingSubmit(false),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    // build payload
    const payload: any = {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole.value,
    };
    // include amt_range for approver
    if (data.userRole.value === "approver") {
      payload.amt_range = data.range?.map((r) => ({ id: r.value }));
    }
    mutation.mutate(payload);
  }

  // show range selector only if role === approver
  const selectedRole = watch("userRole");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("userId")} type="hidden" />

          <div className="space-y-2">
            <Label htmlFor="userName" className={cn({ "text-destructive": errors.userName })}>
              Name
            </Label>
            <Input {...register("userName")} id="userName" />
            {errors.userName && <p className="text-xs text-destructive">{errors.userName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userEmail" className={cn({ "text-destructive": errors.userEmail })}>
              Email
            </Label>
            <Input {...register("userEmail")} id="userEmail" />
            {errors.userEmail && <p className="text-xs text-destructive">{errors.userEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userRole" className={cn({ "text-destructive": errors.userRole })}>
              Role
            </Label>
            <Select
              id="userRole"
              options={rolesOptions}
              defaultValue={{ value: row.role, label: row.role }}
              components={animatedComponents}
              styles={styles}
              onChange={(opt) => setValue("userRole", opt as any)}
            />
            {errors.userRole && <p className="text-xs text-destructive">{errors.userRole.message}</p>}
          </div>

          {/* {selectedRole?.value === "approver" && (
            <div className="space-y-2">
              <Label htmlFor="range">Approval Ranges</Label>
              <Select
                id="range"
                isMulti
                options={rangeOptions}
                defaultValue={row.amt_range?.map((a) => ({ value: a.rowID, label: `${a.min}-${a.max}` }))}
                components={animatedComponents}
                styles={styles}
                onChange={(opts) => setValue("range", opts as any)}
              />
            </div>
          )} */}

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingSubmit}>
              {isLoadingSubmit ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
