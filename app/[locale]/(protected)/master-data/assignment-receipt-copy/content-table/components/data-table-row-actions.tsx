"use client";

import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ClipboardPen } from "lucide-react";
import { useRouter } from "@/components/navigation";
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
import useTaskStore from "@/store/useTaskStoreCopy";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const task = taskSchema.parse(row.original);
  const router = useRouter();
  const typeId = row.original.type_id;
  const { addTask } = useTaskStore();
  const handleDetailAssign = async () => {
    addTask(row.original);
    router.push(`/master-data/assignment-receipt-copy/approval/${typeId}`);
  };

  return (
    <Button color="info" size="icon" onClick={handleDetailAssign}>
      <ClipboardPen className="w-4 h-4" />
    </Button>
  );
}
