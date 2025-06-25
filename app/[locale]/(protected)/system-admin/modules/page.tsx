// app/dashboard/modules/page.tsx (or wherever this lives)
import React from "react";
import ModulesPageView from "./page-view";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await auth();
  const menu = await getNewMenu();
  const hasMenu = menu.data.menuList
  const role = session?.user.role

  console.log("Role : " + role)
  if (!hasMenu.includes("Modules") && role !== "administrator") {
    return redirect("/");
  }

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
            <Link href="/dashboard/home">System Admin</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Modules</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Module List</CardTitle>
        </CardHeader>
        <CardContent>
          <ModulesPageView session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
