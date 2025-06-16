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
import { createCSMasterCategoryGroup, validateCategoryGroupData } from "@/action/customer-service-master";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Schema validasi untuk form category group - sesuaikan dengan API
const categoryGroupFormSchema = z.object({
  category_group_cd: z
    .string()
    .min(1, { message: "Category group code harus diisi" })
    .max(4, { message: "Category group code maksimal 4 karakter" })
    .regex(/^[A-Z0-9_-]+$/, { 
      message: "Category group code hanya boleh huruf besar, angka, dash, dan underscore" 
    }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type CategoryGroupFormValues = z.infer<typeof categoryGroupFormSchema>;

interface NewCategoryGroupFormProps {
  user?: any; // Untuk mendapatkan audit_user
}

export default function NewCategoryGroupForm({ user }: NewCategoryGroupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryGroupFormValues>({
    resolver: zodResolver(categoryGroupFormSchema), 
    defaultValues: {
      category_group_cd: "",
      descs: "",
    },
  });

  // Mutation untuk create category group
  const createMutation = useMutation({
    mutationFn: createCSMasterCategoryGroup,
    onSuccess: (data) => {
      toast.success("Category group berhasil ditambahkan");
      
      // Reset form dan clear semua field
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
      toast.error(error.message || "Gagal menambah category group");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        category_group_cd: "",
        descs: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CategoryGroupFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const categoryGroupData = {
        category_group_cd: data.category_group_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS",
      };

      // Validasi data menggunakan function dari action
      const validationErrors = validateCategoryGroupData(categoryGroupData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      createMutation.mutate(categoryGroupData);
    } catch (error) {
      toast.error("Gagal menambah category group");
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
          New Category Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Category Group</DialogTitle>
            <DialogDescription>
              Enter information for the new category group
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
                disabled={createMutation.isPending}
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
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Category Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}