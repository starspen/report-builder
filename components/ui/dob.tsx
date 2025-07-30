"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Calendar22Props {
  buttonClassName?: string;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  minDate?: Date;
  disablePast?: boolean; // <--- tambahkan ini
}

export function Calendar22({
  buttonClassName,
  selected,
  onSelect,
  minDate,
  disablePast = false, // default false
}: Calendar22Props) {
  const [open, setOpen] = React.useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-48 justify-between font-normal", buttonClassName)}
          >
            {selected ? selected.toLocaleDateString("id-ID") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            onSelect={(date) => {
              onSelect(date);
              setOpen(false);
            }}
            disabled={
              disablePast
                ? (date) => {
                    const d = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    return d < today;
                  }
                : undefined // semua tanggal bisa dipilih
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
