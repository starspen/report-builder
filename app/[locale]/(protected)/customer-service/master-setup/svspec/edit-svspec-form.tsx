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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import {
  updateCSMasterSvspec,
  getCSMasterComplainSource,
} from "@/action/customer-service-master";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getEntityMaster, getProjectMaster, getDocTypeforCS, getDocTypeTenantforCS, getTrxTypeICMaster } from "@/action/ifca-master-action";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { Switch } from "@/components/ui/switch";

// Constants
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const AUDIT_USER = "WEBCS";

// Schema validasi untuk form svspec
const svspecFormSchema = z.object({
  entity_cd: z
    .string()
    .min(1, { message: "Entity code harus diisi" })
    .max(4, { message: "Entity code maksimal 4 karakter" }),
  project_no: z
    .string()
    .min(1, { message: "Project number harus diisi" })
    .max(20, { message: "Project number maksimal 20 karakter" }),
  prefix: z
    .string()
    .min(1, { message: "Prefix harus diisi" })
    .max(10, { message: "Prefix maksimal 10 karakter" }),
  tenant_prefix: z
    .string()
    .max(10, { message: "Tenant prefix maksimal 10 karakter" })
    .optional(),
  building_prefix: z
    .string()
    .max(10, { message: "Building prefix maksimal 10 karakter" })
    .optional(),
  report_seq_no: z
    .string()
    .min(1, { message: "Report sequence no harus diisi" })
    .max(10, { message: "Report sequence no maksimal 10 karakter" }),
  by_project: z
    .string()
    .max(1, { message: "By project maksimal 1 karakter" })
    .optional(),
  link: z
    .string()
    .optional(),
  trx_type: z
    .string()
    .max(10, { message: "Transaction type maksimal 10 karakter" })
    .optional(),
  complain_source: z
    .string()
    .max(10, { message: "Complain source maksimal 10 karakter" })
    .optional(),
  age1: z
    .string()
    .max(10, { message: "Age 1 maksimal 10 karakter" })
    .optional(),
  age2: z
    .string()
    .max(10, { message: "Age 2 maksimal 10 karakter" })
    .optional(),
  age3: z
    .string()
    .max(10, { message: "Age 3 maksimal 10 karakter" })
    .optional(),
  age4: z
    .string()
    .max(10, { message: "Age 4 maksimal 10 karakter" })
    .optional(),
  age5: z
    .string()
    .max(10, { message: "Age 5 maksimal 10 karakter" })
    .optional(),
  age6: z
    .string()
    .max(10, { message: "Age 6 maksimal 10 karakter" })
    .optional(),
});

type SvspecFormValues = z.infer<typeof svspecFormSchema>;

interface EditSvspecFormProps {
  svspecData: {
    entity_cd: string;
    project_no: string;
    prefix: string;
    tenant_prefix: string;
    building_prefix: string;
    report_seq_no: string;
    by_project: string;
    link: string;
    trx_type: string;
    complain_source: string;
    age1: string;
    age2: string;
    age3: string;
    age4: string;
    age5: string;
    age6: string;
    rowID: string;
  };
  user?: any;
}

