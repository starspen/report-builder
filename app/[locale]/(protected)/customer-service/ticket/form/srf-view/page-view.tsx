'use client'

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/components/navigation";
import { useReactToPrint } from "react-to-print";

interface SRFData {
  docNo: string;
  createBy: string;
  date: string;
  name: string;
  unit: string;
  requestBy: string;
  service: string;
  description: string;
  workRequest: string;
  takenBy: string;
}

import { ticketData, TicketDataProps } from "../data";
import { useSearchParams } from "next/navigation";

export default function SRFPageView() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const ticketNo = searchParams?.get("ticketNo");

  // Contoh data SRF
  const srfData: TicketDataProps | undefined = ticketData.find((item) => item.reportNo === ticketNo);

  if (!srfData) {
    return <div>SRF not found</div>;
  }

  const handlePrint = () => {
    // Redirect ke halaman print dengan parameter ticketNo
    router.push(`/customer-service/srf-print?ticketNo=${ticketNo}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Tombol Print dan Cancel */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handlePrint}>
          Print
        </Button>
      </div>

      {/* Dokumen A4 */}
      <div 
        ref={printRef} 
        className="bg-white mx-auto w-[210mm] min-h-[297mm] p-8 shadow-md"
      >
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="font-bold">Doc No.: {srfData.reportNo}</h2>
            <p>Create By: {srfData.detail?.requestBy}</p>
          </div>
          <div className="text-right">
            {/* Logo bisa ditambahkan di sini */}
          </div>
        </div>

        {/* Company Name */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl mb-2">PT. IFCA Property365 Indonesia</h1>
          <h2 className="font-bold text-lg border-b-2 border-black pb-2">SERVICE REQUEST FORM</h2>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="w-1/6 py-2">No</td>
                <td className="w-1/12">:</td>
                <td className="font-bold">{srfData.reportNo}</td>
              </tr>
              <tr>
                <td className="py-2">Date</td>
                <td>:</td>
                <td>{srfData.reportDate}</td>
              </tr>
              <tr>
                <td className="py-2">Name</td>
                <td>:</td>
                <td>{srfData.debtorName}</td>
              </tr>
              <tr>
                <td className="py-2">Unit</td>
                <td>:</td>
                <td>{srfData.lotNo}</td>
              </tr>
              <tr>
                <td className="py-2">Request By</td>
                <td>:</td>
                <td>{srfData.detail?.requestBy}</td>
              </tr>
              <tr>
                <td className="py-2">Service</td>
                <td>:</td>
                <td>{srfData.detail?.workRequested}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-bold mb-2">Description:</h3>
          <div className="border border-gray-300 p-4 min-h-[100px]">
            {srfData.detail?.workRequested}
          </div>
        </div>

        {/* Work Request */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="w-1/6 py-2">Work Request</td>
                <td className="w-1/12">:</td>
                <td>{srfData.detail?.workRequested}</td>
              </tr>
              <tr>
                <td className="py-2">Taken By</td>
                <td>:</td>
                <td>{srfData.detail?.takenBy}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-16">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-1/2 text-center">
                  <p className="font-bold">Prepared By</p>
                  <div className="h-20"></div>
                  <div className="border-t border-black w-3/4 mx-auto"></div>
                </td>
                <td className="w-1/2 text-center">
                  <p className="font-bold">Approved By</p>
                  <div className="h-20"></div>
                  <div className="border-t border-black w-3/4 mx-auto"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}