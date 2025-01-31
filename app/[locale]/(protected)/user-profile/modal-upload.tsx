"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { uploadPhotoProfile } from "@/action/profile-action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

const schema = z.object({
  filePhoto: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: "File is required.",
    })
    .refine(
      (files) =>
        files[0]?.type === "image/png" ||
        files[0]?.type === "image/jpg" ||
        files[0]?.type === "image/jpeg",
      {
        message: "Only PNG, JPG, and JPEG files are allowed.",
      }
    )
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    }),
});

const ModalUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const { data: session, update } = useSession();

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
      const formData = new FormData();
      formData.append("file", data.filePhoto[0]);

      const result = await uploadPhotoProfile(formData);

      return result;
    },
    onSuccess: async (result) => {
      if (result.statusCode === 200) {
        await update({
          ...session,
          user: {
            ...session?.user,
            image: result.data,
          },
        });
        toast.success(result.message);
        setIsModalOpenUpload(false);
        window.location.reload();
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
    mutation.mutate(data);
  }

  return (
    <Dialog open={isModalOpenUpload} onOpenChange={setIsModalOpenUpload}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 h-8 w-8 bg-default-50 text-default-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
        onClick={() => setIsModalOpenUpload(true)}
      >
        <Icon icon="heroicons:pencil-square" />
      </Button>

      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="filePhoto"
                  className={cn("lg:min-w-[160px]", {
                    "text-destructive": errors.filePhoto,
                  })}
                >
                  File
                </Label>
                <Input
                  {...register("filePhoto")}
                  type="file"
                  id="filePhoto"
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.filePhoto,
                  })}
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                />
                {errors.filePhoto && (
                  <p
                    className={cn("text-xs mt-1", {
                      "text-destructive": errors.filePhoto,
                    })}
                  >
                    {String(errors.filePhoto?.message)}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Allowed file types: .png, .jpg, .jpeg
                </p>
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
    </Dialog>
  );
};

export default ModalUpload;
