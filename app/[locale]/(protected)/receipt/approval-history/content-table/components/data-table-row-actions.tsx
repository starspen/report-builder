"use client";

import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
  const router = useRouter();
  const processId = row.original.process_id;
  const handleDetailInvoice = async () => {
    router.push(`/receipt/approval-history/${processId}`);
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
    <Button
      variant="outline"
      color="primary"
      size="sm"
      className="ltr:ml-2 rtl:mr-2  h-8 "
      onClick={handleDetailInvoice}
    >
      <Eye className="ltr:mr-2 rtl:ml-2 w-4 h-4" />
      Detail
    </Button>
  );
}
