"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createCSMasterLocation,
} from "@/action/customer-service-master";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Schema validasi untuk form location
const locationFormSchema = z.object({
  location_cd: z
    .string()
    .min(1, { message: "Location code harus diisi" })
    .max(10, { message: "Location code maksimal 10 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface NewLocationFormProps {
  user?: any;
}

export default function NewLocationForm({ user }: NewLocationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      location_cd: "",
      descs: "",
    },
  });

  // Mutation untuk create location
  const createMutation = useMutation({
    mutationFn: createCSMasterLocation,
    onSuccess: (data) => {
      toast.success("Location berhasil ditambahkan");

      // Reset form dan clear semua field
      reset({
        location_cd: "",
        descs: "",
      });

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data location
      queryClient.invalidateQueries({
        queryKey: ["cs-master-location"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah location");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        location_cd: "",
        descs: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: LocationFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const locationData = {
        location_cd: data.location_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS",
      };

      // Kirim data ke API
      createMutation.mutate(locationData);
    } catch (error) {
      toast.error("Gagal menambah location");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-blue-500/80 px-2 text-white hover:bg-blue-500/90 lg:px-3"
          disabled={createMutation.isPending}
        >
          <PlusIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          New Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Enter information for the new location
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="location_cd"
                className={cn({
                  "text-destructive": errors.location_cd,
                })}
              >
                Location Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location_cd"
                placeholder="JKT"
                {...register("location_cd")}
                className={cn({
                  "border-destructive": errors.location_cd,
                })}
                disabled={createMutation.isPending}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("location_cd").onChange(e);
                }}
              />
              {errors.location_cd && (
                <p className="text-xs text-destructive">
                  {errors.location_cd.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="descs"
                className={cn({
                  "text-destructive": errors.descs,
                })}
              >
                Description <span className="text-destructive">*</span>
              </Label>
              <Input
                id="descs"
                placeholder="Deskripsi location"
                {...register("descs")}
                className={cn({
                  "border-destructive": errors.descs,
                })}
                disabled={createMutation.isPending}
              />
              {errors.descs && (
                <p className="text-xs text-destructive">
                  {errors.descs.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
