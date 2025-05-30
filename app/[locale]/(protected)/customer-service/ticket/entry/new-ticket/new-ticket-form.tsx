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
import React, { useState, useEffect } from "react";
import ImageInput from "@/components/imageInput";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

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
  categoryGroup: z.string().min(1, { message: "Category Group must be selected" }),
  category: z.string().min(1, { message: "Category must be selected" }),
  location: z.string().min(1, { message: "Location must be selected" }),
  floor: z.string().min(1, { message: "Floor must be selected" }),
  room: z.string().min(1, { message: "Room must be selected" }),
  lot: z.string().min(1, { message: "Lot must be selected" }),
  workRequest: z
    .string()
    .min(10, { message: "Work Request must be at least 10 characters" }),
  images: z.array(z.instanceof(File)).min(1, {
    message: "At least 1 image is required",
  }).max(5, {
    message: "Max 5 images",
  }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export default function NewTicketForm({ session }: { session: any }) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [showFullForm, setShowFullForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
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

  // Menampilkan form lengkap hanya jika entity dan project sudah dipilih
  React.useEffect(() => {
    if (entity && project) {
      setShowFullForm(true);
    }
  }, [entity, project]);

  // Tambahkan useEffect untuk memicu validasi ulang saat form disubmit
  useEffect(() => {
    if (isSubmitted) {
      // Memicu validasi ulang untuk semua field saat form disubmit
      trigger();
    }
  }, [isSubmitted, trigger]);

  const onSubmit = async (data: TicketFormValues) => {
    // Memicu validasi manual untuk semua field
    const isValid = await trigger();

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log(data);
    console.log("Images:", images);

    // Handle form submission logic here

    // Show success message
    toast.success("Ticket created successfully");

    // Redirect back to ticket list
    router.push("/customer-service/ticket/entry");
  };

  const handleCancel = () => {
    router.push("/customer-service/ticket/entry");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Phase 1: Entity dan Project */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Entity & Project</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="entity"
              className={cn("", {
                "text-destructive": errors.entity,
              })}
            >
              Entity
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("entity", value);
                trigger("entity");
              }}
            >
              <SelectTrigger
                className={cn({
                  "border-destructive": errors.entity,
                })}
              >
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entity1">Entity 1</SelectItem>
                <SelectItem value="entity2">Entity 2</SelectItem>
                <SelectItem value="entity3">Entity 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.entity && (
              <p className="text-xs text-destructive">{errors.entity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="project"
              className={cn("", {
                "text-destructive": errors.project,
              })}
            >
              Project
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("project", value);
                trigger("project");
              }}
            >
              <SelectTrigger
                className={cn({
                  "border-destructive": errors.project,
                })}
              >
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
                <SelectItem value="project3">Project 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.project && (
              <p className="text-xs text-destructive">{errors.project.message}</p>
            )}
          </div>
        </div>
      </div>

      {showFullForm && (
        <>
          {/* Phase 2: Source, Request For, Contact Person, Request By, Contact No */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b pb-2">Request Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="source"
                  className={cn("", {
                    "text-destructive": errors.source,
                  })}
                >
                  Source
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("source", value);
                    trigger("source");
                  }}
                >
                  <SelectTrigger
                    className={cn({
                      "border-destructive": errors.source,
                    })}
                  >
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="web_cs">Web CS</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="lobby">Lobby</SelectItem>
                  </SelectContent>
                </Select>
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
                    if (value === "myself") {
                      setValue("contactPerson", session?.user?.name || "");
                    } else {
                      setValue("contactPerson", "");
                    }
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
                  defaultValue={
                    watch("requestFor") === "myself" ? session?.user?.name : ""
                  }
                />
              </div>
            </div>

            {/* Colleague Selection - hanya muncul jika Request For = colleague */}
            {watch("requestFor") === "colleague" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label>Colleague</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("colleagueId", value);
                      // Mengisi Contact Person berdasarkan colleague yang dipilih
                      if (value === "staff1") setValue("contactPerson", "Fardi");
                      else if (value === "staff2")
                        setValue("contactPerson", "Zakaria");
                      else if (value === "staff3")
                        setValue("contactPerson", "Daniel");
                      trigger("colleagueId");
                    }}
                  >
                    <SelectTrigger
                      className={cn({
                        "border-destructive": errors.colleagueId,
                      })}
                    >
                      <SelectValue placeholder="Select Colleague" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff1">Fardi</SelectItem>
                      <SelectItem value="staff2">Zakaria</SelectItem>
                      <SelectItem value="staff3">Daniel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2"></div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="requestBy">Request By</Label>
                <Input {...register("requestBy")} placeholder="Request By" />
                {errors.requestBy && (
                  <p className="text-xs text-destructive">
                    {errors.requestBy.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactNo">Contact No</Label>
                <Input {...register("contactNo")} placeholder="Contact No" />
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
            <h2 className="text-lg font-medium border-b pb-2">Location and Category Details</h2>
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
                  <RadioGroupItem value="unit" id="r-unit" />
                  <Label htmlFor="r-unit">Unit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public_area" id="r-public" />
                  <Label htmlFor="r-public">Public Area</Label>
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
                  <p className="text-xs text-destructive">{errors.lot.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 4: Work Request dan Images */}
          <div className="space-y-4">
              <h2 className="text-lg font-medium border-b pb-2">Work Request and Images</h2>
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
