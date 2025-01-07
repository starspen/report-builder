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
import { insertMasterUser } from "@/action/master-user-action";

const schema = z.object({
  userName: z.string().min(2, { message: "This field is required." }),
  userEmail: z.string().min(2, { message: "This field is required." }),
});
export const FormAdd = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void;
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

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoading(true);
      const result = await insertMasterUser(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["master-user"],
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
      setIsLoading(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    mutation.mutate(data);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add User</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.userName,
                })}
              >
                Name
              </Label>
              <Input
                {...register("userName")}
                type="text"
                id="userName"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.userName,
                })}
              />
              {errors.userName && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.userName,
                  })}
                >
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="userEmail"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.userEmail,
                })}
              >
                Email
              </Label>
              <Input
                {...register("userEmail")}
                type="email"
                id="userEmail"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.userEmail,
                })}
              />
              {errors.userEmail && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.userEmail,
                  })}
                >
                  {errors.userEmail.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            {!isLoading && (
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogClose>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
