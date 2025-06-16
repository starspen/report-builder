export type CSSetupDataProps = {
  section_cd: string;
  category_cd: string;
  service_cd: string;
  trx_type: string;
  descs: string;
  service_day: number;
  audit_user: string;
  audit_date: string;
  labour_rate: number;
  currency_cd: string;
  tax_cd: string;
  rowID: string;
  staff_id: string;
};

export const csSetupHeaders = [
  {
    accessorKey: "service_cd",
    header: "Service Code",
  },
  {
    accessorKey: "section_cd",
    header: "Section Code",
  },
  {
    accessorKey: "category_cd",
    header: "Category Code",
  },
  {
    accessorKey: "trx_type",
    header: "Trx Type",
  },
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "service_day",
    header: "Service Day",
  },
  {
    accessorKey: "tax_cd",
    header: "Tax Code",
  },
  {
    accessorKey: "currency_cd",
    header: "Currency Code",
  },
  {
    accessorKey: "labour_rate",
    header: "Labour Rate",
  }
];
