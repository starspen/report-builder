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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import {
  updateCSMasterCategory,
  getCSMasterCategoryGroup,
  validateCategoryData,
} from "@/action/customer-service-master";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { SelectWithSearch } from "@/components/ui/select-with-search";

// Schema validasi untuk form category - sesuaikan dengan API
const categoryFormSchema = z.object({
  category_cd: z
    .string()
    .min(1, { message: "Category code harus diisi" })
    .max(4, { message: "Category code maksimal 4 karakter" })
    .regex(/^[A-Z0-9_-]+$/, {
      message:
        "Category code hanya boleh huruf besar, angka, dash, dan underscore",
    }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
  category_group_cd: z
    .string()
    .min(1, { message: "Category group harus diisi" })
    .max(4, { message: "Category group maksimal 4 karakter" }),
  complain_type: z
    .string()
    .min(1, { message: "Complain type harus diisi" })
    .max(1, { message: "Complain type maksimal 1 karakter" }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface EditCategoryFormProps {
  categoryData: {
    category_cd: string;
    descs: string;
    category_group_cd: string;
    complain_type: string;
    rowID: string;
  };
  user?: any;
}

export default function EditCategoryForm({ categoryData, user }: EditCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category_cd: categoryData.category_cd,
      descs: categoryData.descs,
      category_group_cd: categoryData.category_group_cd,
      complain_type: categoryData.complain_type,
    },
  });

  const { data: categoryGroupData, isLoading: isLoadingCategoryGroup } = useQuery({
    queryKey: ["cs-master-category-group"],
    queryFn: async () => {
      const result = await getCSMasterCategoryGroup();
      return result;
    },
  });

  // Mutation untuk update category
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCSMasterCategory(id, data),
    onSuccess: (data) => {
      toast.success("Category berhasil diupdate");

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data category
      queryClient.invalidateQueries({
        queryKey: ["cs-master-category"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate category");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        category_cd: categoryData.category_cd,
        descs: categoryData.descs,
        category_group_cd: categoryData.category_group_cd,
        complain_type: categoryData.complain_type,
      });
    }
  }, [isOpen, reset, categoryData]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        category_cd: data.category_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS",
        category_group_cd: data.category_group_cd.toUpperCase().trim(),
        complain_type: data.complain_type.trim(),
      };

      // Validasi data menggunakan function dari action
      const validationErrors = validateCategoryData(updateData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      updateMutation.mutate({
        id: Number(categoryData.rowID),
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate category");
    }
  };

  const categoryGroupOptions = useMemo(() => {
    if (!categoryGroupData?.data) return [];
    return categoryGroupData.data.map((categoryGroup) => ({
      value: categoryGroup.category_group_cd,
      label: `${categoryGroup.category_group_cd} - ${categoryGroup.descs}`
    }));
  }, [categoryGroupData?.data]);

  const complainTypeOptions = useMemo(() => {
    return [
      { value: "P", label: "Public Area" },
      { value: "U", label: "Unit" },
    ];
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
          disabled={updateMutation.isPending}
        >
          <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Edit Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update information for the selected category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="category_cd"
                className={cn({
                  "text-destructive": errors.category_cd,
                })}
              >
                Category Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category_cd"
                placeholder="AC"
                {...register("category_cd")}
                className={cn({
                  "border-destructive": errors.category_cd,
                })}
                disabled={updateMutation.isPending}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("category_cd").onChange(e);
                }}
              />
              {errors.category_cd && (
                <p className="text-xs text-destructive">
                  {errors.category_cd.message}
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
                placeholder="Deskripsi category"
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="category_group">Category Group</Label>
              <Controller
                name="category_group_cd"
                control={control}
                render={({ field }) => (
                  <SelectWithSearch
                    options={categoryGroupOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select category group..."
                    searchPlaceholder="Search..."
                    emptyMessage="Category group not found"
                  />
                )}
              />
              {errors.category_group_cd && (
                <p className="text-xs text-destructive">
                  {errors.category_group_cd.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="complain_type">Complain Type</Label>
              <Controller
                name="complain_type"
                control={control}
                render={({ field }) => (
                  <SelectWithSearch
                    options={complainTypeOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select complain type..."
                    searchPlaceholder="Search..."
                    emptyMessage="Complain type not found"
                  />
                )}
              />
              {errors.complain_type && (
                <p className="text-xs text-destructive">
                  {errors.complain_type.message}
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
              {updateMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}