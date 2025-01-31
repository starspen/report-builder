"use client";

import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const task = taskSchema.parse(row.original);
  const file_status_sign = row.original.file_status_sign;

  const handlePreviewFile = (
    filename: string,
    fileTipe: string,
    fileStatusSign: string
  ) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;
    const formatInvoice = fileTipe.toUpperCase();

    let url = "";
    if (mode === "sandbox") {
      if (fileStatusSign === "A" || fileStatusSign === "F") {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_SANDBOX_URL}`;
      }
    } else {
      if (fileStatusSign === "A" || fileStatusSign === "F") {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_PRODUCTION_URL}`;
      }
    }
    window.open(url + "GQCINV/" + formatInvoice + "/" + filename, "_blank");
  };

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
    //     >
    //       <MoreHorizontal className="h-4 w-4" />
    //       <span className="sr-only">Open menu</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[160px]">
    //     <DropdownMenuItem>Edit</DropdownMenuItem>
    //     <DropdownMenuItem>Make a copy</DropdownMenuItem>
    //     <DropdownMenuItem>Favorite</DropdownMenuItem>
    //     <DropdownMenuSeparator />
    //     {/* <DropdownMenuSub>
    //       <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
    //       <DropdownMenuSubContent>
    //         <DropdownMenuRadioGroup value={task.label}>
    //           {labels.map((label) => (
    //             <DropdownMenuRadioItem key={label.value} value={label.value}>
    //               {label.label}
    //             </DropdownMenuRadioItem>
    //           ))}
    //         </DropdownMenuRadioGroup>
    //       </DropdownMenuSubContent>
    //     </DropdownMenuSub> */}
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>
    //       Delete
    //       <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>

    file_status_sign === "S" ? (
      <Button
        className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
        size="icon"
        onClick={(event) => {
          handlePreviewFile(
            row.original.file_name_sign,
            row.original.file_type,
            row.original.file_status_sign
          );
          event.preventDefault();
        }}
        title={`${row.original.file_name_sign}`}
        disabled={!row.original.file_name_sign}
      >
        <File className="text-red-600 w-4 h-4" />
      </Button>
    ) : (
      <Button
        className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
        size="icon"
        onClick={(event) => {
          handlePreviewFile(
            row.original.file_name_sign,
            row.original.file_type,
            row.original.file_status_sign
          );
          event.preventDefault();
        }}
        title={`${row.original.file_name_sign}`}
        disabled={!row.original.file_name_sign}
      >
        <File className="text-red-600 w-4 h-4" />
      </Button>
    )
  );
}
