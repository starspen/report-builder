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
import { createCSMasterSection, validateSectionData } from "@/action/customer-service-master";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Schema validasi untuk form section - sesuaikan dengan API
const sectionFormSchema = z.object({
  section_cd: z
    .string()
    .min(1, { message: "Section code harus diisi" })
    .max(4, { message: "Section code maksimal 4 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface NewSectionFormProps {
  user?: any; // Untuk mendapatkan audit_user
}

export default function NewSectionForm({ user }: NewSectionFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
  });

  // Mutation untuk create section
  const createMutation = useMutation({
    mutationFn: createCSMasterSection,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['cs-master-sections'] });
      reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: SectionFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const sectionData = {
        section_cd: data.section_cd.toUpperCase(),
        descs: data.descs,
        audit_user: "WEBCS",
      };

      // Validasi data
      const validationErrors = validateSectionData(sectionData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      createMutation.mutate(sectionData);
    } catch (error) {
      toast.error("Gagal menambah section");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-primary/80 px-2 text-white hover:bg-primary/90 lg:px-3"
        >
          <PlusIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Section Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi section yang akan ditambahkan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="section_cd"
                className={cn({
                  "text-destructive": errors.section_cd,
                })}
              >
                Section Code
              </Label>
              <Input
                id="section_cd"
                placeholder="Contoh: IT, HR, FIN"
                {...register("section_cd")}
                className={cn({
                  "border-destructive": errors.section_cd,
                })}
                disabled={createMutation.isPending}
              />
              {errors.section_cd && (
                <p className="text-xs text-destructive">
                  {errors.section_cd.message}
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
                Description
              </Label>
              <Input
                id="descs"
                placeholder="Deskripsi section"
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
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}