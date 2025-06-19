"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect, useMemo } from "react";
import ImageInput from "@/components/imageInput";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  getCFStaffMaster,
  getEntityMaster,
  getProjectMaster,
} from "@/action/ifca-master-action";
import { useQuery } from "@tanstack/react-query";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { getCSMasterComplainSource } from "@/action/customer-service-master";

const ticketFormSchema = z.object({
  entity: z.string().min(1, { message: "Entity must be selected" }),
  project: z.string().min(1, { message: "Project must be selected" }),
  source: z.string().min(1, { message: "Source must be selected" }),
  requestFor: z.enum(["myself", "colleague"]),
  colleagueId: z.string().optional(),
  contactPerson: z.string().optional(),
  requestBy: z.string().min(1, { message: "Request By must be filled" }),
  contactNo: z.string().min(1, { message: "Contact No must be filled" }),
  requestType: z.enum(["unit", "public_area"]),
  categoryGroup: z
    .string()
    .min(1, { message: "Category Group must be selected" }),
  category: z.string().min(1, { message: "Category must be selected" }),
  location: z.string().min(1, { message: "Location must be selected" }),
  floor: z.string().min(1, { message: "Floor must be selected" }),
  room: z.string().min(1, { message: "Room must be selected" }),
  lot: z.string().min(1, { message: "Lot must be selected" }),
  workRequest: z
    .string()
    .min(10, { message: "Work Request must be at least 10 characters" }),
  images: z
    .array(z.instanceof(File))
    .min(1, {
      message: "At least 1 image is required",
    })
    .max(5, {
      message: "Max 5 images",
    }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export default function NewTicketForm({ session }: { session: any }) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [showFullForm, setShowFullForm] = useState(false);

  const { data: entityData, isLoading: isLoadingEntityData } = useQuery({
    queryKey: ["ifca-master-entity"],
    queryFn: async () => {
      const result = await getEntityMaster();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: projectData, isLoading: isLoadingProjectData } = useQuery({
    queryKey: ["ifca-master-project"],
    queryFn: async () => {
      const result = await getProjectMaster();
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: complainSource, isLoading: isLoadingComplainSource } = useQuery(
    {
      queryKey: ["cs-master-complain-source"],
      queryFn: async () => {
        const result = await getCSMasterComplainSource();
        return result;
      },
      staleTime: 5 * 60 * 1000,
    },
  );

  const { data: staffData, isLoading: isLoadingStaffData } = useQuery({
    queryKey: ["ifca-master-staff"],
    queryFn: async () => {
      const result = await getCFStaffMaster();
      return result;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    trigger,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      entity: "",
      project: "",
      source: "",
      requestFor: "myself",
      colleagueId: "",
      contactPerson: "",
      requestBy: "",
      contactNo: "",
      requestType: "unit",
      categoryGroup: "",
      category: "",
      location: "",
      floor: "",
      room: "",
      lot: "",
      workRequest: "",
      images: [],
    },
  });

  const entity = watch("entity");
  const project = watch("project");
  const requestFor = watch("requestFor");
  const colleagueId = watch("colleagueId");

  useEffect(() => {
    if (entity && project) {
      setShowFullForm(true);
    } else {
      setShowFullForm(false);
    }
  }, [entity, project]);

  useEffect(() => {
    if (entity) {
      setValue("project", "");
    }
  }, [entity, setValue]);

  const onSubmit = async (data: TicketFormValues) => {
    console.log(data);
    console.log("Images:", images);

    toast.success("Ticket created successfully");
    router.push("/customer-service/ticket/entry");
  };

  const handleCancel = () => {
    router.push("/customer-service/ticket/entry");
  };

  const entityOptions = useMemo(() => {
    if (!entityData?.data) return [];
    return entityData.data.map((entity) => ({
      value: entity.entity_cd,
      label: entity.entity_name,
    }));
  }, [entityData?.data]);

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
    if (!complainSource?.data) return [];
    return complainSource.data.map((source) => ({
      value: source.complain_source,
      label: source.descs,
    }));
  }, [complainSource?.data]);

  const staffOptions = useMemo(() => {
    if (!staffData?.data) return [];
    return staffData.data.map((staff) => ({
      value: staff.staff_id,
      label: staff.staff_id,
    }));
  }, [staffData?.data]);

  const isProjectDisabled =
    isLoadingProjectData || isLoadingEntityData || !entity;

  useEffect(() => {
    if (requestFor === "myself") {
      setValue("contactPerson", session?.user?.name || "");
      setValue("colleagueId", "");
    } else if (requestFor === "colleague" && colleagueId) {
      const selectedStaff = staffOptions.find(
        (staff) => staff.value === colleagueId,
      );
      setValue("contactPerson", selectedStaff?.label || "");
    }
  }, [requestFor, colleagueId, session?.user?.name, setValue, staffOptions]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Phase 1: Entity dan Project */}
      <div className="space-y-4">
        <h2 className="border-b pb-2 text-lg font-medium">Entity & Project</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className={cn({ "text-destructive": errors.entity })}>
              Entity <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="entity"
              control={control}
              render={({ field }) => (
                <SelectWithSearch
                  options={entityOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Choose a Entity"
                  searchPlaceholder="Search entity..."
                  emptyMessage="Entity not found"
                  disabled={isLoadingEntityData}
                />
              )}
            />
            {errors.entity && (
              <p className="text-xs text-destructive">
                {errors.entity.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className={cn({ "text-destructive": errors.project })}>
              Project <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <SelectWithSearch
                  options={projectOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Choose a Project"
                  searchPlaceholder="Search project..."
                  emptyMessage="Project not found"
                  disabled={isProjectDisabled}
                />
              )}
            />
            {errors.project && (
              <p className="text-xs text-destructive">
                {errors.project.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {showFullForm && (
        <>
          {/* Phase 2: Source, Request For, Contact Person, Request By, Contact No */}
          <div className="space-y-4">
            <h2 className="border-b pb-2 text-lg font-medium">
              Request Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="source"
                  className={cn("", {
                    "text-destructive": errors.source,
                  })}
                >
                  Complain Source
                </Label>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <SelectWithSearch
                      options={complainSourceOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a Complain Source"
                      searchPlaceholder="Search complain source..."
                      emptyMessage="Complain source not found"
                      disabled={isLoadingComplainSource}
                    />
                  )}
                />
                {errors.source && (
                  <p className="text-xs text-destructive">
                    {errors.source.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Request For</Label>
                <RadioGroup
                  defaultValue="myself"
                  onValueChange={(value) => {
                    setValue("requestFor", value as "myself" | "colleague");
                    trigger("requestFor");
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="myself" id="myself" />
                    <Label htmlFor="myself">Myself</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="colleague" id="colleague" />
                    <Label htmlFor="colleague">Colleague</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  {...register("contactPerson")}
                  disabled
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            {/* Colleague Selection - hanya muncul jika Request For = colleague */}
            {requestFor === "colleague" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label>Colleague</Label>
                  <Controller
                    name="colleagueId"
                    control={control}
                    render={({ field }) => (
                      <SelectWithSearch
                        options={staffOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose a Colleague"
                        searchPlaceholder="Search colleague..."
                        emptyMessage="Colleague not found"
                        disabled={isLoadingStaffData}
                      />
                    )}
                  />
                </div>
                <div className="col-span-2"></div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="requestBy">PIC Name</Label>
                <Input {...register("requestBy")} placeholder="PIC Name" />
                {errors.requestBy && (
                  <p className="text-xs text-destructive">
                    {errors.requestBy.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactNo">PIC Contact No</Label>
                <Input {...register("contactNo")} placeholder="PIC Contact No" />
                {errors.contactNo && (
                  <p className="text-xs text-destructive">
                    {errors.contactNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3: Request Type dan sisanya */}
          <div className="space-y-4">
            <h2 className="border-b pb-2 text-lg font-medium">
              Location and Category Details
            </h2>
            <div className="flex flex-col gap-2">
              <Label>Request Type</Label>
              <RadioGroup
                defaultValue="unit"
                onValueChange={(value) => {
                  setValue("requestType", value as "unit" | "public_area");
                  trigger("requestType");
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unit" id="r-complaint" />
                  <Label htmlFor="r-complaint">Complaint</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public_area" id="r-request" />
                  <Label htmlFor="r-request">Request</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Group & Category */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label>Category Group</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("categoryGroup", value);
                    trigger("categoryGroup");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.categoryGroup,
                    })}
                  >
                    <SelectValue placeholder="Select Category Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoryGroup && (
                  <p className="text-xs text-destructive">
                    {errors.categoryGroup.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("category", value);
                    trigger("category");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.category,
                    })}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac">AC</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Location</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("location", value);
                    trigger("location");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.location,
                    })}
                  >
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loc1">Location 1</SelectItem>
                    <SelectItem value="loc2">Location 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-xs text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Floor, Room, Lot */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label>Floor</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("floor", value);
                    trigger("floor");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.floor,
                    })}
                  >
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.floor && (
                  <p className="text-xs text-destructive">
                    {errors.floor.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Room</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("room", value);
                    trigger("room");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.room,
                    })}
                  >
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room1">Room 1</SelectItem>
                    <SelectItem value="room2">Room 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room && (
                  <p className="text-xs text-destructive">
                    {errors.room.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Lot</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("lot", value);
                    trigger("lot");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.lot,
                    })}
                  >
                    <SelectValue placeholder="Select Lot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lot1">Lot 1</SelectItem>
                    <SelectItem value="lot2">Lot 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.lot && (
                  <p className="text-xs text-destructive">
                    {errors.lot.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 4: Work Request dan Images */}
          <div className="space-y-4">
            <h2 className="border-b pb-2 text-lg font-medium">
              Work Request and Images
            </h2>
            <div className="flex flex-col gap-2">
              <Label>Work Request</Label>
              <Textarea
                {...register("workRequest")}
                placeholder="Enter work request details"
                className="min-h-[100px]"
              />
              {errors.workRequest && (
                <p className="text-xs text-destructive">
                  {errors.workRequest.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Images (Max 5 images, 10MB per image)</Label>
              <ImageInput
                multiple
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                onChange={(files) => {
                  setImages(files);
                  setValue("images", files);
                  trigger("images");
                }}
              />
              {errors.images && (
                <p className="text-xs text-destructive">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>
        </>
      )}
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
}
