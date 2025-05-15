export type DataProps = {
  id: string;
  email: string;
  name: string;
  roles: any;
  menus: any;
  details: React.ReactNode;
  actions: React.ReactNode;
}

export const tableHeaders = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  // {
  //   accessorKey: "details",
  //   header: "Details",
  // },
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  // },
]
