export type SectionDataProps = {
  section_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const sectionHeaders = [
  {
    accessorKey: "section_cd",
    header: "Section Code",
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

export const sectionData: SectionDataProps[] = [
  {
    section_cd: "HS",
    descs: "Housekeeping",
    audit_user: "ADMIN",
    audit_date: "2025-01-21T10:32:13.713Z",
    rowID: "1"
  },
  {
    section_cd: "EG",
    descs: "Engineering",
    audit_user: "ADMIN",
    audit_date: "2025-01-21T10:32:13.713Z",
    rowID: "2"
  },
  {
    section_cd: "CS",
    descs: "Customer Service",
    audit_user: "ADMIN",
    audit_date: "2025-01-21T10:32:13.713Z",
    rowID: "3"
  },
];