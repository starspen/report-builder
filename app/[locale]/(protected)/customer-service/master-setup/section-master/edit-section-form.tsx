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
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCSMasterSection, validateSectionData } from "@/action/customer-service-master";

// Schema validasi untuk form section - sesuaikan dengan API
const sectionFormSchema = z.object({
  section_cd: z
    .string()
    .min(1, { message: "Section code harus diisi" })
    .max(10, { message: "Section code maksimal 10 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(100, { message: "Deskripsi maksimal 100 karakter" }),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface EditSectionFormProps {
  sectionData: {
    section_cd: string;
    descs: string;
    rowID: string;
  };
  session?: any;
}

export default function EditSectionForm({ sectionData, session }: EditSectionFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  console.log({ sectionData });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      section_cd: sectionData.section_cd,
      descs: sectionData.descs,
    },
  });

  useEffect(() => {
    reset({
      section_cd: sectionData.section_cd,
      descs: sectionData.descs,
    });
  }, [sectionData, reset]);

  // Mutation untuk update section
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCSMasterSection(id, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['cs-master-sections'] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: SectionFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        section_cd: data.section_cd,
        descs: data.descs,
        audit_user: session?.user?.name || session?.user?.email || "SYSTEM",
      };

      // Validasi data
      const validationErrors = validateSectionData(updateData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      updateMutation.mutate({
        id: Number(sectionData.rowID),
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate section");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
        >
          <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Edit Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update informasi section yang dipilih
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
                {...register("section_cd")}
                className={cn({
                  "border-destructive": errors.section_cd,
                })}
                disabled={updateMutation.isPending}
                placeholder="Contoh: IT, HR, FIN"
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
                {...register("descs")}
                className={cn({
                  "border-destructive": errors.descs,
                })}
                disabled={updateMutation.isPending}
                placeholder="Deskripsi section"
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
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 