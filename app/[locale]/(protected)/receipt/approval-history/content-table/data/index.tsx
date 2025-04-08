export type DataProps = {
  entity_name: string;
  project_name: string;
  process_id: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  doc_date: string;
  currency_cd: string;
  approval_date: string;
  approval_status: string;
  action: React.ReactNode;
};

export const tableHeaders = [
  {
    accessorKey: "entity_name",
    header: "ENTITY NAME",
  },
  {
    accessorKey: "project_name",
    header: "PROJECT NAME",
  },
  {
    accessorKey: "debtor_acct",
    header: "DEBTOR ACCT",
  },
  {
    accessorKey: "debtor_name",
    header: "DEBTOR NAME",
  },
  {
    accessorKey: "email_addr",
    header: "EMAIL",
  },
  {
    accessorKey: "doc_no",
    header: "DOC NO",
  },
  {
    accessorKey: "doc_date",
    header: "DOC DATE",
  },
  {
    accessorKey: "approval_date",
    header: "APPROVED DATE/CANCELLED DATE",
  },
  {
    accessorKey: "approval_status",
    header: "STATUS",
  },
  
];