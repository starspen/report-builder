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
  createCSMasterComplainSource,
  validateComplainSourceData,
} from "@/action/customer-service-master";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Schema validasi untuk form complain source - sesuai dengan DTO
const complainSourceFormSchema = z.object({
  complain_source: z
    .string()
    .min(1, { message: "Complain source harus diisi" })
    .max(20, { message: "Complain source maksimal 20 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type ComplainSourceFormValues = z.infer<typeof complainSourceFormSchema>;

interface NewComplainSourceFormProps {
  user?: any;
}

export default function NewComplainSourceForm({ user }: NewComplainSourceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplainSourceFormValues>({
    resolver: zodResolver(complainSourceFormSchema),
    defaultValues: {
      complain_source: "",
      descs: "",
    },
  });

  // Mutation untuk create complain source
  const createMutation = useMutation({
    mutationFn: createCSMasterComplainSource,
    onSuccess: (data) => {
      toast.success("Complain source berhasil ditambahkan");

      // Reset form dan clear semua field
      reset({
        complain_source: "",
        descs: "",
      });

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data complain source
      queryClient.invalidateQueries({
        queryKey: ["cs-master-complain-source"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah complain source");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        complain_source: "",
        descs: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ComplainSourceFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const complainSourceData = {
        complain_source: data.complain_source.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS", // Sesuaikan dengan user yang login
      };

      // Validasi data menggunakan function dari action
      const validationErrors = validateComplainSourceData(complainSourceData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      createMutation.mutate(complainSourceData);
    } catch (error) {
      toast.error("Gagal menambah complain source");
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
          New Complain Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Complain Source</DialogTitle>
            <DialogDescription>
              Enter information for the new complain source
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="complain_source"
                className={cn({
                  "text-destructive": errors.complain_source,
                })}
              >
                Complain Source <span className="text-destructive">*</span>
              </Label>
              <Input
                id="complain_source"
                placeholder="TELP"
                {...register("complain_source")}
                className={cn({
                  "border-destructive": errors.complain_source,
                })}
                disabled={createMutation.isPending}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("complain_source").onChange(e);
                }}
              />
              {errors.complain_source && (
                <p className="text-xs text-destructive">
                  {errors.complain_source.message}
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
                placeholder="Deskripsi complain source"
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
              {createMutation.isPending ? "Adding..." : "Add Complain Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
