"use client";

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useEffect } from 'react'
import ImageInput from '@/components/imageInput'
import { useRouter } from '@/components/navigation';
import { toast } from 'sonner';
import { TicketDataProps, ticketData } from '../data';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const ticketFormSchema = z.object({
  entity: z.string().min(1, { message: "Entity harus dipilih" }),
  project: z.string().min(1, { message: "Project harus dipilih" }),
  source: z.string().min(1, { message: "Source harus dipilih" }),
  requestFor: z.enum(["myself", "colleague"]),
  colleagueId: z.string().optional(),
  contactPerson: z.string().optional(),
  requestBy: z.string().min(1, { message: "Request By harus diisi" }),
  contactNo: z.string().min(1, { message: "Contact No harus diisi" }),
  requestType: z.enum(["unit", "public_area"]),
  categoryGroup: z.string().min(1, { message: "Category Group harus dipilih" }),
  category: z.string().min(1, { message: "Category harus dipilih" }),
  location: z.string().min(1, { message: "Location harus dipilih" }),
  floor: z.string().min(1, { message: "Floor harus dipilih" }),
  room: z.string().min(1, { message: "Room harus dipilih" }),
  lot: z.string().min(1, { message: "Lot harus dipilih" }),
  workRequest: z
    .string()
    .min(10, { message: "Work Request minimal 10 karakter" }),
  images: z.array(z.instanceof(File)).min(1, {
    message: "Minimal 1 gambar diperlukan",
  }).max(5, {
    message: "Maksimal 5 gambar",
  }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export default function EditTicketForm({ session, reportNo }: { session: any, reportNo: string }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDataProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [showFullForm, setShowFullForm] = useState(false);

  const fetchTicket = ticketData.find((ticket) => ticket.reportNo === reportNo);

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

  useEffect(() => {
    if (entity && project) {
      setShowFullForm(true);
    }
  }, [entity, project]);

  useEffect(() => {
    const fetchTicket = ticketData.find((ticket) => ticket.reportNo === reportNo);
    if (fetchTicket) {
      setTicket(fetchTicket);
      
      // Set form values from ticket data
      if (fetchTicket.detail) {
        setValue("entity", "entity1"); // Set default entity
        setValue("project", "project1"); // Set default project
        setValue("source", fetchTicket.detail.source);
        setValue("requestFor", "myself"); // Default value
        setValue("contactPerson", fetchTicket.detail.contactPerson);
        setValue("requestBy", fetchTicket.detail.requestBy);
        setValue("contactNo", fetchTicket.detail.contactNo);
        setValue("requestType", "unit"); // Default value
        setValue("categoryGroup", ""); // Set based on category
        setValue("category", fetchTicket.category);
        setValue("location", fetchTicket.detail.location || "");
        setValue("floor", fetchTicket.detail.floor);
        setValue("room", ""); // Set if available
        setValue("lot", fetchTicket.lotNo);
        setValue("workRequest", fetchTicket.detail.workRequested);
      }
    } else {
      toast.error("Ticket tidak ditemukan");
    }
    setLoading(false);
  }, [reportNo, setValue]);

  const onSubmit = (data: TicketFormValues) => {
    console.log(data);
    console.log("Images:", images);
    
    // Handle form submission logic here
    
    // Show success message
    toast.success("Ticket updated successfully");
    
    // Redirect back to ticket list
    router.push("/customer-service/ticket/entry");
  };

  const handleCancel = () => {
    router.push("/customer-service/ticket/entry");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

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
          {/* Phase 2: Request Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b pb-2">Request Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Source */}
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
                  <p className="text-xs text-destructive">{errors.source.message}</p>
                )}
              </div>

              {/* Request For */}
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

              {/* Contact Person */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  {...register("contactPerson")}
                  placeholder="Contact person name"
                  defaultValue={ticket?.detail?.contactPerson}
                />
              </div>
            </div>

            {/* Request By & Contact No */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="requestBy"
                  className={cn("", {
                    "text-destructive": errors.requestBy,
                  })}
                >
                  Request By
                </Label>
                <Input
                  {...register("requestBy")}
                  placeholder="Requester name"
                  className={cn({
                    "border-destructive": errors.requestBy,
                  })}
                  defaultValue={ticket?.detail?.requestBy}
                />
                {errors.requestBy && (
                  <p className="text-xs text-destructive">{errors.requestBy.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contactNo"
                  className={cn("", {
                    "text-destructive": errors.contactNo,
                  })}
                >
                  Contact No
                </Label>
                <Input
                  {...register("contactNo")}
                  type="tel"
                  placeholder="Contact number"
                  className={cn({
                    "border-destructive": errors.contactNo,
                  })}
                  defaultValue={ticket?.detail?.contactNo}
                />
                {errors.contactNo && (
                  <p className="text-xs text-destructive">{errors.contactNo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3: Request Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b pb-2">Request Details</h2>
            
            {/* Request Type */}
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
                  <RadioGroupItem value="unit" id="unit" />
                  <Label htmlFor="unit">Unit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public_area" id="public_area" />
                  <Label htmlFor="public_area">Public Area</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Group & Category */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="categoryGroup"
                  className={cn("", {
                    "text-destructive": errors.categoryGroup,
                  })}
                >
                  Category Group
                </Label>
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
                    <SelectValue placeholder="Category Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoryGroup && (
                  <p className="text-xs text-destructive">{errors.categoryGroup.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="category"
                  className={cn("", {
                    "text-destructive": errors.category,
                  })}
                >
                  Category
                </Label>
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
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC Not Cold">AC Not Cold</SelectItem>
                    <SelectItem value="ELCB Problem">ELCB Problem</SelectItem>
                    <SelectItem value="ac-repair">AC Repair</SelectItem>
                    <SelectItem value="ac-maintenance">AC Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Location, Floor, Room, Lot */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="location"
                  className={cn("", {
                    "text-destructive": errors.location,
                  })}
                >
                  Location
                </Label>
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
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="1F">1F</SelectItem>
                    <SelectItem value="1G">1G</SelectItem>
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="floor"
                  className={cn("", {
                    "text-destructive": errors.floor,
                  })}
                >
                  Floor
                </Label>
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
                    <SelectValue placeholder="Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    {/* Add more floors as needed */}
                  </SelectContent>
                </Select>
                {errors.floor && (
                  <p className="text-xs text-destructive">{errors.floor.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="room"
                  className={cn("", {
                    "text-destructive": errors.room,
                  })}
                >
                  Room
                </Label>
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
                    <SelectValue placeholder="Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room1">Room 1</SelectItem>
                    <SelectItem value="room2">Room 2</SelectItem>
                    <SelectItem value="room3">Room 3</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room && (
                  <p className="text-xs text-destructive">{errors.room.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="lot"
                  className={cn("", {
                    "text-destructive": errors.lot,
                  })}
                >
                  Lot
                </Label>
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
                    <SelectValue placeholder="Lot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E11A">E11A</SelectItem>
                    <SelectItem value="E11B">E11B</SelectItem>
                    <SelectItem value="E11C">E11C</SelectItem>
                  </SelectContent>
                </Select>
                {errors.lot && (
                  <p className="text-xs text-destructive">{errors.lot.message}</p>
                )}
              </div>
            </div>

            {/* Work Request & Images */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="workRequest"
                  className={cn("", {
                    "text-destructive": errors.workRequest,
                  })}
                >
                  Work Request
                </Label>
                <Textarea
                  {...register("workRequest")}
                  placeholder="Enter work request details"
                  className={cn("min-h-[156px]", {
                    "border-destructive": errors.workRequest,
                  })}
                  defaultValue={ticket?.detail?.workRequested}
                />
                {errors.workRequest && (
                  <p className="text-xs text-destructive">{errors.workRequest.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="images">Images</Label>
                <div className="min-h-[156px]">
                  <ImageInput />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save
        </Button>
      </div>
    </form>
  );
} 