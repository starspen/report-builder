"use client";
import { useRouter } from "@/components/navigation";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { FormAssign } from "./form-assign";
import { useQuery } from "@tanstack/react-query";
import {
  getTypeInvoiceById,
  getTypeInvoiceDetailById,
} from "@/action/master-type-invoice-action";
import { getMasterUser } from "@/action/master-user-action";
import { useParams } from "next/navigation";

const ReactTablePage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const typeId = params?.id;
  const { data: dataTypeInvoice, isLoading: isLoadingTypeInvoice } = useQuery({
    queryKey: ["master-type-invoice-id"],
    queryFn: async () => {
      const result = await getTypeInvoiceById(typeId as string);
      return result;
    },
  });

  const { data: dataTypeDetailInvoice, isLoading: isLoadingTypeDetailInvoice } =
    useQuery({
      queryKey: ["master-type-invoice-detail-id"],
      queryFn: async () => {
        const result = await getTypeInvoiceDetailById(typeId as string);
        return result;
      },
    });

  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["master-user"],
    queryFn: async () => {
      const result = await getMasterUser();

      return result;
    },
  });

  if (isLoadingTypeInvoice || isLoadingTypeDetailInvoice || isLoadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Button
          onClick={router.back}
          size="icon"
          className="rounded-full bg-default-100 hover:text-default-50 hover:outline-0 hover:outline-offset-0  hover:border-0 hover:ring-0 text-default-600 hover:ring-offset-0 p-4"
        >
          <MoveLeft className=" h-5 w-5" />
        </Button>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between mb-6">
              <h4 className="text-default-900 text-xl font-medium">
                Assignment
              </h4>
            </div>

            <FormAssign
              dataTypeInvoice={dataTypeInvoice?.data || []}
              dataTypeDetailInvoice={dataTypeDetailInvoice?.data || []}
              dataUser={dataUser?.data || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
