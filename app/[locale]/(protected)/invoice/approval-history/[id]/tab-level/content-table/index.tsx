"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentTable({ data }: { data: any }) {
  return (
    <Fragment>
      <Card>
        <CardContent className="p-4">
          <h4 className="text-default-900 text-xl font-medium">
            Approval Information
          </h4>
          <DataTable data={data?.data || []} columns={columns} />
        </CardContent>
      </Card>
    </Fragment>
  );
}
