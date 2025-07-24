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
import { getMasterData, MasterDataResponse } from "@/action/get-booking";
import { useQuery } from "@tanstack/react-query";
import { bookingSchema } from "../combined-schema";
import { SelectWithSearch } from "@/components/ui/select-with-search";

const Booking = ({
  form,
  masterData,
}: {
  form: UseFormReturn<any>;
  masterData: MasterDataResponse;
}) => {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    toast.success("Form submitted successfully!");
    router.push("main");
    console.log(values);
  }

  return (
    <>
      <div className="text-lg font-bold mb-4">Lot: 21</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          {/* Kolom 1 */}

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.classOptions.map((opt) => ({
                        label: `${opt.class_cd} (${opt.entity_cd})`, // tampil jelas
                        value: `${opt.class_cd}|${opt.entity_cd}`, // tetap unik
                      })) || []
                    }
                    placeholder="Select Class"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md bg-white border-default"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salutation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salutation</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={[
                      { label: "Mr.", value: "mr." },
                      { label: "Ms.", value: "ms." },
                    ]}
                    placeholder="Select Salutation"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <SelectWithSearch
                    options={
                      masterData?.city.map((ct) => ({
                        label: `${ct.district}, ${ct.city}`,
                        value: `${ct.district}, ${ct.city}`,
                      })) || []
                    }
                    placeholder="Select City"
                    value={field.value}
                    onValueChange={(selectedValue: any) =>
                      field.onChange(selectedValue)
                    }
                    optimizeForLargeDataset={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="post_cd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hp1st"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HP 1st</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hp2nd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HP 2nd</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="rounded-md  border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
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
            name="married"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={[
                      { label: "Yes", value: "Y" },
                      { label: "No", value: "N" },
                    ]}
                    placeholder="Select Marital Status"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.religion.map((t) => ({
                        label: `${t.cd} - ${t.descs}`,
                        value: t.cd,
                      })) || []
                    }
                    placeholder="Select Terms"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup className="flex">
                    <div className="flex items-center gap-3 mt-2">
                      <RadioGroupItem value="male" id="r1" />
                      <Label htmlFor="r1">Male</Label>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <RadioGroupItem value="female" id="r2" />
                      <Label htmlFor="r2">Female</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mailing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mailing</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={[
                      {
                        label: "Home",
                        value: "H",
                      },
                      {
                        label: "Company",
                        value: "C",
                      },
                      {
                        label: "Other",
                        value: "O",
                      },
                    ]}
                    placeholder="Select Mailing"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>stat</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={[
                      { label: "Individual", value: "I" },
                      { label: "Combined", value: "C" },
                    ]}
                    placeholder="Select Stat"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="npwp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NPWP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 flex gap-2 items-center">
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3 mt-2">
                    <Label htmlFor="interest">Interest</Label>
                    <Checkbox
                      id="interest"
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3 mt-2">
                    <Label htmlFor="reminder">Reminder</Label>
                    <Checkbox
                      id="reminder"
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.term.map((t) => ({
                        label: `${t.cd} - ${t.descs}`,
                        value: t.cd,
                      })) || []
                    }
                    placeholder="Select Terms"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxTrxCd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Transaction Code</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.taxTrx.map((t) => ({
                        label: `${t.cd} - ${t.descs}`,
                        value: t.cd,
                      })) || []
                    }
                    placeholder="Select Tax Transaction Code"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id No</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.occupation.map((o) => ({
                        label: `${o.cd} - ${o.descs}`,
                        value: o.cd,
                      })) || []
                    }
                    placeholder="Select Occupation"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupationDetail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation Detail</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.occupationDt.map((o) => ({
                        label: `${o.cd} - ${o.descs}`,
                        value: o.cd,
                      })) || []
                    }
                    placeholder="Select Occupation Detail"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bpjs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BPJS</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={[{ label: "01", value: "01" }]}
                    placeholder="Select Area"
                    value={field.value}
                    onChange={(selectedValue) => field.onChange(selectedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-md border-default bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default Booking;
