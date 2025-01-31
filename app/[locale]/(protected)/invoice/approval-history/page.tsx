"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentTable from "./content-table";

const ReactTablePage = () => {
  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
