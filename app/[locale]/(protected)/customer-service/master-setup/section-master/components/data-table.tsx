// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/components/ticket-data-table.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface SectionDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  user: any;
}

export function SectionDataTable<TData>({ columns, data, user }: SectionDataTableProps<TData>) {
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    rowID: false,
    audit_user: false,
    audit_date: false,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    
    if (selectedIds.length > 0) {
      setSelectedRowId(selectedIds[0]);
    } else {
      setSelectedRowId(null);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection: selectedRowId ? { [selectedRowId]: true } : {},
      columnFilters,
    },
    meta: {
      currentUserEmail: user?.email,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: handleRowSelectionChange as OnChangeFn<RowSelectionState>,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleRowClick = (row: any) => {
    if (row.id === selectedRowId) {
      setSelectedRowId(null);
    } else {
      setSelectedRowId(row.id);
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} user={user} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleRowClick(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}