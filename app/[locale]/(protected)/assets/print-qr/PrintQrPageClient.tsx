"use client";

import { Fragment, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Loader2, Search, CalendarIcon, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import PrintQrPageView from "./page-view";

const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export default function PageHeader({ session }: { session: any }) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset, // react-hook-form reset
  } = useForm<{ startDate: Date; endDate: Date }>({
    resolver: zodResolver(schema),
  });

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    reset(); // clear any form errors/selections
  };

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard/home">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dashboard/home">Assets</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Print QR Listing</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-default">Print QR Listing</CardTitle>
          {/* <div className="mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
            <form className="w-full">
              <div
                className={cn(
                  "grid grid-cols-1 gap-x-2 gap-y-2 w-full",
                  startDate && endDate
                    ? "sm:grid-cols-5"
                    : "sm:grid-cols-4"
                )}
              >
                <div className="sm:col-span-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="md"
                        className={cn(
                          "w-full justify-between text-left font-normal border-default-200 text-default-600 md:px-4",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date as Date);
                              field.onChange(date);
                            }}
                            defaultMonth={startDate || new Date()}
                            fromYear={2000}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-xs mt-1 text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="md"
                        className={cn(
                          "w-full justify-between text-left font-normal border-default-200 text-default-600 md:px-4",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date as Date);
                              field.onChange(date);
                            }}
                            defaultMonth={endDate || new Date()}
                            fromYear={2000}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <p className="text-xs mt-1 text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                {startDate && endDate ?
                  <div className="flex items-end justify-center sm:col-span-1">
                    <Button
                      variant="outline"
                      size="md"
                      className="text-destructive hover:underline"
                      onClick={clearDates}
                    >
                      Clear dates
                    </Button>
                  </div>
                  :
                  <></>
                }
              </div>
            </form>
          </div> */}
        </CardHeader>

        <CardContent>
          <PrintQrPageView
            session={session}
            startDate={startDate}
            endDate={endDate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
