export type CategoryDataProps = {
  category_cd: string;
  descs: string;
  category_group_cd: string;
  complain_type: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
};

export const categoryHeaders = [
  {
    accessorKey: "category_cd",
    header: "Category Code",
  },
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "category_group_cd",
    header: "Category Group Code",
  },
  {
    accessorKey: "complain_type",
    header: "Complain Type",
  },
  {
    accessorKey: "audit_user",
    header: "Audit User",
  },
  {
    accessorKey: "audit_date",
    header: "Audit Date",
  },
  {
    accessorKey: "rowID",
    header: "Row ID",
  },
];
