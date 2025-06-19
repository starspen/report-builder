import { Link } from "@/components/navigation";
import { BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import SRFView from "./page-view";
const Entry = async () => {
  const session = await auth();
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
            <Link href="/dashboard/home">Customer Service</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Service Request Form </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Service Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <SRFView session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Entry;
