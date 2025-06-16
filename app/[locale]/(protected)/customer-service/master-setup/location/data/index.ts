export type LocationDataProps = {
  location_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const locationHeaders = [
  {
    accessorKey: "location_cd",
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