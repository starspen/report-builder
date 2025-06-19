import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { auth } from "@/lib/auth";
import FailedPageView from "./tab-failed/page-view";
import PendingPageView from "./tab-success/page-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StampPageHeader from "./page-header";

const UnsignPage = async () => {
  const session = await auth();

  if (!session?.user) return null;
  return (
    <div className="space-y-5">
      {/* <SiteBreadcrumb /> */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard/home">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dashboard/home">Emeterai</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>stamp</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <StampPageHeader session={session}/>
      </Card>
    </div>
  );
};

export default UnsignPage;
