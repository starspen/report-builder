export type DataProps = {
  type_id: string;
  type_cd: string;
  type_descs: string;
  approval_pic: string;
  assignMaker: React.ReactNode;
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
  
];