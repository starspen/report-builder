"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface BasicComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  onDelete?: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyText?: string;
  searchPlaceholder?: string;
}

const BasicCombobox: React.FC<BasicComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  emptyText = "No options found.",
  searchPlaceholder = "Search...",
  onDelete,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const filteredOptions = (options || []).filter((option) =>
    (option.label || "")
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", className)}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {filteredOptions.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>

                  {onDelete && (
                    <Tooltip>
                      <TooltipTrigger>
                        {" "}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                            onDelete?.(option.value);
                          }}
                        >
                          <Trash />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Masterplan</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BasicCombobox;
