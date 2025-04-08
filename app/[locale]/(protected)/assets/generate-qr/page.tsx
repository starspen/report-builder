import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import GenerateQrPageView from "./page-view";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

export default async function GenerateQrPage() {
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
          <BreadcrumbItem>Generate QR Listing</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle className="text-default">Generate QR Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <GenerateQrPageView />
        </CardContent>
      </Card>
    </div>
  );
}