export default function EditSvspecForm({ svspecData, user }: EditSvspecFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<SvspecFormValues>({
    resolver: zodResolver(svspecFormSchema),
    defaultValues: {
      entity_cd: svspecData.entity_cd,
      project_no: svspecData.project_no,
      prefix: svspecData.prefix,
      tenant_prefix: svspecData.tenant_prefix,
      building_prefix: svspecData.building_prefix,
      report_seq_no: svspecData.report_seq_no,
      by_project: svspecData.by_project || "Y",
      link: svspecData.link,
      trx_type: svspecData.trx_type,
      complain_source: svspecData.complain_source,
      age1: svspecData.age1,
      age2: svspecData.age2,
      age3: svspecData.age3,
      age4: svspecData.age4,
      age5: svspecData.age5,
      age6: svspecData.age6,
    },
  });

  const { data: entityData, isLoading: isLoadingEntityData } = useQuery({
    queryKey: ["ifca-master-entity"],
    queryFn: async () => {
      const result = await getEntityMaster();
      return result;
    },
    staleTime: STALE_TIME,
  });

  const { data: projectData, isLoading: isLoadingProjectData } = useQuery({
    queryKey: ["ifca-master-project"],
    queryFn: async () => {
      const result = await getProjectMaster();
      return result;
    },
    staleTime: STALE_TIME,
  });

  const { data: complainSourceData, isLoading: isLoadingComplainSourceData } = useQuery({
    queryKey: ["cs-master-complain-source"],
    queryFn: async () => {
      const result = await getCSMasterComplainSource();
      return result;
    },
    staleTime: STALE_TIME,
  });

  // Query untuk doc type - hanya fetch jika entity sudah dipilih
  const { data: docTypeData, isLoading: isLoadingDocTypeData } = useQuery({
    queryKey: ["ifca-master-doc-type", watch("entity_cd")],
    queryFn: async () => {
      const entityCd = watch("entity_cd");
      if (!entityCd) return null;
      const result = await getDocTypeforCS(entityCd);
      return result;
    },
    enabled: !!watch("entity_cd"),
    staleTime: STALE_TIME,
  });

  // Query untuk tenant doc type - hanya fetch jika entity sudah dipilih
  const { data: tenantDocTypeData, isLoading: isLoadingTenantDocTypeData } = useQuery({
    queryKey: ["ifca-master-tenant-doc-type", watch("entity_cd")],
    queryFn: async () => {
      const entityCd = watch("entity_cd");
      if (!entityCd) return null;
      const result = await getDocTypeTenantforCS(entityCd);
      return result;
    },
    enabled: !!watch("entity_cd"),
    staleTime: STALE_TIME,
  });

  // Query untuk trx type IC master
  const { data: trxTypeICData, isLoading: isLoadingTrxTypeICData } = useQuery({
    queryKey: ["ifca-master-trx-type-ic"],
    queryFn: async () => {
      const result = await getTrxTypeICMaster();
      return result;
    },
    staleTime: STALE_TIME,
  });

  // Mutation untuk update svspec
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCSMasterSvspec(id, data),
    onSuccess: (data) => {
      toast.success("SV SPEC berhasil diupdate");

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data svspec
      queryClient.invalidateQueries({
        queryKey: ["cs-master-svspec"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate SV SPEC");
    },
  });

  // Helper function untuk prepare form data
  const prepareFormData = (data: SvspecFormValues) => {
    return {
      entity_cd: data.entity_cd,
      project_no: data.project_no,
      prefix: data.prefix.toUpperCase().trim(),
      tenant_prefix: data.tenant_prefix?.trim() || "",
      building_prefix: data.building_prefix?.trim() || "",
      report_seq_no: data.report_seq_no.trim(),
      by_project: data.by_project || "Y",
      link: data.link === "1" ? "1" : "0",
      trx_type: data.trx_type?.trim() || "",
      complain_source: data.complain_source?.trim() || "",
      age1: data.age1?.trim() || "",
      age2: data.age2?.trim() || "",
      age3: data.age3?.trim() || "",
      age4: data.age4?.trim() || "",
      age5: data.age5?.trim() || "",
      age6: data.age6?.trim() || "",
      audit_user: AUDIT_USER,
    };
  };

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        entity_cd: svspecData.entity_cd,
        project_no: svspecData.project_no,
        prefix: svspecData.prefix,
        tenant_prefix: svspecData.tenant_prefix,
        building_prefix: svspecData.building_prefix,
        report_seq_no: svspecData.report_seq_no,
        by_project: svspecData.by_project || "Y",
        link: svspecData.link,
        trx_type: svspecData.trx_type,
        complain_source: svspecData.complain_source,
        age1: svspecData.age1,
        age2: svspecData.age2,
        age3: svspecData.age3,
        age4: svspecData.age4,
        age5: svspecData.age5,
        age6: svspecData.age6,
      });
    }
  }, [isOpen, reset, svspecData]);

  const entity = watch("entity_cd");

  // Reset project ketika entity berubah
  useEffect(() => {
    if (entity && entity !== svspecData.entity_cd) {
      setValue("project_no", "");
    }
  }, [entity, setValue, svspecData.entity_cd]);

  // Reset prefix ketika entity berubah
  const entityCd = watch("entity_cd");
  useEffect(() => {
    if (entityCd && entityCd !== svspecData.entity_cd) {
      setValue("prefix", "");
    }
  }, [entityCd, setValue, svspecData.entity_cd]);

  // Reset tenant_prefix dan building_prefix ketika entity berubah
  useEffect(() => {
    if (entityCd && entityCd !== svspecData.entity_cd) {
      setValue("tenant_prefix", "");
      setValue("building_prefix", "");
    }
  }, [entityCd, setValue, svspecData.entity_cd]);

  // Reset trx_type ketika link berubah
  const linkValue = watch("link");
  useEffect(() => {
    if (linkValue !== svspecData.link) {
      setValue("trx_type", "");
    }
  }, [linkValue, setValue, svspecData.link]);

  const projectOptions = useMemo(() => {
    if (!projectData?.data || !entity) return [];

    const filteredProjects = projectData.data.filter(
      (project) => project.entity_cd.trim() === entity.trim(),
    );

    return filteredProjects.map((project) => ({
      value: project.project_no,
      label: `${project.project_no} - ${project.descs}`,
    }));
  }, [projectData?.data, entity]);

  const complainSourceOptions = useMemo(() => {
    if (!complainSourceData?.data) return [];
    return complainSourceData.data.map((complainSource) => ({
      value: complainSource.complain_source,
      label: complainSource.descs,
    }));
  }, [complainSourceData?.data]);

  const docTypeOptions = useMemo(() => {
    if (!docTypeData?.data) return [];
    return docTypeData.data.map((docType) => ({
      value: docType.prefix,
      label: `${docType.prefix} - ${docType.descs}`,
    }));
  }, [docTypeData?.data]);

  const tenantDocTypeOptions = useMemo(() => {
    if (!tenantDocTypeData?.data) return [];
    return tenantDocTypeData.data.map((docType) => ({
      value: docType.prefix,
      label: `${docType.prefix} - ${docType.descs}`,
    }));
  }, [tenantDocTypeData?.data]);

  const trxTypeICOptions = useMemo(() => {
    if (!trxTypeICData?.data) return [];
    return trxTypeICData.data.map((trxType) => ({
      value: trxType.trx_type,
      label: `${trxType.trx_type} - ${trxType.descs}`,
    }));
  }, [trxTypeICData?.data]);

  const isProjectDisabled = isLoadingProjectData || isLoadingEntityData || !entity;

  const entityOptions = useMemo(() => {
    if (!entityData?.data) return [];
    return entityData.data.map((entity) => ({
      value: entity.entity_cd,
      label: entity.entity_name,
    }));
  }, [entityData?.data]);

  const onSubmit = async (data: SvspecFormValues) => {
    try {
      const updateData = prepareFormData(data);
      updateMutation.mutate({
        id: svspecData.rowID,
        data: updateData,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengupdate SV SPEC");
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
          Edit SV SPEC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" size="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit SV SPEC</DialogTitle>
            <DialogDescription>
              Update information for the selected SV SPEC configuration
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Entity */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="entity_cd"
                  className={cn({
                    "text-destructive": errors.entity_cd,
                  })}
                >
                  Entity <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="entity_cd"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={entityOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Entity"
                      searchPlaceholder="Search entity..."
                      emptyMessage="Entity not found"
                      disabled={isLoadingEntityData || updateMutation.isPending}
                    />
                  )}
                />
                {errors.entity_cd && (
                  <p className="text-xs text-destructive">
                    {errors.entity_cd.message}
                  </p>
                )}
              </div>

              {/* Project */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="project_no"
                  className={cn({
                    "text-destructive": errors.project_no,
                  })}
                >
                  Project <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="project_no"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={projectOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Project"
                      searchPlaceholder="Search project..."
                      emptyMessage="Project not found"
                      disabled={isProjectDisabled || updateMutation.isPending}
                    />
                  )}
                />
                {errors.project_no && (
                  <p className="text-xs text-destructive">
                    {errors.project_no.message}
                  </p>
                )}
              </div>

              {/* Prefix */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="prefix"
                  className={cn({
                    "text-destructive": errors.prefix,
                  })}
                >
                  Doc Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="prefix"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={docTypeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Doc Type"
                      searchPlaceholder="Search doc type..."
                      emptyMessage="Doc type not found"
                      disabled={!watch("entity_cd") || isLoadingDocTypeData || updateMutation.isPending}
                    />
                  )}
                />
                {errors.prefix && (
                  <p className="text-xs text-destructive">
                    {errors.prefix.message}
                  </p>
                )}
              </div>

              {/* Report Sequence No */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="report_seq_no"
                  className={cn({
                    "text-destructive": errors.report_seq_no,
                  })}
                >
                  Report Sequence No <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="report_seq_no"
                  placeholder="001"
                  {...register("report_seq_no")}
                  className={cn({
                    "border-destructive": errors.report_seq_no,
                  })}
                  disabled={updateMutation.isPending}
                />
                {errors.report_seq_no && (
                  <p className="text-xs text-destructive">
                    {errors.report_seq_no.message}
                  </p>
                )}
              </div>

              {/* Tenant Prefix */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="tenant_prefix"
                  className={cn({
                    "text-destructive": errors.tenant_prefix,
                  })}
                >
                  Tenant Prefix
                </Label>
                <Controller
                  name="tenant_prefix"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={tenantDocTypeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Tenant Prefix"
                      searchPlaceholder="Search tenant prefix..."
                      emptyMessage="Tenant prefix not found"
                      disabled={!watch("entity_cd") || isLoadingTenantDocTypeData || updateMutation.isPending}
                    />
                  )}
                />
                {errors.tenant_prefix && (
                  <p className="text-xs text-destructive">
                    {errors.tenant_prefix.message}
                  </p>
                )}
              </div>

              {/* Building Prefix */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="building_prefix"
                  className={cn({
                    "text-destructive": errors.building_prefix,
                  })}
                >
                  Building Prefix
                </Label>
                <Controller
                  name="building_prefix"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={tenantDocTypeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Building Prefix"
                      searchPlaceholder="Search building prefix..."
                      emptyMessage="Building prefix not found"
                      disabled={!watch("entity_cd") || isLoadingTenantDocTypeData || updateMutation.isPending}
                    />
                  )}
                />
                {errors.building_prefix && (
                  <p className="text-xs text-destructive">
                    {errors.building_prefix.message}
                  </p>
                )}
              </div>

              {/* Link */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="link"
                  className={cn({
                    "text-destructive": errors.link,
                  })}
                >
                  Link to IC
                </Label>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value === "1"}
                        onCheckedChange={(value) => field.onChange(value ? "1" : "0")}
                      />
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {watch("link") === "1" ? "Enabled" : "Disabled"}
                  </span>
                </div>
                {errors.link && (
                  <p className="text-xs text-destructive">
                    {errors.link.message}
                  </p>
                )}
              </div>

              {/* Transaction Type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="trx_type"
                  className={cn({
                    "text-destructive": errors.trx_type,
                  })}
                >
                  Transaction Type
                </Label>
                <Controller
                  name="trx_type"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={trxTypeICOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Transaction Type (IC)"
                      searchPlaceholder="Search transaction type..."
                      emptyMessage="Transaction type not found"
                      disabled={isLoadingTrxTypeICData || updateMutation.isPending || watch("link") === "0"}
                    />
                  )}
                />
                {errors.trx_type && (
                  <p className="text-xs text-destructive">
                    {errors.trx_type.message}
                  </p>
                )}
              </div>

              {/* Complain Source */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="complain_source"
                  className={cn({
                    "text-destructive": errors.complain_source,
                  })}
                >
                  Complain Source
                </Label>
                <Controller
                  name="complain_source"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={complainSourceOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Complain Source"
                      searchPlaceholder="Search complain source..."
                      emptyMessage="Complain source not found"
                      disabled={isLoadingComplainSourceData || updateMutation.isPending}
                    />
                  )}
                />
                {errors.complain_source && (
                  <p className="text-xs text-destructive">
                    {errors.complain_source.message}
                  </p>
                )}
              </div>
            </div>

            {/* Customer Service Aging */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-3">Customer Service Aging</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Age 1 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age1">Age 1</Label>
                  <Input
                    id="age1"
                    placeholder="1"
                    {...register("age1")}
                    className={cn({
                      "border-destructive": errors.age1,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age1 && (
                    <p className="text-xs text-destructive">
                      {errors.age1.message}
                    </p>
                  )}
                </div>

                {/* Age 2 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age2">Age 2</Label>
                  <Input
                    id="age2"
                    placeholder="2"
                    {...register("age2")}
                    className={cn({
                      "border-destructive": errors.age2,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age2 && (
                    <p className="text-xs text-destructive">
                      {errors.age2.message}
                    </p>
                  )}
                </div>

                {/* Age 3 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age3">Age 3</Label>
                  <Input
                    id="age3"
                    placeholder="3"
                    {...register("age3")}
                    className={cn({
                      "border-destructive": errors.age3,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age3 && (
                    <p className="text-xs text-destructive">
                      {errors.age3.message}
                    </p>
                  )}
                </div>

                {/* Age 4 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age4">Age 4</Label>
                  <Input
                    id="age4"
                    placeholder="4"
                    {...register("age4")}
                    className={cn({
                      "border-destructive": errors.age4,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age4 && (
                    <p className="text-xs text-destructive">
                      {errors.age4.message}
                    </p>
                  )}
                </div>

                {/* Age 5 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age5">Age 5</Label>
                  <Input
                    id="age5"
                    placeholder="5"
                    {...register("age5")}
                    className={cn({
                      "border-destructive": errors.age5,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age5 && (
                    <p className="text-xs text-destructive">
                      {errors.age5.message}
                    </p>
                  )}
                </div>

                {/* Age 6 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age6">Age 6</Label>
                  <Input
                    id="age6"
                    placeholder="6"
                    {...register("age6")}
                    className={cn({
                      "border-destructive": errors.age6,
                    })}
                    disabled={updateMutation.isPending}
                  />
                  {errors.age6 && (
                    <p className="text-xs text-destructive">
                      {errors.age6.message}
                    </p>
                  )}
                </div>
              </div>
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
              {updateMutation.isPending ? "Updating..." : "Update SV SPEC"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}