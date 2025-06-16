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
  updateCSMasterSetup,
  getCSMasterCategory,
  getCSMasterSection,
  validateSetupData,
} from "@/action/customer-service-master";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { getCurrencyMaster, getTaxCodeMaster, getTrxTypeMaster } from "@/action/ifca-master-action";
import { Textarea } from "@/components/ui/textarea";

// Schema validasi untuk form CS Setup
const csSetupFormSchema = z.object({
  service_cd: z.string().min(1, { message: "Service code harus diisi" }).max(10, { message: "Service code maksimal 10 karakter" }),
  section_cd: z.string().min(1, { message: "Section harus dipilih" }).max(4, { message: "Section maksimal 4 karakter" }),
  category_cd: z.string().min(1, { message: "Category harus dipilih" }).max(4, { message: "Category maksimal 4 karakter" }),
  trx_type_cd: z.string().min(1, { message: "Trx Type harus dipilih" }).max(4, { message: "Trx Type maksimal 4 karakter" }),
  descs: z.string().min(1, { message: "Service description harus diisi" }).max(255, { message: "Service description maksimal 255 karakter" }),
  service_day: z.string().min(1, { message: "Service day harus diisi" }).max(9, { message: "Service day maksimal 9 karakter" }),
  tax_cd: z.string().min(1, { message: "Tax Code harus dipilih" }).max(4, { message: "Tax Code maksimal 4 karakter" }),
  currency_cd: z.string().min(1, { message: "Currency harus dipilih" }).max(4, { message: "Currency maksimal 4 karakter" }),
  labour_rate: z.string().min(1, { message: "Service rate harus diisi" }).max(9, { message: "Service rate maksimal 9 karakter" }),
});

type CSSetupFormValues = z.infer<typeof csSetupFormSchema>;

interface EditCSSetupFormProps {
  setupData: {
    service_cd: string;
    section_cd: string;
    category_cd: string;
    trx_type: string;
    descs: string;
    service_day: number;
    tax_cd: string;
    currency_cd: string;
    labour_rate: number;
    rowID: string;
  };
  user?: any;
}

