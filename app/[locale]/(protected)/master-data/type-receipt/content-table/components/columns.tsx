"use client";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DataProps, tableHeaders } from "../data";
dayjs.extend(utc);

export interface Task {
  type_id: string;
  type_cd: string;
  type_descs: string;
  approval_pic: string;
  created_at: string;
  action: React.ReactNode;
}

// export const columns: ColumnDef<Task>[] = [
//   // {
//   //   id: "select",
//   //   header: ({ table }) => (
//   //     <Checkbox
//   //       checked={
//   //         table.getIsAllPageRowsSelected() ||
//   //         (table.getIsSomePageRowsSelected() && "indeterminate")
//   //       }
//   //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//   //       aria-label="Select all"
//   //       className="translate-y-0.5"
//   //     />
//   //   ),
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
//     accessorKey: "type_cd",
//     header: "Type Code",
//     cell: ({ row }) => <span>{row.getValue("type_cd")}</span>,
//   },
//   {
//     accessorKey: "type_descs",
//     header: "Description",
//     cell: ({ row }) => {
//       return (
//         <div className="font-medium text-card-foreground/80">
//           <div className="flex gap-3 items-center">
//             <span className="text-sm text-default-600 whitespace-nowrap">
//               {row.getValue("type_descs")}
//             </span>
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "approval_pic",
//     header: "Approval PIC",
//     cell: ({ row }) => <span>{row.getValue("approval_pic")}</span>,
//   },
//   {
//     accessorKey: "created_at",
//     header: "Created At",
//     cell: ({ row }) => {
//       const value = row.getValue("created_at");
//       return (
//         <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm")}</span>
//       );
//     },
//   },
//   {
//     id: "actions",
//     accessorKey: "action",
//     header: "Actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       return <DataTableRowActions row={row} />;
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
     
      if (header.accessorKey === "created_at") {
        const value = row.getValue("created_at");
        return <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm")}</span>;
      }

      
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),

   {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];