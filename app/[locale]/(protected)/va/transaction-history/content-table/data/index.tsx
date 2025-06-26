export type DataProps = {
    virtual_acct: string;
    entity_name: string;
    project_name: string;
    process_id: string;
    debtor_acct: string;
    debtor_name: string;
    email: string;
    currency_cd: string;
    mbal_amt: string
    // action: React.ReactNode;
  };
  
  export const tableHeaders = [
    {
      accessorKey: "virtual_acct",
      header: "Virtual Account Number",
    },
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mbal_amt",
      header: "Total Amount",
    },
    {
      accessorKey: "status_payment",
      header: "Status",
    },
    
  ];