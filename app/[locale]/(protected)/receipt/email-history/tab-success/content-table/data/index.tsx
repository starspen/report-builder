export type DataProps = {
  entity_name: string;
  project_name: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  send_status: string;
  send_date: string;
  doc_amt:string;
  currency_cd:string;
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
    accessorKey: "send_status",
    header: "SEND STATUS",
  },
  {
    accessorKey: "send_date",
    header: "SEND DATE",
  },
  
];