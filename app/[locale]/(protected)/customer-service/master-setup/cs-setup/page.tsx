import { Link } from "@/components/navigation";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import CSMasterSetupView from "./page-view";

const LabourMaster = async () => {
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
          <BreadcrumbItem>CS Setup</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>CS Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <CSMasterSetupView session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabourMaster;
