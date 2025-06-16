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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createCSMasterFeedbackSetup } from "@/action/customer-service-master";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Schema validasi untuk form feedback setup
const feedbackSetupFormSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Code harus diisi" })
    .max(4, { message: "Code maksimal 4 karakter" }),
  descs: z
    .string()
    .min(1, { message: "Deskripsi harus diisi" })
    .max(255, { message: "Deskripsi maksimal 255 karakter" }),
});

type FeedbackSetupFormValues = z.infer<typeof feedbackSetupFormSchema>;

interface NewFeedbackSetupFormProps {
  user?: any;
}

export default function NewFeedbackSetupForm({ user }: NewFeedbackSetupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackSetupFormValues>({
    resolver: zodResolver(feedbackSetupFormSchema),
    defaultValues: {
      code: "",
      descs: "",
    },
  });

  // Mutation untuk create feedback
  const createMutation = useMutation({
    mutationFn: createCSMasterFeedbackSetup,
    onSuccess: (data) => {
      toast.success("Feedback berhasil ditambahkan");

      // Reset form
      reset();

      // Tutup modal
      setIsOpen(false);

      // Invalidate dan refetch
      queryClient.invalidateQueries({
        queryKey: ["cs-master-feedback-setup"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah feedback");
    },
  });

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FeedbackSetupFormValues) => {
    try {
      const feedbackData = {
        code: data.code.toUpperCase().trim(),
        descs: data.descs.trim(),
      };

      createMutation.mutate(feedbackData);
    } catch (error) {
      toast.error("Gagal menambah feedback");
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
          Add Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Feedback</DialogTitle>
            <DialogDescription>
              Enter information for the new feedback
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Code */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="code"
                className={cn({
                  "text-destructive": errors.code,
                })}
              >
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Enter code"
                {...register("code")}
                className={cn({
                  "border-destructive": errors.code,
                })}
                disabled={createMutation.isPending}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  e.target.value = value;
                  register("code").onChange(e);
                }}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
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
                placeholder="Enter description"
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
              {createMutation.isPending ? "Adding..." : "Add Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
