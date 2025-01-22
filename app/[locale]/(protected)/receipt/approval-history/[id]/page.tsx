"use client";
import { useState } from "react";
import { useRouter } from "@/components/navigation";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import ContentTabGeneral from "./tab-general/content-table";
import ContentTabApproval from "./tab-level/content-table";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getReceiptApprovalHd,
  getReceiptApprovalDetail,
  submitReceiptApproval,
} from "@/action/receipt-action";
import { useParams } from "next/navigation";

const ReactTablePage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const processId = params?.id;
  const { data: dataHd, isLoading: isLoadingHd } = useQuery({
    queryKey: ["receipt-approval-detail"],
    queryFn: async () => {
      const result = await getReceiptApprovalHd(processId as string);
      return result;
    },
  });

  const { data: dataLevel, isLoading: isLoadingLevel } = useQuery({
    queryKey: ["receipt-approval-detail-level"],
    queryFn: async () => {
      const result = await getReceiptApprovalDetail(processId as string);
      return result;
    },
  });

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);

  const schema = z.object({
    inputMessage: z.string().min(2, { message: "This field is required." }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(schema),
    resolver: actionType !== "A" ? zodResolver(schema) : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const dataPost = {
        docNo: dataHd?.data[0].doc_no,
        process_id: processId,
        approvalRemark: data.inputMessage,
        approvalStatus: actionType,
      };
      setIsLoadingSubmit(true);
      const result = await submitReceiptApproval(dataPost);
      return result;
    },
    onSuccess: (result) => {
      if (result.statusCode === 200) {
        toast.success(result.message);
        router.push("/receipt/approval-history");
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoadingSubmit(false);
    },
  });

  function onSubmit(data: any) {
    mutation.mutate(data);
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
                Detail Invoice
              </h4>
            </div>

            <Separator className="my-4" />

            {isLoadingHd || isLoadingLevel ? (
              <div>Loading...</div>
            ) : (
              <>
                <ContentTabGeneral data={dataHd} />

                <div className="mt-4">
                  <ContentTabApproval data={dataLevel} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
