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

const UserRole = {
  user: "user",
  administrator: "administrator",
} as const;

const schema = (existingEmails: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters." }),
      email: z
        .string()
        .email({ message: "Your email is invalid." })
        .refine((email) => !existingEmails.includes(email), {
          message: "Email already exists.",
        }),
      role: z.enum(["user", "administrator"], {
        required_error: "Role is required",
      }),
    })

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
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema(existingEmails)),
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole === "administrator") {
      setValue("division", null);
      setValue("department", null);
    }
  }, [selectedRole, setValue]);


  async function onSubmit(data: any) {
    try {
      const reqBody = {
        div_cd: data.division,
        dept_cd: data.department,
        ...data,
      };
      const response = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();
      if (result.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["user-list"] });
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
            })} placeholder="john.doe@example.com" className="dark:text-white"/>
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
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: role,
              }))}
              onChange={(option) => setValue("role", option?.value)}
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
