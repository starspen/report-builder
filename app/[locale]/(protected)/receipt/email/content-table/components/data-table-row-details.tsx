"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAdditionalFile } from "@/action/receipt-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { FormUploadAdditionalFile } from "./form-additional-upload";

const rupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    // style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

interface DataTableRowDetailsProps {
  data: any;
}

export function DataTableRowDetails({ data }: DataTableRowDetailsProps) {
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const handlePreviewFile = (
    filename: string,
    invoiceTipe: string,
    fileStatusSign: string
  ) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;
    const formatInvoice = invoiceTipe.toUpperCase();

    let url = "";
    if (mode === "sandbox") {
      if (
        fileStatusSign === "A" ||
        fileStatusSign === "F" ||
        fileStatusSign === "N" ||
        fileStatusSign === null
      ) {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_SANDBOX_URL}`;
      }
    } else {
      if (
        fileStatusSign === "A" ||
        fileStatusSign === "F" ||
        fileStatusSign === "N" ||
        fileStatusSign === null
      ) {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_PRODUCTION_URL}`;
      }
    }
    window.open(url + "EPBOIQ/" + formatInvoice + "/" + filename, "_blank");
  };
  const handlePreviewFileAdditional = (filename: string) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
    }
    window.open(url + "EPBOIQ/EXTRA/" + filename, "_blank");
  };

  const mutationAdditional = useMutation({
    mutationFn: async (data: { docNo: string; fileName: string }) => {
      const result = await deleteAdditionalFile(data.docNo, data.fileName);
      return result;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success("Success deleting file additional");
        queryClient.invalidateQueries({
          queryKey: ["receipt-email"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleDeleteFileAdditional = (docNo: string, fileName: string) => {
    mutationAdditional.mutate({ docNo, fileName });
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            {/* <CardTitle>Details</CardTitle> */}
          </div>
          <Dialog open={isModalOpenUpload} onOpenChange={setIsModalOpenUpload}>
            <Button
              variant="outline"
              color="default"
              size="sm"
              className="ltr:ml-2 rtl:mr-2  h-8 "
              onClick={() => setIsModalOpenUpload(true)}
            >
              <Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
              Upload Additional File
            </Button>

            <FormUploadAdditionalFile
              setIsModalOpenUpload={setIsModalOpenUpload}
              dataProp={data}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-default-200 dark:bg-default-300">
            <TableRow>
              <TableHead>Descs</TableHead>
              <TableHead>Currency Cd</TableHead>
              <TableHead>Doc Amt</TableHead>
              <TableHead>File Receipt</TableHead>
              <TableHead>File Status Sign</TableHead>
              {data.filenames2 && (
                <TableHead>
                  File Additional
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={(event) => {
                        handleDeleteFileAdditional(
                          data.doc_no,
                          data.filenames2
                        );
                        event.preventDefault();
                      }}
                      title={`Remove ${data.filenames2}`}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-dark-600" />
                    </Button>
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data.descs}</TableCell>
              <TableCell>{data.currency_cd}</TableCell>
              <TableCell>{rupiah(data.doc_amt)}</TableCell>
              <TableCell>
                {data.file_status_sign === "S" ? (
                  <Button
                    className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                    size="icon"
                    onClick={(event) => {
                      handlePreviewFile(
                        data.file_name_sign,
                        data.invoice_tipe,
                        data.file_status_sign
                      );
                      event.preventDefault();
                    }}
                    title={`${data.file_name_sign}`}
                    disabled={!data.file_name_sign}
                  >
                    <File className="text-red-600 w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                    size="icon"
                    onClick={(event) => {
                      handlePreviewFile(
                        data.filenames,
                        data.invoice_tipe,
                        data.file_status_sign
                      );
                      event.preventDefault();
                    }}
                    title={`${data.filenames}`}
                    disabled={!data.filenames}
                  >
                    <File className="text-red-600 w-4 h-4" />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {data.file_status_sign === "S" ? (
                  <Badge
                    className={cn(
                      "rounded-full px-5 bg-success/20 text-success"
                    )}
                  >
                    Stamped
                  </Badge>
                ) : (
                  <Badge
                    className={cn(
                      "rounded-full px-5 bg-destructive/20 text-destructive"
                    )}
                  >
                    Not stamp yet
                  </Badge>
                )}
              </TableCell>
              {data.filenames2 && (
                <TableCell>
                  <Button
                    className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                    size="icon"
                    onClick={(event) => {
                      handlePreviewFileAdditional(data.filenames2);
                      event.preventDefault();
                    }}
                    title={`${data.filenames2}`}
                    disabled={!data.filenames2}
                  >
                    <File className="text-red-600 w-4 h-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
