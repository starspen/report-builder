export type ComplainSourceDataProps = {
  complain_source: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const complainSourceHeaders = [
  {
    accessorKey: "complain_source",
    header: "Complain Source Code",
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