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
import { uploadFakturPajak } from "@/action/invoice-action";

const schema = z.object({
  fileFaktur: z
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
export const FormUpload = ({
  setIsModalOpenUpload,
}: {
  setIsModalOpenUpload: (value: boolean) => void;
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
      setIsLoading(true);
      const nameFile = data.fileFaktur.name;
      const exFileName = nameFile.split("_");
      const docNoInfo = exFileName[1].split(".")[0];

      const formData = new FormData();
      formData.append("file", data.fileFaktur);
      formData.append("docNo", docNoInfo);

      const result = await uploadFakturPajak(formData);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["invoice-email"],
        });
        setIsModalOpenUpload(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    for (const file of data.fileFaktur) {
      mutation.mutate({ fileFaktur: file });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Faktur Pajak</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="fileFaktur"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.fileFaktur,
                })}
              >
                File
              </Label>
              <p className="text-xs text-gray-500">
                Example FileName: FP_document number.pdf
              </p>
              <Input
                {...register("fileFaktur")}
                type="file"
                id="fileFaktur"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.fileFaktur,
                })}
                accept=".pdf"
                multiple
                onChange={handleFileChange}
              />
              {errors.fileFaktur && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.fileFaktur,
                  })}
                >
                  {String(errors.fileFaktur?.message)}
                </p>
              )}
              <p className="text-xs text-gray-500">Allowed file types: .pdf</p>
              <p className="text-xs text-gray-500">
                Size must be less than 5MB
              </p>
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
