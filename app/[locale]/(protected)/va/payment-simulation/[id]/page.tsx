"use client"
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { afterPayment, billPresentment } from "@/action/va-action";
import { Loader2 } from "lucide-react";


const ReactTablePage = () => {
    const params = useParams<{ id: string }>();
    const va = params?.id;
    const router = useRouter();
    const queryClient = useQueryClient();
    const {
        data,
        isLoading: isQueryLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["va-bill-presentment", va],
        queryFn: async (): Promise<any> => {
            // server action expects Record<any,any>
            const result = await billPresentment({ virtualAccountNo: va });

            return result
        },
    });

    console.log(data)

    const payMutation = useMutation({
        mutationFn: async (): Promise<any> => {
            if (!data) throw new Error("No VA data");

            // build your payload exactly as you specified
            const payload: Record<any, any> = {
                partnerServiceId: "12345",
                customerNo: va,
                virtualAccountNo: va,
                virtualAccountName: data.virtualAccountData.virtualAccountName,
                virtualAccountEmail: "",
                virtualAccountPhone: "",
                trxId: "",
                paymentRequestId: Date.now().toString(),
                channelCode: 6011,
                hashedSourceAccountNo: "",
                sourceBankCode: "014",
                paidAmount: data.virtualAccountData.billDetails
                    .reduce((sum: number, b: any) => sum + parseFloat(b.billAmount.value), 0)
                    .toFixed(2),
                cumulativePaymentAmount: null,
                paidBills: "",
                totalAmount: data.virtualAccountData.totalAmount,
                trxDateTime: new Date().toISOString(),
                referenceNo: Date.now().toString().slice(-10),
                journalNum: "",
                paymentType: "",
                flagAdvise: "N",
                subCompany: data.virtualAccountData.subCompany,
                billDetails: data.virtualAccountData.billDetails.map((b: any): any => ({
                    ...b,
                    billReferenceNo: Date.now().toString().slice(-10),
                })),
                freeTexts: data.virtualAccountData.freeTexts,
                additionalInfo: {},
            };

            return await afterPayment(payload);
        },
        onMutate() {
            console.log("Submitting payment…");
        },
        onSuccess() {
            console.log("Payment success!");
            queryClient.invalidateQueries({ queryKey: ["va-bill-presentment", va] });
            router.push("/dashboard/home");
        },
        onError(err: unknown) {
            console.error("Payment failed:", err);
        },
        onSettled() {
            console.log("Payment settled");
        },
    });

    if (isQueryLoading) {
        return (
            <div className=" h-screen flex items-center flex-col space-y-2">
                <span className=" inline-flex gap-1  items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <>
            {data ?
                <div className="max-w-2xl mx-auto p-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Virtual Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>No:</strong> {data?.virtualAccountData?.virtualAccountNo?.trim()}</p>
                            <p><strong>Name:</strong> {data.virtualAccountData?.virtualAccountName}</p>
                            <p>
                                <strong>Total Amount:</strong>{" "}
                                {data?.virtualAccountData?.totalAmount?.value} {data?.totalAmount?.currency}
                            </p>
                            <div>
                                <strong>Bills:</strong>
                                <ul className="list-disc ml-5">
                                    {data?.virtualAccountData?.billDetails?.map((b: any) => (
                                        <li key={b.billNo}>
                                            {b.billNo}: {b.billAmount.value} {b.billAmount.currency}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {data?.freeTexts?.length > 0 && (
                                <div>
                                    <strong>Notes:</strong>
                                    <ul className="list-disc ml-5">
                                        {data.freeTexts.map((t: any, i: any) => (
                                            <li key={i}>{t.indonesia}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <Button
                                onClick={() => payMutation.mutate()}
                                disabled={payMutation.isPending}
                            >
                                {payMutation.isPending ? "Processing..." : "Pay"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                : <></>}
        </>
    )
}

export default ReactTablePage;