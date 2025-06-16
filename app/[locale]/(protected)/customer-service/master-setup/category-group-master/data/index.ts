export type CategoryGroupDataProps = {
  category_group_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const categoryGroupHeaders = [
  {
    accessorKey: "category_group_cd",
    header: "Category Group Code",
  },
  {
    accessorKey: "descs",
    header: "Description",
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
]