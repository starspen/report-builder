"use server";

export interface CSEntryResponse {
  statusCode: number;
  message: string;
  data: CSEntry[];
}

export interface CSEntry {
  entity_cd: string;
  project_no: string;
  debtor_acct: string;
  report_no: string;
  reported_date: string;
  lot_no: string;
  complain_source: string;
  contact_no: string;
  lantai: string;
  serv_req_by: string;
  work_requested: string;
  attended_by: string;
  assign_to: string;
  billing_type: string;
  reported_by: string;
  problem_cause: string;
  action_taken: string;
  
  //ini berubah
  status: "Open" | "Closed" | "In Progress";
  audit_user: string;
  audit_date: string;
  rowID: string;
  name: string;
  business_id: string;
  currency_cd: string;
  category_cd: string;
  area: string;
  location: string;
  telno: string;

  //ini gua tambah biar gk merah
  reportNo: string;
  reportDate: string;
  debtorName: string;
  lotNo: string;
  category: string;
}

export interface CSEntrySingleResponse {
  statusCode: number;
  message: string;
  data: CSEntry;
}

export const getCSEntry =
  async (): Promise<CSEntryResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-ticket/entry`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Entry:", error);
      throw new Error(
        error instanceof Error ? error.message : "Gagal mengambil data entry",
      );
    }
  };