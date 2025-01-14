"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getEmailConfig,
  submitEmailConfig,
} from "@/action/email-config-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  mailDriver: z.string().min(2, { message: "This field is required." }),
  mailHost: z.string().min(2, { message: "This field is required." }),
  mailPort: z.string().min(2, { message: "This field is required." }),
  mailUsername: z.string().min(2, { message: "This field is required." }),
  mailPassword: z.string().min(2, { message: "This field is required." }),
  mailEncryption: z.string().min(2, { message: "This field is required." }),
  mailFromName: z.string().min(2, { message: "This field is required." }),
  mailFromAddress: z.string().min(2, { message: "This field is required." }),
});

const HorizontalForm = () => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["email-config"],
    queryFn: async () => {
      const result = await getEmailConfig();

      return result;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      setIsLoadingSubmit(true);
      const result = await submitEmailConfig(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        queryClient.invalidateQueries({
          queryKey: ["email-config"],
        });
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

  useEffect(() => {
    if (data) {
      setValue("mailDriver", data?.data[0]?.driver);
      setValue("mailHost", data?.data[0]?.host);
      setValue("mailPort", data?.data[0]?.port);
      setValue("mailUsername", data?.data[0]?.username);
      setValue("mailPassword", data?.data[0]?.password);
      setValue("mailEncryption", data?.data[0]?.encryption);
      setValue("mailFromName", data?.data[0]?.sender_name);
      setValue("mailFromAddress", data?.data[0]?.sender_email);
    }
  }, [data, setValue]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailDriver"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailDriver,
            })}
          >
            Mail Driver
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailDriver")}
              id="mailDriver"
              // defaultValue={mailDriver || ""}
              onChange={(e) => setValue("mailDriver", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailDriver,
              })}
            />
            {errors.mailDriver && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailDriver,
                })}
              >
                {errors.mailDriver.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailHost"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailHost,
            })}
          >
            Mail Host
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailHost")}
              id="mailHost"
              // defaultValue={mailHost || ""}
              onChange={(e) => setValue("mailHost", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive": errors.mailHost,
              })}
            />
            {errors.mailHost && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailHost,
                })}
              >
                {errors.mailHost.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailPort"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailPort,
            })}
          >
            Mail Port
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailPort")}
              id="mailPort"
              // defaultValue={mailPort || ""}
              onChange={(e) => setValue("mailPort", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive": errors.mailPort,
              })}
            />
            {errors.mailPort && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailPort,
                })}
              >
                {errors.mailPort.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailUsername"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailUsername,
            })}
          >
            Mail Username
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailUsername")}
              id="mailUsername"
              // defaultValue={mailUsername || ""}
              onChange={(e) => setValue("mailUsername", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailUsername,
              })}
            />
            {errors.mailUsername && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailUsername,
                })}
              >
                {errors.mailUsername.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailPassword"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailPassword,
            })}
          >
            Mail Password
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="password"
              {...register("mailPassword")}
              id="mailPassword"
              // defaultValue={mailPassword || ""}
              onChange={(e) => setValue("mailPassword", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailPassword,
              })}
            />
            {errors.mailPassword && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailPassword,
                })}
              >
                {errors.mailPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailEncryption"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailEncryption,
            })}
          >
            Mail Encryption
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailEncryption")}
              id="mailEncryption"
              // defaultValue={mailEncryption || ""}
              onChange={(e) => setValue("mailEncryption", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailEncryption,
              })}
            />
            {errors.mailEncryption && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailEncryption,
                })}
              >
                {errors.mailEncryption.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailFromName"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailFromName,
            })}
          >
            Mail From Name
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailFromName")}
              id="mailFromName"
              // defaultValue={mailFromName || ""}
              onChange={(e) => setValue("mailFromName", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailFromName,
              })}
            />
            {errors.mailFromName && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailFromName,
                })}
              >
                {errors.mailFromName.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2  flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="mailFromAddress"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.mailFromAddress,
            })}
          >
            Mail From Address
          </Label>
          <div className="flex flex-col w-full">
            <Input
              type="text"
              {...register("mailFromAddress")}
              id="mailFromAddress"
              // defaultValue={mailFromAddress || ""}
              onChange={(e) => setValue("mailFromAddress", e.target.value)}
              className={cn("", {
                "border-destructive focus:border-destructive":
                  errors.mailFromAddress,
              })}
            />
            {errors.mailFromAddress && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.mailFromAddress,
                })}
              >
                {errors.mailFromAddress.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2 lg:pl-[160px] mt-2">
          <Button type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default HorizontalForm;
