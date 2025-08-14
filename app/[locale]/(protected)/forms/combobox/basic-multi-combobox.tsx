import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown } from "lucide-react";

type Option = { label: string; value: string };

type BasicMultiComboboxProps = {
  options: Option[];
  value: string[]; // multiple
  onChange: (val: string[]) => void;
  placeholder?: string;
  emptyText?: string;
};

export function BasicMultiCombobox({
  options,
  value,
  onChange,
  placeholder = "Select columns...",
  emptyText = "No result",
}: BasicMultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    );
  };

  const clearAll = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {value.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {value.length > 0 &&
              (() => {
                const labelMap = new Map(
                  options.map((o) => [o.value, o.label])
                );
                const labels = value.map((v) => labelMap.get(v) ?? v);
                const toShow = labels.slice(0, 2);
                const hasMore = labels.length > 2;

                return (
                  <>
                    {toShow.map((label, idx) => (
                      <div key={idx} className="mr-1 flex">
                        {label}
                        {idx < toShow.length - 1 || hasMore ? "," : ""}
                      </div>
                    ))}
                    {hasMore && <div className="mr-1 flex">…</div>}
                  </>
                );
              })()}
          </div>
          <div className="flex items-center gap-2">
            {value.length > 0 && (
              <span
                className="text-xs text-muted-foreground underline"
                onClick={clearAll}
              >
                clear
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter>
          <CommandInput placeholder="Search columns..." />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggle(opt.value)}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(opt.value)}
                    aria-label={opt.label}
                  />
                  <span>{opt.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
