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
    // action: React.ReactNode;
  };
  
  export const tableHeaders = [
    {
      accessorKey: "entity_name",
      header: "Entity Name",
    },
    {
      accessorKey: "project_name",
      header: "Project Name",
    },
    {
      accessorKey: "debtor_acct",
      header: "Debtor Acct",
    },
    {
      accessorKey: "debtor_name",
      header: "Debtor Name",
    },
    {
      accessorKey: "email_addr",
      header: "Email",
    },
    {
      accessorKey: "doc_no",
      header: "Doc No",
    },
    {
      accessorKey: "doc_date",
      header: "Doc Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    
  ];