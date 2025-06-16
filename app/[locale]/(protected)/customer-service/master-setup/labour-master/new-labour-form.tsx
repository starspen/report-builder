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
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCFStaffForLabour, getCFDivisionMaster, getCFDepartmentMaster } from "@/action/ifca-master-action";
import { createCSMasterLabour, validateLabourData } from "@/action/customer-service-master";

// Schema validasi untuk form labour
const labourFormSchema = z.object({
  staff_id: z
    .string()
    .min(1, { message: "Staff ID is required" }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(60, { message: "Name must be at most 60 characters" }),

  div_cd: z
    .string()
    .min(1, { message: "Division code is required" }),

  dept_cd: z
    .string()
    .min(1, { message: "Department code is required" }),

  prefix: z.string().optional(),

  audit_user: z
    .string()
    .min(1, { message: "Audit user is required" }),
});

type LabourFormValues = z.infer<typeof labourFormSchema>;

export default function NewLabourForm() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<LabourFormValues>({
    resolver: zodResolver(labourFormSchema),
  });

  // Mutation untuk create labour
  const createMutation = useMutation({
    mutationFn: createCSMasterLabour,
    onSuccess: (data) => {
      toast.success("Labour berhasil ditambahkan");
      
      // Reset form dan clear semua field
      reset({
        staff_id: "",
        name: "",
        div_cd: "",
        dept_cd: "",
        prefix: "",
        audit_user: "",
      });
      
      // Tutup modal
      setIsOpen(false);
      
      // Invalidate dan refetch data labour
      queryClient.invalidateQueries({ queryKey: ["cs-master-labour"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah labour");
    },
  });

  // Query untuk data staff
  const { data: labourData, isLoading: isLoadingLabour, refetch: refetchStaff } = useQuery({
    queryKey: ["cs-master-labour-staff"],
    queryFn: async () => {
      const result = await getCFStaffForLabour();
      return result;
    },
  });

  // Query untuk data division
  const { data: divisionData, isLoading: isLoadingDivision } = useQuery({
    queryKey: ["cf-division-master"],
    queryFn: async () => {
      const result = await getCFDivisionMaster();
      return result;
    },
  });

  // Query untuk data department
  const { data: departmentData, isLoading: isLoadingDepartment } = useQuery({
    queryKey: ["cf-department-master"],
    queryFn: async () => {
      const result = await getCFDepartmentMaster();
      return result;
    },
  });

  // Convert staff data to options format for SelectWithSearch
  const staffOptions = useMemo(() => {
    if (!labourData?.data) return [];
    return labourData.data.map((staff) => ({
      value: staff.staff_id,
      label: `${staff.staff_id} - ${staff.staff_name}`
    }));
  }, [labourData?.data]);

  // Watch untuk perubahan staff_id
  const selectedStaffId = watch("staff_id");

  // Auto-fill fields ketika staff dipilih
  useEffect(() => {
    if (selectedStaffId && labourData?.data) {
      const selectedStaff = labourData.data.find(
        (staff) => staff.staff_id === selectedStaffId
      );
      
      if (selectedStaff) {
        // Auto-fill name
        setValue("name", selectedStaff.staff_name);
        
        // Auto-fill division code
        setValue("div_cd", selectedStaff.div_cd);
        
        // Auto-fill department code
        setValue("dept_cd", selectedStaff.dept_cd);
        
        // Auto-fill audit user
        setValue("audit_user", "WEBCS");
      }
    }
  }, [selectedStaffId, labourData?.data, setValue]);

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        staff_id: "",
        name: "",
        div_cd: "",
        dept_cd: "",
        prefix: "",
        audit_user: "",
      });

      refetchStaff();
    }
  }, [isOpen, reset, refetchStaff]);

  const onSubmit = async (data: LabourFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const labourData = {
        staff_id: data.staff_id,
        name: data.name,
        div_cd: data.div_cd,
        dept_cd: data.dept_cd,
        prefix: data.prefix || " ",
        audit_user: "WEBCS",
      };

      // Validasi data
      const validationErrors = validateLabourData(labourData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      createMutation.mutate(labourData);
    } catch (error) {
      toast.error("Gagal menambah labour");
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
          New Labour
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Labour</DialogTitle>
            <DialogDescription>
              Enter information for the new labour
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="labour">Labour</Label>
              <Controller
                name="staff_id"
                control={control}
                render={({ field }) => (
                  <SelectWithSearch
                    options={staffOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select staff..."
                    searchPlaceholder="Search..."
                    emptyMessage="Staff not found"
                  />
                )}
              />
              {errors.staff_id && (
                <p className="text-xs text-destructive">
                  {errors.staff_id.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={cn({
                  "border-destructive": errors.name,
                })}
                readOnly
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="division">Division</Label>
              <Controller
                name="div_cd"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""} 
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisionData?.data?.map((division) => (
                        <SelectItem key={division.div_cd} value={division.div_cd}>
                          {division.div_cd} - {division.descs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.div_cd && (
                <p className="text-xs text-destructive">
                  {errors.div_cd.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="departement">Department</Label>
              <Controller
                name="dept_cd"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""} 
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentData?.data?.map((department) => (
                        <SelectItem key={department.dept_cd} value={department.dept_cd}>
                          {department.dept_cd} - {department.descs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.dept_cd && (
                <p className="text-xs text-destructive">
                  {errors.dept_cd.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                {...register("prefix")}
                placeholder="Service Description"
                className={cn({
                  "border-destructive": errors.prefix,
                })}
              />
              {errors.prefix && (
                <p className="text-xs text-destructive">
                  {errors.prefix.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Labour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
