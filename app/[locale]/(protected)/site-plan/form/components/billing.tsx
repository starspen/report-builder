"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, date, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ClickableStep from "@/components/ui/clickable-steps";
import { Calendar } from "@/components/ui/calendar";
import { Calendar22 } from "@/components/ui/dob";
import BasicCombobox from "../../../forms/combobox/basic-combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const formSchema = z.object({
  salesDate: z.string(),
  vvip: z.string(),
  lotNo: z.string(),
  payment: z.string(),
  specialCommision: z.string(),
  package: z.string(),
  packageTaxcode: z.string(),
  planDiscount: z.string(),
  specialDiscount: z.string(),
  taxCode: z.string(),
  contractPrice: z.string(),
  debtorAc: z.string(),
  debtorType: z.string(),
  planHandOverDate: z.string(),
  salesEvent: z.string(),
  currency: z.string(),
  sChannel: z.string(),
  salesMan: z.string(),
  requisitionFormNo: z.string(),
  staffId: z.string(),
  bookingNo: z.string(),
  numberSp: z.string(),
  terms: z.string(),
  taxTrxCd: z.string(),
  idNo: z.string(),
  occupation: z.string(),
  occupationDetail: z.string(),
  bpjs: z.string(),
  area: z.string(),
  additionalName: z.string(),
});

const Billing = () => {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesDate: "2025-07-02",
      vvip: "", // Kolom ini tidak terisi di Excel
      lotNo: "PHB-01",
      payment: "P002 - Installment Residential 12x",
      specialCommision: "", // Tidak ada nilai di Excel
      package: "NA",
      packageTaxcode: "NTO",
      planDiscount: "5.000.000,00",
      specialDiscount: "10000000",
      taxCode: "1001",
      contractPrice: "3153118170",
      debtorAc: "PHB-01",
      debtorType: "02",
      planHandOverDate: "2026-09-02",
      salesEvent: "NA",
      currency: "IDR",
      sChannel: "I00001",
      salesMan: "I000010004",
      requisitionFormNo: "", // Kosong di Excel
      staffId: "Rossa",
      bookingNo: "10001-007",
      numberSp: "001/CGH/SPUK/AMR/VII/2025",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!");
    router.push("main");
    console.log(values);
  }

  return (
    <>
      <div className="text-lg font-bold mb-4">Lot: 21</div>
      <Form {...form}>
        <>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Kolom 1 */}

            <FormField
              control={form.control}
              name="salesDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Date</FormLabel>
                  <FormControl>
                    <Calendar22 buttonClassName="w-full justify-between h-9 bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vvip"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-2 flex flex-col gap-5">
                    <FormLabel>VVIP</FormLabel>
                    <FormControl>
                      <Checkbox />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lotNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot No</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        { label: "PHB-01", value: "PHB-01" },
                        { label: "PHB-02", value: "PHB-02" },
                      ]}
                      placeholder="Select Lot No"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        { label: "P001", value: "P001" },
                        {
                          label: "P002 - Installment Residential 12x",
                          value: "P002 - Installment Residential 12x",
                        },
                      ]}
                      placeholder="Select Payment"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialCommision"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-2 flex flex-col gap-5">
                    <FormLabel>Special Commision</FormLabel>
                    <FormControl>
                      <Checkbox />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                      ]}
                      placeholder="Select Salutation"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageTaxcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Tax Code</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Discount</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Discount</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                      ]}
                      placeholder="Select Salutation"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Code</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Price</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="debtorAc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debtor A/c</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="debtorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debtor Type</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                      ]}
                      placeholder="Select Salutation"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planHandOverDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Hand Over Date</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                      ]}
                      placeholder="Select Salutation"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salesEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Event</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                        {
                          label: "Ciomas, KAB BOGOR",
                          value: "Ciomas, KAB BOGOR",
                        },
                      ]}
                      placeholder="Select Salutation"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        {
                          label: "Home",
                          value: "Home",
                        },
                        {
                          label: "Company",
                          value: "Company",
                        },
                        {
                          label: "Other",
                          value: "Other",
                        },
                      ]}
                      placeholder="Select Mailing"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sChannel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S. Channel</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        { label: "Individual", value: "Individual" },
                        { label: "Combined", value: "Combined" },
                      ]}
                      placeholder="Select Stat"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salesMan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Man</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[
                        { label: "Individual", value: "Individual" },
                        { label: "Combined", value: "Combined" },
                      ]}
                      placeholder="Select Stat"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requisitionFormNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisition Form No</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Id</FormLabel>
                  <FormControl>
                    <BasicCombobox
                      buttonClassName="h-9 bg-white"
                      options={[{ label: "01", value: "01" }]}
                      placeholder="Select Terms"
                      value={field.value}
                      onChange={(selectedValue) =>
                        field.onChange(selectedValue)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberSp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number SP</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </>
      </Form>
    </>
  );
};

export default Billing;
