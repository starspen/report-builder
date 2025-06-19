
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentTableSuccess from "./tab-success/content-table";
import ContentTableFailed from "./tab-failed/content-table";
import StampPageHeader from "./page-header";
import { auth } from "@/lib/auth";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";

const ReactTablePage = async () => {
  const session = await auth()
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
              <Link href="/dashboard/home">Official Receipt</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Receipt Stamp</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* <Card>
          <CardHeader>
            <CardTitle>Receipt Stamp</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="success" className="w-full">
              <TabsList className="">
                <TabsTrigger 
                value="success"
                className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger value="failed"
                className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
                >
                  Failed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="success">
                <ContentTableSuccess />
              </TabsContent>
              <TabsContent value="failed">
                <ContentTableFailed />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}
        <Card>
          <StampPageHeader session={session}/>
      </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
