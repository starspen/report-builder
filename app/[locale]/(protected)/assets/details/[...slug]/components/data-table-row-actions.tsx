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
// import { taskSchema } from "../data/schema";

interface DataTableRowActionsProps {
  row: Row<DataProps>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  const entity_cd = encodeURIComponent(
    row.original.entity_cd.replace(/\s+/g, ""),
  );
  const reg_id = encodeURIComponent(row.original.reg_id.replace(/\//g, "_"));
  const images = [
    { url: row.original.url_file_attachment, label: "Image 1" },
    { url: row.original.url_file_attachment2, label: "Image 2" },
    { url: row.original.url_file_attachment3, label: "Image 3" },
  ];
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          {images.map(
            (image, index) =>
              image.url && (
                <div key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-default-200 text-default-400 ring-offset-transparent hover:ring-secondary dark:border-default-300"
                      color="secondary"
                      onClick={() => {
                        window.open(image.url, "_blank");
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{image.label}</p>
                  </TooltipContent>
                </div>
              ),
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
