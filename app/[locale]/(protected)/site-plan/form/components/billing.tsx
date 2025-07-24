"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { billingSchema } from "../combined-schema";
import { MasterDataResponse } from "@/action/get-booking";

const Billing = ({
  form,
  masterData,
}: {
  form: UseFormReturn<any>;
  masterData: MasterDataResponse;
}) => {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  function onSubmit(values: z.infer<typeof billingSchema>) {
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
                    <Calendar22
                      buttonClassName="w-full justify-between h-9 bg-white"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        );
                      }}
                    />
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
                      options={
                        masterData?.packageOptions.map((po, index) => ({
                          label: `${po.descs} `,
                          value: `${po.cd}`,
                        })) || []
                      }
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
                      options={
                        masterData?.debtorType.map((db, index) => ({
                          label: `${db.descs} `,
                          value: `${db.cd}`,
                        })) || []
                      }
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
                    <Calendar22
                      buttonClassName="w-full justify-between h-9 bg-white"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        );
                      }}
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
                      options={
                        masterData?.currency.map((c, index) => ({
                          label: `${c.descs} `,
                          value: `${c.cd}`,
                        })) || []
                      }
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
                      options={
                        masterData?.staff.map((s, index) => ({
                          label: `${s.descs} `,
                          value: `${s.cd}`,
                        })) || []
                      }
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
