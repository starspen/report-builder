export type DataProps = {
  id: string;
  ref_table: string;
  doc_no: string;
  doc_amt: string;
  resource_url: string;
  file_name: string;
  bucket_file_name: string;
  file_name_sign: string;
  file_token: string;
  file_serial_number: string;
  file_status: string;
};

export const tableHeaders = [
  {
    accessorKey: "doc_no",
    header: "Document Number",
  },
  {
    accessorKey: "doc_amt",
    header: "Document Amount",
  },
  {
    accessorKey: "resource_url",
    header: "Resource URL",
  },
  {
    accessorKey: "file_status",
    header: "Status",
  },
];
