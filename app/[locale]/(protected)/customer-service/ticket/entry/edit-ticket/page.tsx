import { Link } from "@/components/navigation";
import { BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import EditTicketForm from "./edit-ticket-form";

const EditTicket = async ({ searchParams }: { searchParams: { id: string } }) => {
  const session = await auth();
  const ticketId = searchParams.id;
  
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
          <BreadcrumbItem>Edit Ticket {ticketId}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Edit Ticket {ticketId}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTicketForm session={session} reportNo={ticketId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTicket;
