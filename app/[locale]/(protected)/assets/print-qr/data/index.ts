export type DataProps = {
  entity_cd: string;
  entity_name: string;
  reg_id: string;
  fa_descs: string;
  div_descs: string;
  dept_descs: string;
  location: string;
  acquire_date: string;
  purchase_date: string;
  descs: string;
  qr_url_attachment: string;
  isprint: string;
  audit_status: string;
  // URL attachments untuk images
  url_file_attachment: string;
  url_file_attachment2: string;
  url_file_attachment3: string;
};

export const tableHeaders = [
  {
    accessorKey: "images", // Kolom gabungan untuk carousel
    header: "Images",
  },
  {
    accessorKey: "entity_name",
    header: "Entity",
  },
  {
    accessorKey: "reg_id",
    header: "Registration ID",
  },
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "fa_descs",
    header: "Fixed Asset",
  },
  {
    accessorKey: "div_descs",
    header: "Division",
  },
  {
    accessorKey: "dept_descs",
    header: "Department",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
  },
  {
    accessorKey: "acquire_date",
    header: "Acquire Date",
  },
  {
    accessorKey: "isprint",
    header: "Printed",
  },
  {
    accessorKey: "audit_status",
    header: "Audit Status",
  },
];
