"use client";
import * as React from "react";
import { Fragment, useState } from "react";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "./components/data-table";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getInvoiceEmailHistorySuccess } from "@/action/invoice-action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
// import { data } from "./data";

const schema = z.object({
  startDate: z.date({
    required_error: "This field is required.",
  }),
  endDate: z.date({
    required_error: "This field is required.",
  }),
});

export default function AdvancedTable() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [shouldFetch, setShouldFetch] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["invoice-email-history-success"],
    queryFn: async () => {
      const formattedStartDate = startDate ? format(startDate, "yyyyMMdd") : "";
      const formattedEndDate = endDate ? format(endDate, "yyyyMMdd") : "";
      const result = await getInvoiceEmailHistorySuccess(
        formattedStartDate,
        formattedEndDate
      );
      return result;
    },
    enabled: !!startDate && !!endDate && shouldFetch,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    if (startDate && endDate) {
      setShouldFetch(true);
      setStartDate(startDate);
      setEndDate(endDate);
      queryClient.invalidateQueries({
        queryKey: ["invoice-email-history-success"],
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2 sm:col-start-1">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="mt-2">
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
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
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
                        // onSelect={(date) => setStartDate(date as Date)}
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
                {errors.startDate && (
                  <p className="text-xs mt-1 text-destructive">
                    {typeof errors.startDate.message === "string" &&
                      errors.startDate.message}
                  </p>
                )}
              </Popover>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="endDate">End Date</Label>
            <div className="mt-2">
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
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
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
                        // onSelect={(date) => setEndDate(date as Date)}
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
                {errors.endDate && (
                  <p className="text-xs mt-1 text-destructive">
                    {typeof errors.endDate.message === "string" &&
                      errors.endDate.message}
                  </p>
                )}
              </Popover>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="endDate">&nbsp;</Label>
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
      <Separator className="my-4" />

      <DataTable data={data?.data || []} columns={columns} />
    </Fragment>
  );
}
