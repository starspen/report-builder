"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentTable from "./content-table";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";

const ReactTablePage = () => {
  return (
    <div>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/dashboard/home">
                <Icon icon="heroicons:home" className="h-5 w-5" />
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/dashboard/home">Master Data</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Assignment Receipt</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>Assignment Receipt</CardTitle>
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
