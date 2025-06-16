import { Link } from "@/components/navigation";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MasterTable from "@/components/advanced";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import CategoryGroupMasterView from "./page-view";

const SectionMaster = async () => {
  const session = await auth();

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dashboard">Master Setup</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Category Group Master</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Category Group Master</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryGroupMasterView session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionMaster;
