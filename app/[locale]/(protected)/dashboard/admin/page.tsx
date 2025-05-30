"use client";

import Image from "next/image";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { UpgradeBlock } from "@/components/blocks/upgrade-block";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { BlockBadge, WelcomeBlock } from "@/components/blocks/welcome-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { topUpQuota } from "@/action/dashboard-action";
import ContentTable from "./content-table";
import { getQuotaStamp } from "@/action/dashboard-action";
import { ScrollArea } from "@/components/ui/scroll-area";

const schema = z.object({
  quota: z.object({
    value: z.string().min(1, { message: "Required" }),
    label: z.string().min(1, { message: "Required" }),
  }),
});

const DashboardPage = () => {
  const t = useTranslations("AnalyticsDashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading: isLoadingQuotaStamp } = useQuery({
    queryKey: ["get-quota-stamp"],
    queryFn: async () => {
      const result = await getQuotaStamp();
      return result;
    },
  });

  const [total, setTotal] = useState(0);
  const pricePerEMeterai = 11000;
  const calculateTotal = (quotaValue: any) => {
    const quotaNumber = parseInt(quotaValue.value, 10);
    if (!isNaN(quotaNumber)) {
      setTotal(quotaNumber * pricePerEMeterai);
    } else {
      setTotal(0);
    }
  };

  const animatedComponents = makeAnimated();
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
  const quotaOptions: { value: string; label: string }[] = [
    { value: "1", label: "1" },
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "150", label: "150" },
    { value: "200", label: "200" },
    { value: "250", label: "250" },
    { value: "300", label: "300" },
    { value: "350", label: "350" },
    { value: "400", label: "400" },
    { value: "450", label: "450" },
    { value: "500", label: "500" },
    { value: "1000", label: "1000" },
    // { value: "1500", label: "1500" },
    // { value: "2000", label: "2000" },
    // { value: "2500", label: "2500" },
    // { value: "3000", label: "3000" },
    // { value: "3500", label: "3500" },
    // { value: "4000", label: "4000" },
    // { value: "4500", label: "4500" },
    // { value: "5000", label: "5000" },
  ];

  const lists1 = [
    {
      id: 1,
      text: 'Click the "Top Up" button',
    },
    {
      id: 2,
      text: "Choose the quota amount",
    },
    {
      id: 3,
      text: 'Click the "Continue Payment" button',
    },
    {
      id: 4,
      text: "Check the transaction on your dashboard",
    },
    {
      id: 5,
      text: 'Then, the page will be redirected to the "Choose Payment Channel"',
    },
    {
      id: 6,
      text: "Choose the Payment Channel",
    },
    {
      id: 7,
      text: 'Click the "Pay Now" button',
    },
    {
      id: 8,
      text: "The page will show the Virtual Account information",
    },
    {
      id: 9,
      text: "Make a payment via ATM or mobile banking",
    },
    {
      id: 10,
      text: "Transaction success",
    },
  ];

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
      const submitData = {
        quota: data.quota.value,
        price: pricePerEMeterai,
        total: total,
      };
      setIsLoading(true);
      const result = await topUpQuota(submitData);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 201) {
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
      setIsLoading(false);
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    mutation.mutate(data);
  }

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="col-span-12 md:col-span-4">
          <UpgradeBlock className="bg-primary">
            <div className="max-w-[168px] relative z-10">
              <div className="text-base font-medium text-default-foreground dark:text-default-900">
                E-meterai Quota Balance
              </div>
              <div className="text-xs font-normal text-default-foreground dark:text-default-800">
                Check your current available quota balance
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <div className="text-base font-medium text-default-foreground dark:text-default-900">
                Quota
              </div>
              <div className="text-xs font-normal text-default-foreground dark:text-default-800">
                {isLoadingQuotaStamp ? "Loading..." : data?.data}
              </div>
            </div>

            <div className="mt-6 mb-24 z-10 flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="md"
                    className="bg-default-foreground text-default hover:bg-default-foreground hover:opacity-80 dark:bg-default dark:text-default-100 font-medium"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Top Up
                  </Button>
                </DialogTrigger>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Top Up</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="pb-8">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-3 space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Select
                            {...register("quota")}
                            id="quota"
                            isClearable={false}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={quotaOptions}
                            styles={styles}
                            onChange={(newValue, actionMeta) => {
                              setValue("quota", newValue as any);
                              calculateTotal(newValue as any);
                            }}
                            className={cn("react-select", {
                              "border-destructive focus:border-destructive":
                                errors.quota,
                            })}
                            classNamePrefix="select"
                            placeholder="Choose Quota Amount"
                          />
                          {errors.quota && (
                            <p
                              className={cn("text-xs mt-1", {
                                "text-destructive": errors.quota,
                              })}
                            >
                              {errors.quota.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="lg:col-span-5 col-span-12">
                        <div className="card border border-solid border-default-400 rounded-sm p-4">
                          <div>
                            <ul className="divide-y divide-default-300">
                              <li className=" text-xs  pb-3 ">
                                <div className="flex justify-between">
                                  <p>Price per E-Meterai</p>
                                  <p>Rp 11.000</p>
                                </div>
                              </li>

                              <li className=" text-xs  py-2 ">
                                <div className="flex justify-between gap-3 ">
                                  <p className=" text-default-900    font-medium">
                                    Total
                                  </p>
                                  <p className=" text-default-800    font-medium">
                                    Rp. {total.toLocaleString()}
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        {!isLoading && (
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              onClick={() => setIsModalOpen(false)}
                            >
                              Close
                            </Button>
                          </DialogClose>
                        )}

                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Loading..." : "Continue Payment"}
                        </Button>
                      </div>
                    </form>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          className="bg-default-foreground text-default hover:bg-default-foreground hover:opacity-80 dark:bg-default dark:text-default-100 font-medium"
                        >
                          <Info className=" h-6 w-6" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        onInteractOutside={(e) => e.preventDefault()}
                      >
                        <DialogHeader>
                          <DialogTitle>Information for Top Up</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="pb-8">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger>
                                How to top up quota?
                              </AccordionTrigger>
                              <AccordionContent>
                                <ScrollArea className="h-[350px]">
                                  <div className="text-default-600  text-sm font-normal mt-3 space-y-4">
                                    <div className="flex justify-between items-start pb-4">
                                      <ul className="space-y-3 rounded-md bg-trasparent  ">
                                        {lists1.map((item, i) => (
                                          <li
                                            key={i}
                                            className="text-sm lg:text-base text-default-600  flex gap-2 items-center"
                                          >
                                            <span className="h-[10px] w-[10px] bg-default-900 rounded-full inline-block"></span>
                                            <span>{item.text}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                              <AccordionTrigger>
                                When will the quota be increased?
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-default-600  text-sm lg:text-base font-normal">
                                  The e-stamp quota top up will increase after
                                  the payment is verified by the payment gateway
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How to top up quota? </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* <div className="absolute bottom-0 start-0 z-9 w-full">
              <Image
                src="/images/svg/line.svg"
                width={500}
                height={200}
                alt="Line Image"
                draggable={false}
              />
            </div> */}
            <div className="absolute -bottom-4 end-5">
              {/* <Image
                src="/images/svg/rabit.svg"
                width={96}
                height={96}
                alt="Rabbit"
                draggable={false}
                className="w-full h-full object-cover"
              /> */}
            </div>
          </UpgradeBlock>
        </div>

        <div className="col-span-12 md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction e-meterai Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
