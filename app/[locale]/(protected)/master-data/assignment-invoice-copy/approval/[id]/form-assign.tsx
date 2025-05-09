"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { assignApprovalAmountForType, insertAssignmentInvoice } from "@/action/master-type-invoice-action";
import { useRouter } from "@/components/navigation";

export const schema = z.object({
  typeId: z.string().optional(),
  typeCd: z.string().min(2, { message: "This field is required." }),
  typeDescs: z.string().min(2, { message: "This field is required." }),
  approval: z
    .array(
      z.preprocess(
        (val) => {
          // if it's a number, coerce it to string; otherwise leave it as-is
          if (typeof val === "number") return String(val);
          return val;
        },
        z
          .string()
          .min(1, { message: "Required" })
          // ensure the string is purely digits
          .refine((s) => /^\d+$/.test(s), {
            message: "Must be a numeric string",
          })
      )
    )
    .min(1, { message: "At least one approval amount is required." }),
});

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
  icon?: string;
}

export const FormAssign = ({
  dataAssign,
  dataUser,
}: {
  dataAssign: any;
  dataUser: any;
}) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const router = useRouter();
  const animatedComponents = makeAnimated();
  const users: OptionType[] = dataUser
    ?.filter(
      (item: any) => item.role === "maker and blaster" || item.role === "maker"
    )
    .map((item: any) => ({
      value: item.user_id,
      label: item.name,
    }));

  const usersApproval: OptionType[] = dataUser
    ?.filter((item: any) => item.role === "approver")
    .map((item: any) => ({
      value: item.user_id,
      label: item.name,
    }));

  const styles = {
    multiValue: (base: any, state: any) => {
      return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
    },
    multiValueLabel: (base: any, state: any) => {
      return state.data.isFixed
        ? { ...base, color: "#626262", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base: any, state: any) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const mapUser = (users: OptionType[]) => (item: any) => ({
    value: item.user_id,
    label: users.find((user) => user.value === item.user_id)?.label || "",
  });
  console.log(dataAssign)
  console.log(dataUser)
  const getDefaultValues = (
    dataAssign: any,
    users: OptionType[]
  ) => {
    if (!Array.isArray(dataAssign) || dataAssign.length === 0) return {};

    const details = dataAssign[0]?.detail || [];
    const approvalDefaults = (dataAssign[0].amtRange || []).map(
      (r: any) => r.approval_amt
    );

    return {
      typeId: dataAssign[0]?.type_id,
      typeCd: dataAssign[0]?.type_cd,
      typeDescs: dataAssign[0]?.type_descs,
      maker: details
        .filter((item: any) => item.job_task === "Maker")
        .map(mapUser(users)),
      approval: approvalDefaults,
      stampBlast: details.find((item: any) => item.job_task === "Stamp & Blast")
        ? mapUser(users)(
            details.find((item: any) => item.job_task === "Stamp & Blast")
          )
        : { value: "", label: "" },
    };
  };

  const getFilteredUsers = (data: any, index: number) => {
    const selectedValues = data.approval
      .filter((approval: OptionType | null) => approval && approval.value)
      .map((approval: OptionType) => approval.value);

    return usersApproval?.filter(
      (userApproval) =>
        !selectedValues.includes(userApproval.value) ||
        data.approval[index]?.value === userApproval.value
    );
  };

  // Helper function untuk mapping role
  const mapRole = (role: string) => (user: OptionType | null) => ({
    user_id: user?.value || "",
    role,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: getDefaultValues(dataAssign, users),
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    // mutationFn: async (data: z.infer<typeof schema>) => {
    mutationFn: async (data: {
      type_id: string;
      type_cd: string;
      detail: { amt_range_id: number; approval_count: string }[];
    }) => {
      setIsLoadingSubmit(true);
      const result = await assignApprovalAmountForType(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        router.push("/master-data/assignment-invoice-copy");
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

  function formatDataForSubmission(data: any) {
    return {
      // snake‐case key for your API
      type_id: data.typeId,
      type_cd: data.typeCd,
      detail: data.approval.map((approvalCount: string, idx: number) => ({
        // pull the ID out of your original amtRange array
        amt_range_id: dataAssign[0].amtRange[idx].rowID,
        // send the approval count
        approval_count: Number(approvalCount),
      })),
    };
  }
  

  // function onSubmit(data: z.infer<typeof schema>) {
  function onSubmit(data: any) {
    console.log(data)
    const formattedData = formatDataForSubmission(data);
    mutation.mutate(formattedData);
  }



  const dataApproval = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input {...register("typeId")} type="hidden" id="typeId" readOnly />
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="typeCd"
            className={cn("lg:min-w-[200px]", {
              "text-destructive": errors.typeCd,
            })}
          >
            Type Code
          </Label>
          <div className="flex flex-col w-full">
            <Input
              {...register("typeCd")}
              type="text"
              id="typeCd"
              className={cn("", {
                "border-destructive focus:border-destructive": errors.typeCd,
              })}
              maxLength={10}
              readOnly
            />
            {errors.typeCd && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.typeCd,
                })}
              >
                {String(errors.typeCd?.message)}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="typeDescs"
            className={cn("lg:min-w-[200px]", {
              "text-destructive": errors.typeDescs,
            })}
          >
            Description
          </Label>
          <div className="flex flex-col w-full">
            <Input
              {...register("typeDescs")}
              type="text"
              id="typeDescs"
              className={cn("", {
                "border-destructive focus:border-destructive": errors.typeDescs,
              })}
              readOnly
            />
            {errors.typeDescs && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.typeDescs,
                })}
              >
                {errors.typeDescs?.message}
              </p>
            )}
          </div>
        </div>
        {Array.from({ length: dataAssign[0]?.amtRange.length }).map((_, index) => (
          <div
            key={`approval-${index}`}
            className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start"
          >
            <Label
              htmlFor={`approval${index}`}
              className={cn("lg:min-w-[200px]", {
                "text-destructive": errors.approval && errors.approval[index],
              })}
            >
              {/* Approval {index + 1} */}
              {dataAssign[0]?.amtRange[index].min} - {dataAssign[0]?.amtRange[index].max}
            </Label>
            <div className="flex flex-col w-full">
              <Input
                {...register(`approval.${index}`)}
                id={`approval${index}`}
                className={cn("react-select", {
                  "border-destructive focus:border-destructive":
                    errors.approval && errors.approval[index],
                })}
                placeholder={`Choose Approval amount`}
              />
              {errors.approval && errors.approval[index] && (
                <p
                  className={cn("text-xs mt-1", {
                    "text-destructive": errors.approval[index],
                  })}
                >
                  {String(errors.approval[index]?.message)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button type="submit" disabled={isLoadingSubmit}>
          {isLoadingSubmit ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
