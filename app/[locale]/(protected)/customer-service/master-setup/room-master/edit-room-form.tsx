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
  updateCSMasterRoom,
} from "@/action/customer-service-master";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { getEntityMaster, getProjectMaster } from "@/action/ifca-master-action";
import { SelectWithSearch } from "@/components/ui/select-with-search";

// Schema validasi untuk form room
const roomFormSchema = z.object({
    entity_cd: z
    .string()
    .min(1, { message: "Entity code harus diisi" })
    .max(4, { message: "Entity code maksimal 4 karakter" }),
  project_no: z
    .string()
    .min(1, { message: "Project number harus diisi" })
    .max(20, { message: "Project number maksimal 20 karakter" }),
  room_cd: z
    .string()
    .min(1, { message: "Room code harus diisi" })
    .max(6, { message: "Room code maksimal 6 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface EditRoomFormProps {
  roomData: {
    entity_cd: string;
    project_no: string;
    room_cd: string;
    descs: string;
    rowID: string;
  };
  user?: any;
}

export default function EditRoomForm({ roomData, user }: EditRoomFormProps) {
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
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      entity_cd: roomData.entity_cd,
      project_no: roomData.project_no,
      room_cd: roomData.room_cd,
      descs: roomData.descs,
    },
  });

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

  // Mutation untuk update room
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCSMasterRoom(id, data),
    onSuccess: (data) => {
      toast.success("Room berhasil diupdate");

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch data room
      queryClient.invalidateQueries({
        queryKey: ["cs-master-room"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengupdate room");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset({
        entity_cd: roomData.entity_cd,
        project_no: roomData.project_no,
        room_cd: roomData.room_cd,
        descs: roomData.descs,
      });
    }
  }, [isOpen, reset, roomData]);

  const entity = watch("entity_cd");

  // Reset project ketika entity berubah
  useEffect(() => {
    if (entity && entity !== roomData.entity_cd) {
      setValue("project_no", "");
    }
  }, [entity, setValue, roomData.entity_cd]);

  const onSubmit = async (data: RoomFormValues) => {
    try {
      // Siapkan data sesuai dengan format API
      const updateData = {
        entity_cd: data.entity_cd,
        project_no: data.project_no,
        room_cd: data.room_cd.toUpperCase().trim(),
        descs: data.descs.trim(),
        audit_user: "WEBCS",
      };

      // Kirim data ke API
      updateMutation.mutate({
        id: Number(roomData.rowID),
        data: updateData,
      });
    } catch (error) {
      toast.error("Gagal mengupdate room");
    }
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

  const isProjectDisabled = isLoadingProjectData || isLoadingEntityData || !entity;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="soft"
          className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
          disabled={updateMutation.isPending}
        >
          <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          Edit Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update information for the selected room
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="room_cd"
                className={cn({
                  "text-destructive": errors.room_cd,
                })}
              >
                Room Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="room_cd"
                placeholder="ROOM001"
                {...register("room_cd")}
                className={cn({
                  "border-destructive": errors.room_cd,
                })}
                disabled={updateMutation.isPending}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("room_cd").onChange(e);
                }}
              />
              {errors.room_cd && (
                <p className="text-xs text-destructive">
                  {errors.room_cd.message}
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
                placeholder="Room description"
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
              {updateMutation.isPending ? "Updating..." : "Update Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}