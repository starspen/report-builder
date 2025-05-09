export type DataProps = {
  type_id: string;
  type_cd: string;
  type_descs: string;
  approval_pic: string;
  created_at: string;
  action: React.ReactNode;
};

export const tableHeaders = [
  {
    accessorKey: "type_cd",
    header: "TYPE CODE"
  },
  {
    accessorKey: "type_descs",
    header: "DESCRIPTION"
  },
  {
    accessorKey: "approval_pic",
    header: "APPROVAL PIC"
  },
  {
    accessorKey: "created_at",
    header: "CREATED AT"
  }
  
];