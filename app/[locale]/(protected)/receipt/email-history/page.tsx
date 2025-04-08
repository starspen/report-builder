"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentTableSuccess from "./tab-success/content-table";
import ContentTableFailed from "./tab-failed/content-table";

const ReactTablePage = () => {
  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Blast History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="success" className="w-full">
              <TabsList className="">
                <TabsTrigger value="success"
                className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >Success</TabsTrigger>
                <TabsTrigger value="failed"
                className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >Failed</TabsTrigger>
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
