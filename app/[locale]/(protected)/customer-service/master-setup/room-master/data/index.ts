export type RoomDataProps = {
  entity_cd: string;
  project_no: string;
  room_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const roomHeaders = [
  {
    accessorKey: "entity_cd",
    header: "Entity Code",
  },
  {
    accessorKey: "project_no",
    header: "Project Number",
  },
  {
    accessorKey: "room_cd",
    header: "Room Code",
  },
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "audit_user",
    header: "Audit User",
  },
  {
    accessorKey: "audit_date",
    header: "Audit Date",
  },
  {
    accessorKey: "rowID",
    header: "Row ID",
  },
]