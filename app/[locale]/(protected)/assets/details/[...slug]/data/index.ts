export type DataProps = {
  entity_cd: string;
  reg_id: string;
  trx_date: string;
  old_location_map: string;
  new_location_map: string;
  old_status_review: string;
  new_status_review: string;
  note: string;
  staff_name: string;
  staff_id: string;
  audit_status: string;
  audit_user: string;
  audit_date: string;
  rowID: number;
  url_file_attachment: string;
  url_file_attachment2: string;
  url_file_attachment3: string;
};

export const tableHeaders = [
  {
    accessorKey: "trx_date",
    header: "Date",
  },
  {
    accessorKey: "url_file_attachment",
    header: "Images",
  },
  {
    accessorKey: "new_location_map",
    header: "New Location",
  },
  {
    accessorKey: "new_status_review",
    header: "Rate Status",
  },

  {
    accessorKey: "note",
    header: "Notes",
  },
  {
    accessorKey: "staff_name",
    header: "Staff",
  },
  {
    accessorKey: "audit_status",
    header: "Audit Status",
  },
];
