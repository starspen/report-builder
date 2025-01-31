"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { changePassword } from "@/action/profile-action";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";

const schema = z
  .object({
    newPassword: z.string().min(2, { message: "This field is required." }),
    confirmPassword: z.string().min(2, { message: "This field is required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const HorizontalForm = () => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [passwordType, setPasswordType] = React.useState("password");
  const [passwordConfirmType, setPasswordConfirmType] =
    React.useState("password");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  const togglePasswordConfirmType = () => {
    if (passwordConfirmType === "text") {
      setPasswordConfirmType("password");
    } else if (passwordConfirmType === "password") {
      setPasswordConfirmType("text");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoadingSubmit(true);
      const result = await changePassword(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        window.location.reload();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="newPassword"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.newPassword,
            })}
          >
            New Password
          </Label>
          <div className="flex flex-col w-full">
            <InputGroup>
              <Input
                {...register("newPassword")}
                type={passwordType}
                id="newPassword"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.newPassword,
                })}
              />
              <InputGroupText
                className="cursor-pointer"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </InputGroupText>
            </InputGroup>

            {errors.newPassword && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.newPassword,
                })}
              >
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="confirmPassword"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.confirmPassword,
            })}
          >
            Confirm Password
          </Label>
          <div className="flex flex-col w-full">
            <InputGroup>
              <Input
                {...register("confirmPassword")}
                type={passwordConfirmType}
                id="confirmPassword"
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.confirmPassword,
                })}
              />
              <InputGroupText
                className="cursor-pointer"
                onClick={togglePasswordConfirmType}
              >
                {passwordConfirmType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </InputGroupText>
            </InputGroup>
            {errors.confirmPassword && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.confirmPassword,
                })}
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2 lg:pl-[160px] mt-2">
          <Button type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default HorizontalForm;
