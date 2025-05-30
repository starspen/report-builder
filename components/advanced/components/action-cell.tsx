"use client"; // Pastikan ini ada di bagian atas

import { Link } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";
import { FilePlus } from "lucide-react";

export const ActionCell = ({
  row,
  updatedButton,
  editButton,
  deleteButton,
  viewButton,
  page,
  onButtonClick,
}: {
  row: any;
  updatedButton?: boolean;
  editButton?: boolean;
  deleteButton?: boolean;
  viewButton?: boolean;
  page?: string;
  onButtonClick?: (type: string, id: string) => void;
}) => {
  const id = row.getValue("id"); // Ambil id untuk navigasi

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {updatedButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              {page && (
                <Link href={`${page}/create/${id}`}>
                  <Button variant="ghost">
                    <FilePlus className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent>
              Create {page == "quotation" ? "Quotation" : ""}
            </TooltipContent>
          </Tooltip>
        )}

        {viewButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              {page && (
                <Link href={`${page}/view/${id}`}>
                  <Button variant="ghost">
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent>View</TooltipContent>
          </Tooltip>
        )}

        {editButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              {page && (
                <Link href={`${page}/edit/${id}`}>
                  <Button variant="ghost">
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        )}

        {deleteButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <Link href={`/delete/${id}`}> */}
              <Button
                variant="ghost"
                color="destructive"
                onClick={() => {
                  onButtonClick?.("delete", id);
                }}
              >
                <Icon icon="heroicons:trash" className="h-4 w-4" />
              </Button>
              {/* </Link> */}
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
