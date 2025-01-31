"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTypeInvoiceById,
  updateTypeInvoice,
} from "@/action/master-type-invoice-action";
import { Task } from "./columns";

const schema = z.object({
  typeId: z.string().optional(),
  typeCd: z.string().min(2, { message: "This field is required." }),
  typeDescs: z.string().min(2, { message: "This field is required." }),
  approvalPic: z.string().min(1, { message: "This field is required." }),
});
export const FormEdit = ({
  setIsModalOpen,
  row,
}: {
  setIsModalOpen: (value: boolean) => void;
  row: Task;
}) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      typeId: row.type_id,
      typeCd: row.type_cd,
      typeDescs: row.type_descs,
      approvalPic: row.approval_pic,
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoadingSubmit(true);
      const result = await updateTypeInvoice(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["master-type-receipt"],
        });
        setIsModalOpen(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoadingSubmit(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    mutation.mutate(data);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Type Invoice</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <Input {...register("typeId")} type="hidden" id="typeId" readOnly />
            <div className="space-y-2">
              <Label
                htmlFor="typeCd"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.typeCd,
                })}
              >
                Type Code
              </Label>
              <Input
                {...register("typeCd")}
                type="text"
                id="typeCd"
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.typeCd,
                })}
                maxLength={10}
              />
              {errors.typeCd && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.typeCd,
                  })}
                >
                  {errors.typeCd.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="typeDescs"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.typeDescs,
                })}
              >
                Description
              </Label>
              <Input
                {...register("typeDescs")}
                type="text"
                id="typeDescs"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.typeDescs,
                })}
              />
              {errors.typeDescs && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.typeDescs,
                  })}
                >
                  {errors.typeDescs.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="approvalPic"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.approvalPic,
                })}
              >
                Approval PIC
              </Label>
              <Input
                {...register("approvalPic")}
                type="text"
                id="approvalPic"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.approvalPic,
                })}
                maxLength={2}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[1-9]\d*$/.test(value)) {
                    e.target.value = value;
                  } else {
                    e.target.value = value.slice(0, -1);
                  }
                }}
              />
              {errors.approvalPic && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.approvalPic,
                  })}
                >
                  {errors.approvalPic.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            {!isLoadingSubmit && (
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogClose>
            )}

            <Button type="submit" disabled={isLoadingSubmit}>
              {isLoadingSubmit ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
