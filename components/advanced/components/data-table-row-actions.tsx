"use client";

import { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  return (
    <>
      <p>Actions</p>
    </>
  );
}
