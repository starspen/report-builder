import * as React from "react";
import { Check } from "lucide-react";
import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Column } from "@tanstack/react-table";
interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}
interface DataTableFacetedFilterProps {
  column: Column<any, any>;
  title: string;
  options: Option[];
}
export function DataTableFacetedFilter({
  column,
  title,
  options,
}: DataTableFacetedFilterProps) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const sortedOptions = options.sort((a, b) => {
    const countA = facets?.get(a.value) || 0;
    const countB = facets?.get(b.value) || 0;
    return countB - countA;
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                color="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex rtl:space-x-reverse">
                {selectedValues.size > 2 ? (
                  <Badge
                    color="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  sortedOptions
                    .filter((option: Option) =>
                      selectedValues.has(option.value),
                    )
                    .map((option) => (
                      <Badge
                        color="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option: Option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={`command-item-${option.value}`}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-muted-foreground ltr:mr-2 rtl:ml-2" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="flex h-4 w-4 items-center justify-center text-xs ltr:ml-auto rtl:mr-auto">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
