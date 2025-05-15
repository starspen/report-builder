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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepartments, getDivisions } from "@/action/property-actions";
import Select from "react-select";
import { useEffect, useState } from "react";


const schema = () =>
  z
    .object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters." }),
      email: z
        .string(),
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
  userData: any;
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
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema()),
  });


  async function onSubmit(data: any) {
    try {
      const reqBody = {
        ...data,
      };
      const response = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();
      if (result.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["module-list"] });
        toast.success(result.message);
        reset();
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add user");
    }
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Model</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription className="text-sm">Add a new user to the system.</DialogDescription> */}
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="" className="dark:text-white" />
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

