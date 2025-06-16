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
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createCSMasterItemSetup } from "@/action/customer-service-master";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { getCurrencyMaster, getTaxCodeMaster, getTrxTypeMaster } from "@/action/ifca-master-action";
import { Switch } from "@/components/ui/switch";

// Schema validasi untuk form Item Master
const itemMasterFormSchema = z.object({
  ic_flag: z.string().refine(val => val === "Y" || val === "N"),
  item_cd: z.string().min(1, { message: "Item code harus diisi" }).max(20, { message: "Item code maksimal 20 karakter" }),
  descs: z.string().min(1, { message: "Description harus diisi" }).max(255, { message: "Description maksimal 255 karakter" }),
  trx_type: z.string().min(1, { message: "Trx Type harus dipilih" }),
  tax_cd: z.string().min(1, { message: "Tax Code harus dipilih" }),
  currency_cd: z.string().min(1, { message: "Currency harus dipilih" }),
  charge_amt: z.string().min(1, { message: "Unit Price harus diisi" }),
});

type ItemMasterFormValues = z.infer<typeof itemMasterFormSchema>;

interface NewItemMasterFormProps {
  user?: any;
}

export default function NewItemMasterForm({ user }: NewItemMasterFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ItemMasterFormValues>({
    resolver: zodResolver(itemMasterFormSchema),
    defaultValues: {
      ic_flag: "N",
      item_cd: "",
      descs: "",
      trx_type: "",
      tax_cd: "",
      currency_cd: "",
      charge_amt: "",
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

  // Mutation untuk create item
  const createMutation = useMutation({
    mutationFn: createCSMasterItemSetup,
    onSuccess: (data) => {
      toast.success("Item berhasil ditambahkan");

      // Reset form
      reset();

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data
      queryClient.invalidateQueries({
        queryKey: ["cs-master-item-setup"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah item");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ItemMasterFormValues) => {
    try {
      const itemData = {
        ic_flag: data.ic_flag,
        item_cd: data.item_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        trx_type: data.trx_type.toUpperCase().trim(),
        tax_cd: data.tax_cd.toUpperCase().trim(),
        currency_cd: data.currency_cd.toUpperCase().trim(),
        charge_amt: parseFloat(data.charge_amt),
        audit_user: "WEBCS",
      };

      createMutation.mutate(itemData);
    } catch (error) {
      toast.error("Gagal menambah item");
    }
  };

  // Options untuk dropdowns
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

  const mobileStatusOptions = useMemo(() => {
    return [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ];
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-blue-500/80 px-2 text-white hover:bg-blue-500/90 lg:px-3"
          disabled={createMutation.isPending}
        >
          <PlusIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Enter information for the new item
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* IC Flag */}
            <div className="flex items-center gap-2">
              <Label htmlFor="ic_flag">IC Flag</Label>
              <Controller
                name="ic_flag"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="ic_flag"
                    checked={field.value === "Y"}
                    onCheckedChange={(checked) => field.onChange(checked ? "Y" : "N")}
                    disabled={createMutation.isPending}
                  />
                )}
              />
            </div>

            {/* Item Code */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="item_cd"
                className={cn({
                  "text-destructive": errors.item_cd,
                })}
              >
                Item Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item_cd"
                placeholder="Item Code"
                {...register("item_cd")}
                className={cn({
                  "border-destructive": errors.item_cd,
                })}
                disabled={createMutation.isPending}
                style={{ textTransform: "uppercase" }}
              />
              {errors.item_cd && (
                <p className="text-xs text-destructive">{errors.item_cd.message}</p>
              )}
            </div>

            {/* Description */}
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
                placeholder="Description"
                {...register("descs")}
                className={cn({
                  "border-destructive": errors.descs,
                })}
                disabled={createMutation.isPending}
              />
              {errors.descs && (
                <p className="text-xs text-destructive">{errors.descs.message}</p>
              )}
            </div>

            {/* Trx Type */}
            <div className="flex flex-col gap-2">
              <Label className={cn({ "text-destructive": errors.trx_type })}>
                Trx Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="trx_type"
                control={control}
                render={({ field }) => (
                  <SelectWithSearch
                    options={trxTypeOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose a Trx Type"
                    searchPlaceholder="Search trx type..."
                    emptyMessage="Trx Type not found"
                    disabled={isLoadingTrxType || createMutation.isPending}
                  />
                )}
              />
              {errors.trx_type && (
                <p className="text-xs text-destructive">{errors.trx_type.message}</p>
              )}
            </div>

            {/* Tax Code */}
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
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose a Tax Code"
                    searchPlaceholder="Search tax code..."
                    emptyMessage="Tax Code not found"
                    disabled={isLoadingTaxCode || createMutation.isPending}
                  />
                )}
              />
              {errors.tax_cd && (
                <p className="text-xs text-destructive">{errors.tax_cd.message}</p>
              )}
            </div>

            {/* Currency */}
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
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose a Currency"
                    searchPlaceholder="Search currency..."
                    emptyMessage="Currency not found"
                    disabled={isLoadingCurrency || createMutation.isPending}
                  />
                )}
              />
              {errors.currency_cd && (
                <p className="text-xs text-destructive">{errors.currency_cd.message}</p>
              )}
            </div>

            {/* Unit Price */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="charge_amt"
                className={cn({
                  "text-destructive": errors.charge_amt,
                })}
              >
                Unit Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="charge_amt"
                type="number"
                step="0.01"
                placeholder="Unit Price"
                {...register("charge_amt")}
                className={cn({
                  "border-destructive": errors.charge_amt,
                })}
                disabled={createMutation.isPending}
              />
              {errors.charge_amt && (
                <p className="text-xs text-destructive">{errors.charge_amt.message}</p>
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
              {createMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
