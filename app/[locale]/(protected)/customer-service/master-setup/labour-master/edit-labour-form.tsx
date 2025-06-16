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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCFDivisionMaster, getCFDepartmentMaster, getCFStaffMaster } from "@/action/ifca-master-action";
import { updateCSMasterLabour, validateLabourData, CSMasterLabour } from "@/action/customer-service-master";

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

interface EditLabourFormProps {
  labourData: CSMasterLabour;
}

export default function EditLabourForm({ labourData }: EditLabourFormProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<LabourFormValues>({
    resolver: zodResolver(labourFormSchema),
    defaultValues: {
      staff_id: labourData.staff_id,
      name: labourData.name,
      div_cd: labourData.div_cd,
      dept_cd: labourData.dept_cd,
      prefix: labourData.prefix,
      audit_user: labourData.audit_user,
    },
  });

  // Mutation untuk update labour
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCSMasterLabour(labourData.rowID, data),
    onSuccess: (data) => {
      toast.success("Labour berhasil diupdate");
      
      // Tutup modal
      setIsOpen(false);
      
      // Invalidate dan refetch data labour
      queryClient.invalidateQueries({ queryKey: ["cs-master-labour"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate labour");
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

  // Query untuk data staff (semua staff, bukan hanya yang belum jadi labour)
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["cf-staff-master"],
    queryFn: async () => {
      const result = await getCFStaffMaster();
      return result;
    },
  });

  // Reset form dengan data labour ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        staff_id: labourData.staff_id,
        name: labourData.name,
        div_cd: labourData.div_cd,
        dept_cd: labourData.dept_cd,
        prefix: labourData.prefix,
        audit_user: labourData.audit_user,
      });
    }
  }, [isOpen, labourData, reset]);

  const onSubmit = async (data: LabourFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        staff_id: data.staff_id,
        name: data.name,
        div_cd: data.div_cd,
        dept_cd: data.dept_cd,
        prefix: data.prefix || "",
        audit_user: "WEBCS",
      };

      // Validasi data
      const validationErrors = validateLabourData(updateData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join(", "));
        return;
      }

      // Kirim data ke API
      updateMutation.mutate(updateData);
    } catch (error) {
      toast.error("Gagal mengupdate labour");
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
          Edit Labour
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Labour</DialogTitle>
            <DialogDescription>
              Update information for the selected labour
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="staff_id">Staff ID</Label>
              <Controller
                name="staff_id"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                    disabled // Disabled karena tidak bisa diubah
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffData?.data?.map((item) => (
                        <SelectItem key={item.staff_id} value={item.staff_id}>
                          {item.staff_id} - {item.staff_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}