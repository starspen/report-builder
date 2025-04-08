"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useQuery } from "@tanstack/react-query";
import { getManyData, updatePrint } from "@/action/generate-qr-action";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/components/navigation";

export default function BulkPrintPageView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bulk-print-data"],
    queryFn: async () => {
      console.log(dataArray)
      const result = await getManyData(dataArray);
      return result;
    },
  });

  const componentRef = useRef<HTMLDivElement>(null);

  const printContent = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: 50mm 20mm; /* Ukuran kertas thermal printer */
        margin: 0; /* Hilangkan margin */
      }
      body {
        margin: 0;
        padding: 0;
      }
    `,
    onAfterPrint: () => {
      router.refresh();
    },
  });

  if (!searchParams) {
    return null;
  }

  // Parse searchParams menjadi dataArray
  const entity_cds = searchParams.getAll("e");
  const reg_ids = searchParams
    .getAll("r")
    .map((reg_id) => reg_id.replace(/_/g, "/"));

  const dataArray = entity_cds.map((entity_cd, index) => ({
    entity_cd,
    reg_id: reg_ids[index], // Cocokkan dengan index yang sama
  }));
  

  const handlePrint = async () => {
    // Tambahkan penundaan sebelum mencetak
    setTimeout(() => {
      // Panggil fungsi untuk mencetak
      printContent();
    }, 100); // 1000 ms = 1 detik, sesuaikan sesuai kebutuhan

    // Panggil API updatePrint setelah pencetakan
    try {
      await updatePrint(dataArray);
    } catch (error) {
      console.error("Error updating print data:", error);
    }
  };

  // Render utama
  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex flex-col items-center justify-center gap-12">
          Loading...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex flex-col items-center justify-center gap-12">
          Error fetching data
        </div>
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex flex-col items-center justify-center gap-12">
          {data?.message || "No data available"}
        </div>
      </div>
    );
  }

  const assets = data.result;

  if (!assets || (Array.isArray(assets) && assets.length === 0)) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex flex-col items-center justify-center gap-12">
          No data found on Database
        </div>
      </div>
    );
  }

  const print_label = assets.map((asset: any, index: number) => (
    <div
      key={index}
      className="flex flex-row items-center justify-start border border-gray-300 bg-white"
      style={{
        width: "50mm",
        height: "20mm",
      }}
    >
      <Image
        src={asset.qr_url_attachment || ""}
        alt={`QR Code ${index}`}
        className="h-18 w-18"
        width={72}
        height={72}
        priority
      />
      <div className="flex flex-col gap-1 p-1">
        <h1 className="text-[0.6rem] font-bold dark:text-secondary">
          {asset.reg_id}
        </h1>
        <p
          className="line-clamp-3 overflow-hidden text-[0.6rem] font-semibold leading-tight dark:text-secondary"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {asset.descs}
        </p>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-row justify-center gap-12">
        {/* Container yang akan dicetak */}
        <div ref={componentRef} className="flex flex-col">
          {/* Looping print label */}
          {print_label}
        </div>
        {/* Tombol cetak */}
        <Button
          onClick={() => handlePrint()}
          className="mt-8 rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Print Label
        </Button>
      </div>
    </div>
  );
}
