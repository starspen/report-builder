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
import { updateCSMasterCategoryGroup, validateCategoryGroupData } from "@/action/customer-service-master";

// Schema validasi untuk form category group - sesuaikan dengan API
const categoryGroupFormSchema = z.object({
  category_group_cd: z
    .string()
    .min(1, { message: "Category group code harus diisi" })
    .max(10, { message: "Category group code maksimal 10 karakter" })
    .regex(/^[A-Z0-9_-]+$/, { 
      message: "Category group code hanya boleh huruf besar, angka, dash, dan underscore" 
    }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type CategoryGroupFormValues = z.infer<typeof categoryGroupFormSchema>;

interface EditCategoryGroupFormProps {
  categoryGroupData: {
    category_group_cd: string;
    descs: string;
    rowID: string;
  };
  session?: any;
}

export default function EditCategoryGroupForm({ categoryGroupData, session }: EditCategoryGroupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  console.log({ categoryGroupData });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryGroupFormValues>({
    resolver: zodResolver(categoryGroupFormSchema),
    defaultValues: {
      category_group_cd: categoryGroupData.category_group_cd,
      descs: categoryGroupData.descs,
    },
  });

  useEffect(() => {
    reset({
      category_group_cd: categoryGroupData.category_group_cd,
      descs: categoryGroupData.descs,
    });
  }, [categoryGroupData, reset]);

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        category_group_cd: categoryGroupData.category_group_cd,
        descs: categoryGroupData.descs,
      });
    }
  }, [isOpen, reset, categoryGroupData]);

  // Mutation untuk update category group
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCSMasterCategoryGroup(id, data),
    onSuccess: (data) => {
      toast.success("Category group berhasil diupdate");
      
      // Reset form
      reset({
        category_group_cd: "",
        descs: "",
      });
      
      // Tutup modal
      setIsOpen(false);
      
      // Invalidate dan refetch data category group
      queryClient.invalidateQueries({ queryKey: ["cs-master-category-groups"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate category group");
    },
  });

  const onSubmit = async (data: CategoryGroupFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        category_group_cd: data.category_group_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS",
      };

      // Validasi data menggunakan function dari action
      const validationErrors = validateCategoryGroupData(updateData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      updateMutation.mutate({
        id: Number(categoryGroupData.rowID),
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate category group");
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
          Edit Category Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Category Group</DialogTitle>
            <DialogDescription>
              Update information for the selected category group
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="category_group_cd"
                className={cn({
                  "text-destructive": errors.category_group_cd,
                })}
              >
                Category Group Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category_group_cd"
                placeholder="AC"
                {...register("category_group_cd")}
                className={cn({
                  "border-destructive": errors.category_group_cd,
                })}
                disabled={updateMutation.isPending}
                style={{ textTransform: 'uppercase' }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("category_group_cd").onChange(e);
                }}
              />
              {errors.category_group_cd && (
                <p className="text-xs text-destructive">
                  {errors.category_group_cd.message}
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
                placeholder="Deskripsi category group"
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
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Category Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}