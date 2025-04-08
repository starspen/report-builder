import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import PrintQrPageView from "./page-view";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { auth } from "@/lib/auth";

const PrintQrPage = async () => {
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
            <Link href="/dashboard/home">Assets</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Print QR Listing</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle className="text-default">Print QR Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintQrPageView session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintQrPage;
