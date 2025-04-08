"use client";

import { EyeIcon, PrinterIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DataProps } from "../data";
import { useRouter } from "@/components/navigation";
import { Link } from "@/components/navigation";

interface DataTableRowActionsProps {
  row: Row<DataProps>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-default-200 text-default-400 ring-offset-transparent hover:ring-secondary dark:border-default-300"
              color="secondary"
              // onClick={() => {
              //   router.push(`/assets/details/${entity_cd}/${reg_id}`);
              // }}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>View</p>
          </TooltipContent>
          <TooltipTrigger asChild>
            {/* <Link
              href={`/assets/print/${entity_cd}/${reg_id}`}
              target="_blank"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-default-200 text-default-400 ring-offset-transparent hover:bg-secondary hover:text-secondary-foreground dark:border-default-300"
            >
              <PrinterIcon className="h-4 w-4" />
            </Link> */}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-default-200 text-default-400 ring-offset-transparent hover:ring-secondary dark:border-default-300"
            >
              <PrinterIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Print </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
