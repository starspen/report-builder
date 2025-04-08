export type DataProps = {
    file_name_sign: string;
    file_sn_sign: string;
    file_status_sign: string;
    audit_date: string;
    preview: string;
    // action: React.ReactNode;
  };
  
  export const tableHeaders = [
    {
      accessorKey: "file_name_sign",
      header: "FILE NAME",
    },
    {
      accessorKey: "file_sn_sign",
      header: "SERIAL NUMBER",
    },
    {
      accessorKey: "file_status_sign",
      header: "STATUS",
    },
    {
      accessorKey: "audit_date",
      header: "STAMP DATE",
    },
    {
      accessorKey: "preview",
      header: "PREVIEW",
    },
    
  ];