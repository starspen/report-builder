export type DataProps = {
  id: string;
  email: string;
  name: string;
  dept_cd: string;
  div_cd: string;
  role: string;
  roles: string[];
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
    accessorKey: "div_cd",
    header: "DIVISION"
  },  
  {
    accessorKey: "dept_cd",
    header: "DEPARTMENT"
  },  
  {
    accessorKey: "roles",
    header: "ROLES"
  },
  
];