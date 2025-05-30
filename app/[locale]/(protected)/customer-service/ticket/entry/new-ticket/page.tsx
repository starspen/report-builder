import { Link } from "@/components/navigation";
import { BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import NewTicketForm from "./new-ticket-form";

const NewTicket = async () => {
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
            <Link href="/dashboard">Customer Service</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/customer-service/ticket/entry">Ticket Entry</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Add New Ticket</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Add New Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <NewTicketForm session={session} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTicket;
