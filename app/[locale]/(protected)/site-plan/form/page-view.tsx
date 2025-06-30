"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

export const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  nationality: z.string().min(2, { message: "Nationality is required." }),
  foreignPurchase: z.boolean().optional(),
  wp: z.boolean().optional(),
  identityType: z.string().min(2, { message: "Identity type is required." }),
  identityNo: z.string().min(2, { message: "Identity number is required." }),
  salutation: z.string().min(1, { message: "Salutation is required." }),
  birthDate: z.string().min(1, { message: "Date of birth is required." }),
  maritalStatus: z.string().min(1, { message: "Marital status is required." }),
  gender: z.string().min(1, { message: "Gender is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  profession: z.string().min(2, { message: "Profession is required." }),
  religion: z.string().min(2, { message: "Religion is required." }),
  address: z.string().min(5, { message: "Address is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  state: z.string().min(2, { message: "State is required." }),
  city: z.string().min(2, { message: "City is required." }),
  postcode: z.string().min(2, { message: "Postcode is required." }),
  homeTelNo: z.string().optional(),
  mobileNo: z.string().min(8, { message: "Mobile number is required." }),
  officeTelNo: z.string().optional(),
  incomeRange: z.string().min(1, { message: "Income range is required." }),
  unitNo: z.string().min(1, { message: "Unit No is required." }),
  unitPrice: z.string().optional(), // bisa dibuat jadi z.coerce.number() jika akan dipakai hitung
  salesTeam: z.string().min(2, { message: "Sales Team is required." }),
  salesPersonnel: z.string().optional(),
  remarks: z.string().optional(),
  bookingFee: z.string().min(1, { message: "Booking fee is required." }),
  bookingAmount: z.string().min(1, { message: "Booking amount is required." }),
  paymentMethod: z.string().min(1, { message: "Payment method is required." }),
  paymentReferenceNo: z
    .string()
    .min(1, { message: "Reference No is required." }),
  companyBankAccount: z
    .string()
    .min(1, { message: "Company Bank Account is required." }),
  paymentRemark: z.string().optional(),
  uploadAttachment: z.any().optional(), // pakai z.instanceof(File) jika dari <input type="file" />
});

const FormView = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Rich Deshan Djuardi",
      nationality: "Indonesia",
      foreignPurchase: false,
      wp: false,
      identityType: "KTP",
      identityNo: "1234567890123456",
      salutation: "Mr.",
      birthDate: "1990-01-01",
      maritalStatus: "single",
      gender: "male",
      email: "example@example.com",
      profession: "Software Engineer",
      religion: "islam",
      address: "123 Main St",
      country: "Indonesia",
      state: "DKI Jakarta",
      city: "Tangerang Selatan",
      postcode: "15310",
      homeTelNo: "0212345678",
      mobileNo: "089651147649",
      officeTelNo: "0218765432",
      incomeRange: "5,000,000 - 10,000,000",
      unitNo: "A-123",
      unitPrice: "1,000,000",
      salesTeam: "Team A",
      salesPersonnel: "John Doe",
      remarks: "No remarks",
      bookingFee: "100,000",
      bookingAmount: "1,000,000",
      paymentMethod: "Credit Card",
      paymentReferenceNo: "REF123456",
      companyBankAccount: "123-456-789",
      paymentRemark: "No remarks",
      uploadAttachment: undefined,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted successfully!");
    router.push("/");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="m-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="identityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Type</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="identityNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Number</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salutation</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="catholic">Catholic</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religion</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="islam">Islam</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="catholic">Catholic</SelectItem>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="buddha">Buddha</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street, Building, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Indonesia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jawa Barat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bandung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col col-span-1">
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col col-span-2">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white "
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormView;
