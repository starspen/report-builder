"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import ContentTable from "./content-table";

const ReactTablePage = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Invoice Class</CardTitle>
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
