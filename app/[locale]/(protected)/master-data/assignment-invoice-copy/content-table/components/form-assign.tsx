"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import makeAnimated from "react-select/animated";
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
  getTypeInvoiceAmountById,
  updateTypeInvoice,
} from "@/action/master-type-invoice-action";
import { getMasterUser } from "@/action/master-user-action";

// const schema = z.object({
//   typeId: z.string().optional(),
//   typeCd: z.string().min(2, { message: "This field is required." }),
//   typeDescs: z.string().min(2, { message: "This field is required." }),
// });

// const FormSchema = z.object({
//   maker: z
//     .string({
//       required_error: "Please select an email to display.",
//     }),
//   stampBlast: z
//     .string({
//       required_error: "Please select an email to display.",
//     }),
// })

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
  icon?: string;
}

export const FormAssign = ({
  setIsModalOpen,
  selectedId,
}: {
  setIsModalOpen: (value: boolean) => void;
  selectedId: string;
}) => {
  const [selectedApprovals, setSelectedApprovals] = useState<{
    [key: number]: OptionType | null;
  }>({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();

  const { data: dataTypeInvoice, isLoading: isLoadingTypeInvoice } = useQuery({
    queryKey: ["master-type-invoice-id"],
    queryFn: async () => {
      const result = await getTypeInvoiceAmountById(selectedId);
      return result;
    },
  });

  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["master-user"],
    queryFn: async () => {
      const result = await getMasterUser();

      return result;
    },
  });

  const animatedComponents = makeAnimated();
  const users: OptionType[] = dataUser?.data.map((item: any) => ({
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

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   setValue,
  // } = useForm<z.infer<typeof schema>>({
  //   resolver: zodResolver(schema),
  // });

  // if (!dataTypeInvoice || !dataTypeInvoice.data) return <div>Loading...</div>;

  // if (!dataUser || !dataUser.data) return <div>Loading...</div>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    [approval: string]: any;
  }>({
    defaultValues: {
      typeId: dataTypeInvoice?.data[0]?.type_id,
      typeCd: dataTypeInvoice?.data[0]?.type_cd,
      typeDescs: dataTypeInvoice?.data[0]?.type_descs,
      maker: [],
      stampBlast: [],
      approval: [],
    },
    // resolver: zodResolver(),
  });

  const handleApprovalChange = (index: number, newValue: OptionType | null) => {
    setSelectedApprovals((prev) => ({
      ...prev,
      [index]: newValue,
    }));
    setValue(`approval${index}`, newValue);
  };

  const getFilteredUsers = (index: number) => {
    const selectedValues = Object.values(selectedApprovals)
      .filter(Boolean)
      .map((item) => item?.value);
    return users?.filter(
      (user) =>
        !selectedValues.includes(user.value) ||
        selectedApprovals[index]?.value === user.value
    );
  };

  const mutation = useMutation({
    // mutationFn: async (data: z.infer<typeof schema>) => {
    mutationFn: async (data) => {
      setIsLoadingSubmit(true);
      const result = await updateTypeInvoice(data);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["assignment-invoice"],
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

  // function onSubmit(data: z.infer<typeof schema>) {
  function onSubmit(data: any) {
    mutation.mutate(data);
  }

  useEffect(() => {
    if (dataTypeInvoice) {
      setValue("typeId", dataTypeInvoice?.data[0]?.type_id);
      setValue("typeCd", dataTypeInvoice?.data[0]?.type_cd);
      setValue("typeDescs", dataTypeInvoice?.data[0]?.type_descs);
    }
  }, [dataTypeInvoice, setValue]);

  return (
    <DialogContent size="md">
      <DialogHeader>
        <DialogTitle>Assign Invoice Class</DialogTitle>
      </DialogHeader>
      <DialogDescription className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input {...register("typeId")} type="text" id="typeId" readOnly />
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
                    "border-destructive focus:border-destructive":
                      errors.typeCd,
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
                    {/* {errors.typeCd.message} */}
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
                    "border-destructive focus:border-destructive":
                      errors.typeDescs,
                  })}
                  readOnly
                />
                {errors.typeDescs && (
                  <p
                    className={cn("text-xs mt-1", {
                      "text-destructive": errors.typeDescs,
                    })}
                  >
                    {/* {errors.typeDescs.message} */}
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
                Maker
              </Label>
              <div className="flex flex-col w-full">
                <Select
                  {...register("maker")}
                  id="maker"
                  isClearable={false}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  // defaultValue={[users[4], users[5]]}
                  isMulti
                  options={users}
                  styles={styles}
                  onChange={(newValue, actionMeta) => {
                    setValue("maker", newValue);
                  }}
                  className={cn("react-select", {
                    "border-destructive focus:border-destructive": errors.maker,
                  })}
                  classNamePrefix="select"
                  placeholder="Type to search"
                />
                {errors.maker && (
                  <p
                    className={cn("text-xs mt-1", {
                      "text-destructive": errors.maker,
                    })}
                  >
                    {/* {errors.maker.message} */}
                  </p>
                )}
              </div>
            </div>
            {Array.from({ length: dataTypeInvoice?.data[0]?.amtRange.length }).map(
              (_, index) => (
                <div
                  key={index}
                  className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start"
                >
                  <Label
                    htmlFor={`approval${index}`}
                    className={cn("lg:min-w-[160px]", {
                      "text-destructive": errors[`approval${index}`],
                    })}
                  >
                    {dataTypeInvoice?.data[0]?.amtRange[index].min} - {dataTypeInvoice?.data[0]?.amtRange[index].max}
                  </Label>
                  <div className="flex flex-col w-full">
                    <Select
                      {...register(`approval${index}`)}
                      id={`approval${index}`}
                      isClearable={false}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      // defaultValue={[users[4], users[5]]}
                      // options={users}
                      options={getFilteredUsers(index)}
                      styles={styles}
                      className={cn("react-select", {
                        "border-destructive focus:border-destructive":
                          errors[`approval${index}`],
                      })}
                      // onChange={(newValue, actionMeta) => {
                      //   setValue(`approval${index}`, newValue);
                      // }}
                      onChange={(newValue) =>
                        handleApprovalChange(
                          index,
                          newValue as OptionType | null
                        )
                      }
                      classNamePrefix="select"
                      placeholder="Choose Approval"
                    />
                    {errors[`approval${index}`] && (
                      <p
                        className={cn("text-xs mt-1", {
                          "text-destructive": errors[`approval${index}`],
                        })}
                      >
                        {String(errors[`approval${index}`]?.message ?? "")}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
            <div className="col-span-2 flex flex-col gap-2 lg:flex-row lg:items-start">
              <Label
                htmlFor="stampBlast"
                className={cn("lg:min-w-[160px]", {
                  "text-destructive": errors.stampBlast,
                })}
              >
                Stamp & Blast Email
              </Label>
              <div className="flex flex-col w-full">
                <Select
                  {...register("stampBlast")}
                  id="stampBlast"
                  isClearable={false}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  // defaultValue={[users[4], users[5]]}
                  options={users}
                  styles={styles}
                  onChange={(newValue, actionMeta) => {
                    setValue("stampBlast", newValue);
                  }}
                  className={cn("react-select", {
                    "border-destructive focus:border-destructive":
                      errors.stampBlast,
                  })}
                  classNamePrefix="select"
                />
                {errors.stampBlast && (
                  <p
                    className={cn("text-xs mt-1", {
                      "text-destructive": errors.stampBlast,
                    })}
                  >
                    {/* {errors.stampBlast.message} */}
                  </p>
                )}
              </div>
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
              {isLoadingSubmit ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};
