import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DetailsPageView from "./page-view";
import { Link } from "@/components/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
const DetailsPage = ({ params }: { params: { slug: string[] } }) => {
  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard/home">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/assets/print-qr">Print QR</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Details</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle className="text-default">Print QR Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailsPageView entity_cd={params.slug[0]} reg_id={params.slug[1]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsPage;
