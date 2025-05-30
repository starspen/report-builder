"use client";

import { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAdditionalFile } from "@/action/invoice-action";

const schema = z.object({
  fileAdditional: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: "File is required.",
    })
    .refine((files) => files[0]?.type === "application/pdf", {
      message: "Only PDF files are allowed.",
    })
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    }),
});
export const FormUploadAdditionalFile = ({
  setIsModalOpenUpload,
  dataProp,
}: {
  setIsModalOpenUpload: (value: boolean) => void;
  dataProp: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const formData = new FormData();
      formData.append("file", data.fileAdditional);
      formData.append("doc_no", dataProp.doc_no);
      formData.append("process_id", dataProp.process_id);
      formData.append("file_type", "invoice");

      const result = await uploadAdditionalFile(formData);
      return result;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["invoice-email"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
      setIsModalOpenUpload(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    for (const file of data.fileAdditional) {
      mutation.mutate({ fileAdditional: file });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Additional File</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="fileAdditional"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.fileAdditional,
                })}
              >
                File
              </Label>
              <Input
                {...register("fileAdditional")}
                type="file"
                id="fileAdditional"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.fileAdditional,
                })}
                accept=".pdf"
                onChange={handleFileChange}
              />
              {errors.fileAdditional && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.fileAdditional,
                  })}
                >
                  {String(errors.fileAdditional?.message)}
                </p>
              )}
              <p className="text-xs text-red-500">Allowed file types: .pdf</p>
              <p className="text-xs text-red-500">Size must be less than 5MB</p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            {!isLoading && (
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpenUpload(false)}
                >
                  Close
                </Button>
              </DialogClose>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
