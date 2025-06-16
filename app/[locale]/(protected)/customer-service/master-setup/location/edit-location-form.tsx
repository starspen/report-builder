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
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import {
  updateCSMasterLocation,
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

interface EditLocationFormProps {
  locationData: {
    location_cd: string;
    descs: string;
    rowID: string;
  };
  user?: any;
}

export default function EditLocationForm({ locationData, user }: EditLocationFormProps) {
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
      location_cd: locationData.location_cd,
      descs: locationData.descs,
    },
  });

  // Mutation untuk update location
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCSMasterLocation(id, data),
    onSuccess: (data) => {
      toast.success("Location berhasil diupdate");

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data location
      queryClient.invalidateQueries({
        queryKey: ["cs-master-location"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate location");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        location_cd: locationData.location_cd,
        descs: locationData.descs,
      });
    }
  }, [isOpen, reset, locationData]);

  const onSubmit = async (data: LocationFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        location_cd: data.location_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS", // Sesuaikan dengan user yang login
      };

      // Kirim data ke API
      updateMutation.mutate({
        id: Number(locationData.rowID),
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate location");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
          disabled={updateMutation.isPending}
        >
          <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Edit Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update information for the selected location
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
                disabled={updateMutation.isPending}
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
                disabled={updateMutation.isPending}
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
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}