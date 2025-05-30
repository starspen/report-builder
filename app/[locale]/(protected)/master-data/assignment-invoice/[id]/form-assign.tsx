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
import { insertAssignmentInvoice } from "@/action/master-type-invoice-action";
import { useRouter } from "@/components/navigation";

export const schema = z.object({
  typeId: z.string().optional(),
  typeCd: z.string().min(2, { message: "This field is required." }),
  typeDescs: z.string().min(2, { message: "This field is required." }),
  maker: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, { message: "Required" }),
  approval: z
    .array(
      z.array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
    )
    .min(0, { message: "Required" }),
  stampBlast: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, { message: "Required" }),
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
    ?.filter((item: any) =>
      Array.isArray(item.roles) &&
      (item.roles.includes("maker and blaster") ||
      item.roles.includes("maker"))
    )
    .map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

  const usersApproval: OptionType[] = dataUser
    ?.filter((item: any) =>
      Array.isArray(item.roles) &&
      (item.roles.includes("approver")
    ))
    .map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

  const usersBlast: OptionType[] = dataUser
    ?.filter((item: any) =>
      Array.isArray(item.roles) &&
      (item.roles.includes("maker and blaster") ||
      item.roles.includes("blaster"))
    )
    .map((item: any) => ({
      value: item.id,
      label: item.name,
    })) || [];


  console.log(dataUser)
  console.log(dataAssign)
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

  const getDefaultValues = (
    dataAssign: any,
    users: OptionType[],
    usersApproval: OptionType[],
    usersBlast: OptionType[]
  ) => {
    if (!Array.isArray(dataAssign) || dataAssign.length === 0) return {};

    const details = dataAssign[0]?.detail || [];

    return {
      typeId: dataAssign[0]?.type_id,
      typeCd: dataAssign[0]?.type_cd,
      typeDescs: dataAssign[0]?.type_descs,
      maker: details
        .filter((item: any) => item.job_task === "Maker")
        .map(mapUser(users)),
      // approval: details
      //   .filter((item: any) => item.job_task.startsWith("Approval"))
      //   .sort((a: any, b: any) => a.job_task.localeCompare(b.job_task))
      //   .map(mapUser(usersApproval)),
      approval: Array.from({ length: dataAssign[0]?.approval_pic || 0 }).map(
        (_, index) => {
          const level = `Approval Lvl ${index + 1}`;
          return details
            .filter((item: any) => item.job_task === level)
            .map(mapUser(usersApproval));
        }
      ),
      stampBlast: details
        .filter((item: any) => item.job_task === "Stamp & Blast")
        .map(mapUser(usersBlast)),
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
    defaultValues: getDefaultValues(
      dataAssign,
      users,
      usersApproval,
      usersBlast
    ),
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    // mutationFn: async (data: z.infer<typeof schema>) => {
    mutationFn: async (data: {
      type_id: string;
      detail: { user_id: string; role: string }[];
    }) => {
      const result = await insertAssignmentInvoice(data);
      return result;
    },
    onMutate: () => {
      setIsLoadingSubmit(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        router.push("/master-data/assignment-invoice");
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
      type_id: data.typeId,
      detail: [
        ...data.maker.map(mapRole("Maker")),
        ...data.approval.flatMap(
          (approvalGroup: OptionType[] | undefined, index: number) =>
            (approvalGroup || []).map(mapRole(`Approval Lvl ${index + 1}`))
        ),
        ...data.stampBlast.map(mapRole("Stamp & Blast")),
      ],
    };
  }

  // function onSubmit(data: z.infer<typeof schema>) {
  function onSubmit(data: any) {
    const formattedData = formatDataForSubmission(data);
    mutation.mutate(formattedData);
  }

  const handleApprovalChange = (
    index: number,
    newValue: OptionType[] | null
  ) => {
    setValue(`approval.${index}`, newValue || []);
  };

  const defaultMakers = dataAssign[0]?.detail
    .filter((item: any) => item.job_task === "Maker")
    .map((item: any) => ({
      value: item.user_id,
      label:
        users.find((user: any) => user.value === item.user_id)?.label || "",
    }));

  const defaultStampBlast = dataAssign[0]?.detail
    .filter((item: any) => item.job_task === "Stamp & Blast")
    .map((item: any) => ({
      value: item.user_id,
      label:
        usersBlast.find((user: any) => user.value === item.user_id)?.label ||
        "",
    }));

  // const defaultApprovals = dataAssign[0]?.detail
  //   .filter((item: any) => item.job_task.startsWith("Approval"))
  //   .sort((a: any, b: any) => a.job_task.localeCompare(b.job_task))
  //   .map((item: any) => ({
  //     value: item.user_id,
  //     label:
  //       usersApproval.find((user: any) => user.value === item.user_id)?.label ||
  //       "",
  //   }));

  const defaultApprovals = Array.from({
    length: dataAssign[0]?.approval_pic || 0,
  }).map((_, index) => {
    const level = `Approval Lvl ${index + 1}`;
    return dataAssign[0]?.detail
      .filter((item: any) => item.job_task === level)
      .map((item: any) => ({
        value: item.user_id,
        label:
          usersApproval.find((user: any) => user.value === item.user_id)
            ?.label || "",
      }));
  });

  const dataApproval = watch() || {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input {...register("typeId")} type="hidden" id="typeId" readOnly />
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="typeCd"
            className={cn("lg:min-w-[160px]", {
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
            className={cn("lg:min-w-[160px]", {
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
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="maker"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.maker,
            })}
          >
            Creator
          </Label>
          <div className="flex flex-col w-full">
            <Select
              {...register("maker")}
              id="maker"
              isClearable={false}
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={defaultMakers}
              isMulti
              options={users}
              styles={styles}
              onChange={(newValue, actionMeta) => {
                setValue("maker", newValue as any);
              }}
              className={cn("react-select", {
                "border-destructive focus:border-destructive": errors.maker,
              })}
              classNamePrefix="select"
              placeholder="Choose Maker"
            />
            {errors.maker && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.maker,
                })}
              >
                {errors.maker?.message}
              </p>
            )}
          </div>
        </div>
        {Array.from({ length: dataAssign[0]?.approval_pic }).map((_, index) => (
          <div
            key={`approval-${index}`}
            className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start"
          >
            <Label
              htmlFor={`approval${index}`}
              className={cn("lg:min-w-[160px]", {
                "text-destructive": errors.approval && errors.approval[index],
              })}
            >
              Approval {index + 1}
            </Label>
            <div className="flex flex-col w-full">
              <Select
                {...register(`approval.${index}`)}
                id={`approval${index}`}
                isClearable={false}
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={defaultApprovals[index]}
                isMulti
                options={
                  dataApproval.approval.length > 0
                    ? getFilteredUsers(dataApproval, index)
                    : usersApproval
                }
                styles={styles}
                onChange={(newValue) =>
                  handleApprovalChange(index, newValue as any)
                }
                className={cn("react-select", {
                  "border-destructive focus:border-destructive":
                    errors.approval && errors.approval[index],
                })}
                classNamePrefix="select"
                placeholder={`Choose Approval ${index + 1}`}
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
        <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
          <Label
            htmlFor="stampBlast"
            className={cn("lg:min-w-[160px]", {
              "text-destructive": errors.stampBlast,
            })}
          >
            Creator & Broadcaster
          </Label>
          <div className="flex flex-col w-full">
            <Select
              {...register("stampBlast")}
              id="stampBlast"
              isClearable={false}
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={defaultStampBlast}
              isMulti
              options={usersBlast}
              styles={styles}
              onChange={(newValue, actionMeta) => {
                setValue("stampBlast", newValue as any);
              }}
              className={cn("react-select", {
                "border-destructive focus:border-destructive":
                  errors.stampBlast,
              })}
              classNamePrefix="select"
              placeholder="Choose Creator & Broadcaster"
            />
            {errors.stampBlast && (
              <p
                className={cn("text-xs mt-1", {
                  "text-destructive": errors.stampBlast,
                })}
              >
                {errors.stampBlast?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button type="submit" disabled={isLoadingSubmit}>
          {isLoadingSubmit ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
