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
import { getMasterData, MasterDataResponse } from "@/action/get-booking";
import { useQuery } from "@tanstack/react-query";

export const formSchema = z.object({
  class: z.string(),
  company: z.string(),
  salutation: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  telephone: z.string(),
  hp1st: z.string(),
  hp2nd: z.string(),
  email: z.string(),
  dob: z.string(),
  married: z.string(),
  gender: z.string(),
  religion: z.string(),
  companyName: z.string(),
  contract: z.string(),
  position: z.string(),
  mailing: z.string(),
  stat: z.string(),
  npwp: z.string(),
  interest: z.string(),
  terms: z.string(),
  taxTrxCd: z.string(),
  idNo: z.string(),
  occupation: z.string(),
  occupationDetail: z.string(),
  bpjs: z.string(),
  area: z.string(),
  additionalName: z.string(),
});

const Booking = () => {
  const router = useRouter();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "I-01 (01)",
      company: "X",
      salutation: "Mr.",
      name: "Muhammad Rafi Fauzhan",
      address: "Jl. Pintu Ledeng RT 01 RW 05 KP. Sinar",
      city: "Aceh Barat",
      telephone: "021871827887",
      hp1st: "6285167261717",
      hp2nd: "6287870082711",
      email: "muhammad.rafi@gmail.com",
      dob: "37074",
      married: "X",
      gender: "Male",
      religion: "01",
      companyName: "PT IFCA PROPERTY365 INDONESIA",
      contract: "Muhammad Rafi Fauzhan",
      position: "Application Consultant",
      mailing: "Home",
      stat: "Individual",
      npwp: "11.021.010.2-110.000",
      interest: "Reminder",
      terms: "01",
      taxTrxCd: "01",
      idNo: "327106020701010001",
      occupation: "01",
      occupationDetail: "0101",
      bpjs: "",
      area: "",
      additionalName: "",
    },
  });

  const {
    data: masterData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["master-data"],
    queryFn: getMasterData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!");
    router.push("main");
    console.log(values);
  }

  console.log(masterData?.city, "masterData city:");
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
                  <BasicCombobox
                    buttonClassName="h-9 bg-white"
                    options={
                      masterData?.city.map((ct) => ({
                        label: ct.descs,
                        value: ct.cd,
                      })) || []
                    }
                    placeholder="Select City"
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
                  <Calendar22 buttonClassName="w-full justify-between h-9 bg-white" />
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
            name="contract"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract</FormLabel>
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
                      { label: "Individual", value: "Individual" },
                      { label: "Combined", value: "Combined" },
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

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest & Reminder</FormLabel>
                <FormControl>
                  <>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-3">
                        <Checkbox id="interest" />
                        <Label htmlFor="terms">Interest</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="reminder" />
                        <Label htmlFor="terms">Reminder</Label>
                      </div>
                    </div>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
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
