export type CSItemMasterDataProps = {
  item_cd: string;
  descs: string;
  trx_type: string;
  currency_cd: string;
  charge_amt: string;
  stock_cd: string | null;
  audit_user: string;
  audit_date: string;
  ic_flag: string;
  tax_cd: string;
  // mobile_status: string;
  rowID: string;
  entity_cd: string | null;
  div_cd: string | null;
  dept_cd: string | null;
};

export const csItemMasterHeaders = [
  {
    accessorKey: "ic_flag",
    header: "IC Flag",
  },
  {
    accessorKey: "item_cd",
    header: "Item Code",
  },
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "trx_type",
    header: "Trx Type",
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
    accessorKey: "charge_amt",
    header: "Charge Amount",
  }
  // {
  //   accessorKey: "mobile_status",
  //   header: "Mobile Status",
  // }
];
