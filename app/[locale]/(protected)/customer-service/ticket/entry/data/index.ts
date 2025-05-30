// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/data/ticket-data.ts
import { StaticImageData } from "next/image";

export type TicketDataProps = {
  reportNo: string;
  reportDate: string;
  debtorName: string;
  lotNo: string;
  category: string;
  status: "Open" | "Closed" | "In Progress";
  detail?: {
    takenBy: string;
    billingType: string;
    debtorAcct: string;
    contactPerson: string;
    telephone: string;
    source: string;
    currency: string;
    area: string;
    location: string;
    floor: string;
    requestBy: string;
    contactNo: string;
    respondDate: string;
    workRequested: string;
    picture: string;
  };
}

export const ticketHeaders = [
  {
    accessorKey: "reportNo",
    header: "Report No",
  },
  {
    accessorKey: "reportDate",
    header: "Report Date",
  },
  {
    accessorKey: "debtorName",
    header: "Debtor Name",
  },
  {
    accessorKey: "lotNo",
    header: "Lot No",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
  }
]

export const ticketData: TicketDataProps[] = [
  {
    reportNo: "EX25030003",
    reportDate: "20/03/2025 07:19",
    debtorName: "Meizar Suyardi",
    lotNo: "E11A",
    category: "ELCB Problem",
    status: "Open",
    detail: {
      takenBy: "MOBILE",
      billingType: "Tenant",
      debtorAcct: "13517",
      contactPerson: "Meizar Suyardi",
      telephone: "Not Set",
      source: "MOBILE",
      currency: "IDR",
      area: "E.11.A",
      location: "null",
      floor: "11",
      requestBy: "RENALDY MUKRIYANTO",
      contactNo: "0811165888",
      respondDate: "20/03/2025 07:19",
      workRequested: "Nyetrum panel nya",
      picture: "https://images.unsplash.com/photo-1607976973585-a6c285b90ef5",
    },
  },
  {
    reportNo: "EX25030002",
    reportDate: "14/03/2025 02:50",
    debtorName: "Meizar Suyardi",
    lotNo: "E11A",
    category: "AC Not Cold",
    status: "Open",
    detail: {
      takenBy: "MOBILE",
      billingType: "Tenant",
      debtorAcct: "13517",
      contactPerson: "Meizar Suyardi",
      telephone: "Not Set",
      source: "MOBILE",
      currency: "IDR",
      area: "E.11.A",
      location: "null",
      floor: "11", 
      requestBy: "RENALDY MUKRIYANTO",
      contactNo: "0811165888",
      respondDate: "14/03/2025 02:50",
      workRequested: "AC tidak dingin",
      picture: "https://images.unsplash.com/photo-1607976973585-a6c285b90ef5",
    },
  },
];