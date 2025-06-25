"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentTableSuccess from "./tab-success/content-table";
import ContentTableFailed from "./tab-failed/content-table";
import ContentTableNoBlast from "./tab-no-blast/content-table";
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
              <Link href="/dashboard/home">Invoice</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Invoive Blast History</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Blast History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="success" className="content-center">
              <TabsList>
                <TabsTrigger
                  value="success"
                  className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >
                  Success
                </TabsTrigger>
                <TabsTrigger
                  value="failed"
                  className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >
                  Failed
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >
                  No Blast
                </TabsTrigger>
              </TabsList>
              <TabsContent value="success">
                <ContentTableSuccess />
              </TabsContent>
              <TabsContent value="failed">
                <ContentTableFailed />
              </TabsContent>
              <TabsContent value="completed">
                <ContentTableNoBlast />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
