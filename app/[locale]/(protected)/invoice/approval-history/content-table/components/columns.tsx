"use client";

import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataProps, tableHeaders } from "../data";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  entity_name: string;
  project_name: string;
  process_id: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  doc_date: string;
  currency_cd: string;
  approval_date: string;
  approval_status: string;
  action: React.ReactNode;
}
// export const columns: ColumnDef<Task>[] = [
//   // {
//   //   id: "select",
//   //   // header: ({ table }) => (
//   //   //   <Checkbox
//   //   //     checked={
//   //   //       table.getIsAllPageRowsSelected() ||
//   //   //       (table.getIsSomePageRowsSelected() && "indeterminate")
//   //   //     }
//   //   //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//   //   //     aria-label="Select all"
//   //   //     className="translate-y-0.5"
//   //   //   />
//   //   // ),
//   //   cell: ({ row, table }) => (
//   //     <Checkbox
//   //       checked={row.getIsSelected()}
//   //       // onCheckedChange={(value) => row.toggleSelected(!!value)}
//   //       onCheckedChange={(value) => {
//   //         // Menonaktifkan pemilihan multiple
//   //         table.toggleAllRowsSelected(false);
//   //         row.toggleSelected(!!value);
//   //       }}
//   //       aria-label="Select row"
//   //       className="translate-y-0.5"
//   //     />
//   //   ),
//   //   enableSorting: false,
//   //   enableHiding: false,
//   // },
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
//     cell: ({ row }) => <span>{row.getValue("doc_no")}</span>,
//   },
//   {
//     accessorKey: "doc_date",
//     header: "Doc Date",
//     cell: ({ row }) => {
//       const value = row.getValue("doc_date");
//       return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
//     },
//   },
//   {
//     accessorKey: "approval_date",
//     header: "Approval Date",
//     cell: ({ row }) => {
//       const value = row.getValue("approval_date");
//       return (
//         <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm")}</span>
//       );
//     },
//   },
//   {
//     accessorKey: "approval_status",
//     header: "Status",
//     cell: ({ row }) => {
//       const value = row.getValue("approval_status") as string;
//       let descs = "";
//       let color = "";
//       if (value === "A") {
//         color = "bg-success/20 text-success";
//         descs = "Approved";
//       } else if (value === "R") {
//         color = "bg-warning/20 text-warning";
//         descs = "Revise";
//       } else {
//         color = "bg-destructive/20 text-destructive";
//         descs = "Cancelled";
//       }
//       return (
//         <Badge className={cn("rounded-full px-5", color)}>
//           {String(descs)}
//         </Badge>
//       );
//     },
//   },
//   // {
//   //   id: "actions",
//   //   accessorKey: "action",
//   //   header: "Actions",
//   //   enableHiding: false,
//   //   cell: ({ row }) => {
//   //     return <DataTableRowActions row={row} />;
//   //   },
//   // },
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
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
     
      if (header.accessorKey === "doc_date") {
        const value = row.getValue("doc_date");
        return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
      }
      if (header.accessorKey === "approval_date") {
        const value = row.getValue("approval_date");
        return <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm")}</span>;
      }
      if(header.accessorKey === "approval_status") {
        const value = row.getValue("approval_status") as string;
        let descs = "";
        let color = "";
        if (value === "A") {
          color = "bg-success/20 text-success";
          descs = "Approved";
        } else if (value === "R") {
          color = "bg-warning/20 text-warning";
          descs = "Revise";
        } else {
          color = "bg-destructive/20 text-destructive";
          descs = "Cancelled";
        }
        return (
          <Badge className={cn("rounded-full px-5", color)}>
            {String(descs)}
          </Badge>
        );
      }
      
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),
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