export default function EditCSSetupForm({ setupData, user }: EditCSSetupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CSSetupFormValues>({
    resolver: zodResolver(csSetupFormSchema),
    defaultValues: {
      service_cd: setupData.service_cd,
      section_cd: setupData.section_cd,
      category_cd: setupData.category_cd,
      trx_type_cd: setupData.trx_type,
      descs: setupData.descs,
      service_day: setupData.service_day.toString(),
      tax_cd: setupData.tax_cd,
      currency_cd: setupData.currency_cd,
      labour_rate: setupData.labour_rate.toString(),
    },
  });

  // Query untuk Section data
  const { data: sectionData, isLoading: isLoadingSection } = useQuery({
    queryKey: ["cs-master-sections"],
    queryFn: async () => {
      const result = await getCSMasterSection();
      return result;
    },
  });

  // Query untuk Category data
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["cs-master-category"],
    queryFn: async () => {
      const result = await getCSMasterCategory();
      return result;
    },
  });

  // Query untuk Transaction Type data
  const { data: trxTypeData, isLoading: isLoadingTrxType } = useQuery({
    queryKey: ["ifca-master-trx-type"],
    queryFn: async () => {
      const result = await getTrxTypeMaster();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query untuk Currency data
  const { data: currencyData, isLoading: isLoadingCurrency } = useQuery({
    queryKey: ["ifca-master-currency"],
    queryFn: async () => {
      const result = await getCurrencyMaster();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Query untuk Tax Code data
  const { data: taxCodeData, isLoading: isLoadingTaxCode } = useQuery({
    queryKey: ["ifca-master-tax-code"],
    queryFn: async () => {
      const result = await getTaxCodeMaster();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation untuk update CS Setup
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCSMasterSetup(id, data),
    onSuccess: (data) => {
      toast.success("Service berhasil diupdate");

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data
      queryClient.invalidateQueries({
        queryKey: ["cs-master-setup"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate service");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        service_cd: setupData.service_cd,
        section_cd: setupData.section_cd,
        category_cd: setupData.category_cd,
        trx_type_cd: setupData.trx_type,
        descs: setupData.descs,
        service_day: setupData.service_day.toString(),
        tax_cd: setupData.tax_cd,
        currency_cd: setupData.currency_cd,
        labour_rate: setupData.labour_rate.toString(),
      });
    }
  }, [isOpen, reset, setupData]);

  const onSubmit = async (data: CSSetupFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        service_cd: data.service_cd.toUpperCase().trim(),
        section_cd: data.section_cd.toUpperCase().trim(),
        category_cd: data.category_cd.toUpperCase().trim(),
        trx_type: data.trx_type_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        service_day: parseFloat(data.service_day),
        tax_cd: data.tax_cd.toUpperCase().trim(),
        currency_cd: data.currency_cd.toUpperCase().trim(),
        labour_rate: parseFloat(data.labour_rate),
        audit_user: "WEBCS",
      };

      const validationErrors = validateSetupData(updateData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      updateMutation.mutate({
        id: setupData.rowID,
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate service");
    }
  };

  // Options untuk dropdown
  const sectionOptions = useMemo(() => {
    if (!sectionData?.data) return [];
    return sectionData.data.map((section) => ({
      value: section.section_cd,
      label: `${section.section_cd} - ${section.descs}`
    }));
  }, [sectionData?.data]);

  const categoryOptions = useMemo(() => {
    if (!categoryData?.data) return [];
    return categoryData.data.map((category) => ({
      value: category.category_cd,
      label: `${category.category_cd} - ${category.descs}`
    }));
  }, [categoryData?.data]);

  const trxTypeOptions = useMemo(() => {
    if (!trxTypeData?.data) return [];
    return trxTypeData.data.map((trxType) => ({
      value: trxType.trx_type,
      label: `${trxType.trx_type} - ${trxType.trx_type_desc}`
    }));
  }, [trxTypeData?.data]);

  const currencyOptions = useMemo(() => {
    if (!currencyData?.data) return [];
    return currencyData.data.map((currency) => ({
      value: currency.currency_cd,
      label: `${currency.currency_cd} - ${currency.descs}`
    }));
  }, [currencyData?.data]);

  const taxCodeOptions = useMemo(() => {
    if (!taxCodeData?.data) return [];
    return taxCodeData.data.map((taxCode) => ({
      value: taxCode.scheme_cd,
      label: `${taxCode.scheme_cd} - ${taxCode.descs}`
    }));
  }, [taxCodeData?.data]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
          disabled={updateMutation.isPending}
        >
          <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Edit Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" size="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update information for the selected service
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Service Code & Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="service_cd"
                  className={cn({
                    "text-destructive": errors.service_cd,
                  })}
                >
                  Service Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="service_cd"
                  placeholder="Service Code"
                  {...register("service_cd")}
                  className={cn({
                    "border-destructive": errors.service_cd,
                  })}
                  disabled={updateMutation.isPending}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    e.target.value = value;
                    register("service_cd").onChange(e);
                  }}
                />
                {errors.service_cd && (
                  <p className="text-xs text-destructive">
                    {errors.service_cd.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className={cn({ "text-destructive": errors.section_cd })}>
                  Section <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="section_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={sectionOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Choose a Section"
                      searchPlaceholder="Search section..."
                      emptyMessage="Section not found"
                      disabled={isLoadingSection || updateMutation.isPending}
                    />
                  )}
                />
                {errors.section_cd && (
                  <p className="text-xs text-destructive">
                    {errors.section_cd.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category & Trx Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className={cn({ "text-destructive": errors.category_cd })}>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="category_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={categoryOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Choose a Category"
                      searchPlaceholder="Search category..."
                      emptyMessage="Category not found"
                      disabled={isLoadingCategory || updateMutation.isPending}
                    />
                  )}
                />
                {errors.category_cd && (
                  <p className="text-xs text-destructive">
                    {errors.category_cd.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className={cn({ "text-destructive": errors.trx_type_cd })}>
                  Trx Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="trx_type_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={trxTypeOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Choose a Trx Type"
                      searchPlaceholder="Search trx type..."
                      emptyMessage="Trx Type not found"
                      disabled={isLoadingTrxType || updateMutation.isPending}
                      optimizeForLargeDataset={true}
                    />
                  )}
                />
                {errors.trx_type_cd && (
                  <p className="text-xs text-destructive">
                    {errors.trx_type_cd.message}
                  </p>
                )}
              </div>
            </div>

            {/* Service Description */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="service_desc"
                className={cn({
                  "text-destructive": errors.descs,
                })}
              >
                Service Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="service_desc"
                placeholder="Service Description"
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

            {/* Hours */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="hours"
                className={cn({
                  "text-destructive": errors.service_day,
                })}
              >
                Hours <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.01"
                placeholder="Hours"
                {...register("service_day")}
                className={cn({
                  "border-destructive": errors.service_day,
                })}
                disabled={updateMutation.isPending}
              />
              {errors.service_day && (
                <p className="text-xs text-destructive">
                  {errors.service_day.message}
                </p>
              )}
            </div>

            {/* Tax Code & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className={cn({ "text-destructive": errors.tax_cd })}>
                  Tax Code <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="tax_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={taxCodeOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Choose a Tax Code"
                      searchPlaceholder="Search tax code..."
                      emptyMessage="Tax Code not found"
                      disabled={isLoadingTaxCode || updateMutation.isPending}
                    />
                  )}
                />
                {errors.tax_cd && (
                  <p className="text-xs text-destructive">
                    {errors.tax_cd.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className={cn({ "text-destructive": errors.currency_cd })}>
                  Currency <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="currency_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={currencyOptions}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Choose a Currency"
                      searchPlaceholder="Search currency..."
                      emptyMessage="Currency not found"
                      disabled={isLoadingCurrency || updateMutation.isPending}
                    />
                  )}
                />
                {errors.currency_cd && (
                  <p className="text-xs text-destructive">
                    {errors.currency_cd.message}
                  </p>
                )}
              </div>
            </div>

            {/* Service Rate */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="service_rate"
                className={cn({
                  "text-destructive": errors.labour_rate,
                })}
              >
                Service Rate <span className="text-destructive">*</span>
              </Label>
              <Input
                id="service_rate"
                type="number"
                step="0.01"
                placeholder="Service Rate"
                {...register("labour_rate")}
                className={cn({
                  "border-destructive": errors.labour_rate,
                })}
                disabled={updateMutation.isPending}
              />
              {errors.labour_rate && (
                <p className="text-xs text-destructive">
                  {errors.labour_rate.message}
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
              {updateMutation.isPending ? "Updating..." : "Update Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}