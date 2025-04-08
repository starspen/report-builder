"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, FileIcon, Link } from "lucide-react";
import { DataProps, tableHeaders } from "../data";
import { Button } from "@/components/ui/button";

interface Task {
  entity_name: string;
  project_name: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  doc_amt: string;
  currency_cd: string;
  action_delete: React.ReactNode;
  action: React.ReactNode;
}
// export const columns: ColumnDef<Task>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="translate-y-0.5"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="translate-y-0.5"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "entity_name",
//     header: "Entity Name",
//     cell: ({ row }) => <span>{row.getValue("entity_name")}</span>,
//   },
//   {
//     accessorKey: "project_name",
//     header: "Project Name",
//     cell: ({ row }) => <span>{row.getValue("project_name")}</span>,
//   },
//   {
//     accessorKey: "debtor_acct",
//     header: "Debtor Acct",
//     cell: ({ row }) => <span>{row.getValue("debtor_acct")}</span>,
//   },
//   {
//     accessorKey: "debtor_name",
//     header: "Debtor Name",
//     cell: ({ row }) => {
//       return (
//         <div className="font-medium text-card-foreground/80">
//           <div className="flex gap-3 items-center">
//             <span className="text-sm text-default-600 whitespace-nowrap">
//               {row.getValue("debtor_name")}
//             </span>
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "email_addr",
//     header: "Email",
//     cell: ({ row }) => <span>{row.getValue("email_addr")}</span>,
//   },
//   {
//     accessorKey: "doc_no",
//     header: "Doc No",
//     cell: ({ row }) => {
//       const value = row.getValue("doc_no");
//       const doc_amt = row.original.doc_amt;
//       const currency_cd = row.original.currency_cd;

//       if (currency_cd === "USD") {
//         if (Number(doc_amt) >= 300) {
//           return (
//             <Badge
//               className={cn("rounded-full px-5 bg-success/20 text-success")}
//             >
//               {String(value)}
//             </Badge>
//           );
//         } else {
//           return (
//             <Badge
//               className={cn(
//                 "rounded-full px-5 bg-destructive/20 text-destructive"
//               )}
//             >
//               {String(value)}
//             </Badge>
//           );
//         }
//       } else {
//         if (Number(doc_amt) >= 5000000) {
//           return (
//             <Badge
//               className={cn("rounded-full px-5 bg-success/20 text-success")}
//             >
//               {String(value)}
//             </Badge>
//           );
//         } else {
//           return (
//             <Badge
//               className={cn(
//                 "rounded-full px-5 bg-destructive/20 text-destructive"
//               )}
//             >
//               {String(value)}
//             </Badge>
//           );
//         }
//       }
//     },
//   },
//   {
//     accessorKey: "gen_date",
//     header: "Generate Date",
//     cell: ({ row }) => {
//       const value = row.getValue("gen_date");
//       return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
//     },
//   },
//   {
//     id: "delete",
//     accessorKey: "action_delete",
//     header: "Delete",
//     enableHiding: false,
//     cell: ({ row }) => {
//       return <DataTableRowActions row={row} />;
//     },
//   },
//   {
//     id: "details",
//     accessorKey: "action",
//     header: "Details",
//     enableHiding: false,
//     cell: ({ row }) => {
//       return row.getCanExpand() ? (
//         <button
//           onClick={row.getToggleExpandedHandler()}
//           style={{ cursor: "pointer" }}
//         >
//           {row.getIsExpanded() ? (
//             <ChevronUp className="h-4 w-4" />
//           ) : (
//             <ChevronDown className="h-4 w-4" />
//           )}
//         </button>
//       ) : (
//         ""
//       );
//     },
//   },
// ];


export const columns: ColumnDef<DataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="w-8">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
     
      if (header.accessorKey === "doc_no") {
              const value = row.getValue("doc_no");
      const doc_amt = row.original.doc_amt;
      const currency_cd = row.original.currency_cd;

      if (currency_cd === "USD") {
        if (Number(doc_amt) >= 300) {
          return (
            <Badge
              className={cn("rounded-full px-5 bg-success/20 text-success")}
            >
              {String(value)}
            </Badge>
          );
        } else {
          return (
            <Badge
              className={cn(
                "rounded-full px-5 bg-destructive/20 text-destructive"
              )}
            >
              {String(value)}
            </Badge>
          );
        }
      } else {
        if (Number(doc_amt) >= 5000000) {
          return (
            <Badge
              className={cn("rounded-full px-5 bg-success/20 text-success")}
            >
              {String(value)}
            </Badge>
          );
        } else {
          return (
            <Badge
              className={cn(
                "rounded-full px-5 bg-destructive/20 text-destructive"
              )}
            >
              {String(value)}
            </Badge>
          );
        }
      }
      }
      if (header.accessorKey === "doc_date") {
        const value = row.getValue("gen_date");
        return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
      }
      
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),
    {
    id: "delete",
    accessorKey: "action_delete",
    header: "Delete",
    enableHiding: false,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
  {
        id: "details",
        accessorKey: "action",
        header: "Details",
        enableHiding: false,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              style={{ cursor: "pointer" }}
            >
              {row.getIsExpanded() ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          ) : (
            ""
          );
        },
      },

  // {
  //   id: "actions",
  //   accessorKey: "action",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Action" />
  //   ),
  //   enableHiding: false,
  //   // enableSorting: false,
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];