"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Billing = ({
  form,
  masterData,
  lotData
}: {
  form: UseFormReturn<any>;
  masterData: MasterDataResponse;
  lotData: any
}) => {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTaxCode, setSelectedTaxCode] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handlePaymentChange = (selectedValue: string) => {
    form.setValue("payment", selectedValue);
    const found = masterData.payment.find(
      (p) => p.payment_cd === selectedValue
    );
    setSelectedTaxCode(found?.tax_cd || "");
    // Jika ingin langsung isi ke field taxCode di form:
    form.setValue("taxCode", found?.tax_cd || "");
  };

  const handlePackageChange = (selectedValue: string) => {
    form.setValue("packageOptions", selectedValue);
    const found = masterData.packageOptions.find((p) => p.cd === selectedValue);
    setSelectedPackage(found?.scheme_cd || "");
    // Jika ingin langsung isi ke field taxCode di form:
    form.setValue("taxCode", found?.scheme_cd || "");
  };

  function onSubmit(values: z.infer<typeof billingSchema>) {
    toast.success("Form submitted successfully!");
    router.push("main");
    console.log(values);
  }

  const searchParams = useSearchParams();
  const lotNoFromQuery = searchParams?.get("lot_no") || "";

  useEffect(() => {
    if (lotNoFromQuery && !form.getValues("lotNo")) {
      form.setValue("lotNo", lotNoFromQuery);
    }
  }, [form, lotNoFromQuery]);

  console.log(lotData, "lotData")

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            <div className="text-lg font-bold mb-4">{`Lot: ${lotNoFromQuery}`}</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 gap-4"
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date || "")}
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
                          options={
                            lotData?.map((l: any) => ({
                              label: `${l.lot_no} `,
                              value: `${l.lot_no}`,
                            })) || []
                          }
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
                          options={
                            masterData?.payment.map((p, index) => ({
                              label: `${p.payment_cd} `,
                              value: `${p.payment_cd}`,
                            })) || []
                          }
                          placeholder="Select Payment"
                          value={field.value}
                          onChange={handlePaymentChange}
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
                          placeholder="Select Package"
                          value={field.value}
                          onChange={handlePackageChange}
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Package Tax Code"
                          value={selectedPackage}
                          readOnly
                        />
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Plan Discount"
                        />
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
                          placeholder="Select Special Discount"
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          value={selectedTaxCode}
                          readOnly
                          placeholder="Tax Code"
                        />
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Contract Price"
                        />
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Debtor A/c"
                          disabled
                        />
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
                          disabled={disabled}
                          buttonClassName={
                            disabled
                              ? "bg-default-200 h-9 hover:bg-default-200 hover:text-default-900"
                              : "h-9 bg-white"
                          }
                          options={
                            masterData?.debtorType.map((db, index) => ({
                              label: `${db.descs} `,
                              value: `${db.cd}`,
                            })) || []
                          }
                          placeholder="Select Debtor Type"
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date || "")}
                          disablePast={true}
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
                          options={
                            masterData?.salesEvent.map((c, index) => ({
                              label: `${c.descs} `,
                              value: `${c.cd}`,
                            })) || []
                          }
                          placeholder="Select Sales Event"
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
                          placeholder="Select Currency"
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
                          options={
                            masterData?.sChannel.map((c, index) => ({
                              label: `${c.descs} `,
                              value: `${c.cd}`,
                            })) || []
                          }
                          placeholder="Select S. Channel"
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
                          options={
                            masterData?.salesman.map((c, index) => ({
                              label: `${c.descs} `,
                              value: `${c.cd}`,
                            })) || []
                          }
                          placeholder="Select Sales Man"
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Requisition Form No"
                        />
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
                          placeholder="Select Staff Id"
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Booking No"
                        />
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
                        <Input
                          className="rounded-md bg-white border-default"
                          {...field}
                          placeholder="Enter Number SP"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default Billing;
