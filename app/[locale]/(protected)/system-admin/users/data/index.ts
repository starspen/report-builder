export type DataProps = {
  email: string;
  name: string;
  image: string;
  picture: string;
  role: string;
  div_cd: string;
  dept_cd: string;
}

export const tableHeaders = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "div_cd",
    header: "Division",
  },
  {
    accessorKey: "dept_cd",
    header: "Department",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]
