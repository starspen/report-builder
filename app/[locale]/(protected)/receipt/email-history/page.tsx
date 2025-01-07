"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentTableSuccess from "./tab-success/content-table";
import ContentTableFailed from "./tab-failed/content-table";

const ReactTablePage = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Email History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="success" className="content-center">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="success">Success</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              <TabsContent value="success">
                <ContentTableSuccess />
              </TabsContent>
              <TabsContent value="failed">
                <ContentTableFailed />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
