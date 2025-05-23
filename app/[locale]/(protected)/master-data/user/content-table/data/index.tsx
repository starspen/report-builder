export type DataProps = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  action: React.ReactNode;
};

export const tableHeaders = [
  // {
  //   accessorKey: "user_id",
  //   header: "USER ID",
  // },
  {
    accessorKey: "email",
    header: "EMAIL"
  },
  {
    accessorKey: "name",
    header: "NAME"
  },
  {
    accessorKey: "role",
    header: "ROLE"
  },
  {
    accessorKey: "created_at",
    header: "CREATED AT"
  }
  
];