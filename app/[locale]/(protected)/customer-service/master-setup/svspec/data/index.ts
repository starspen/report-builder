export type SvspecDataProps = {
  entity_cd: string;
  project_no: string;
  prefix: string;
  report_seq_no: string;
  by_project: string;
  endorsed_by: string;
  approved_by: string;
  audit_user: string;
  audit_date: string;
  trx_type: string;
  markup: string;
  link: string;
  age1: string;
  age2: string;
  age3: string;
  age4: string;
  age5: string;
  age6: string;
  rowID: string;
  complain_seq_no: string;
  tenant_prefix: string;
  building_prefix: string;
  approve_seq: string;
  complain_source: string;
  seq_no_ticket: string;
  visitor_acct: string;
};

export const svspecHeaders = [
  {
    accessorKey: "entity_cd",
    header: "Entity Code",
  },
  {
    accessorKey: "project_no",
    header: "Project Number",
  },
  {
    accessorKey: "report_seq_no",
    header: "Sequence No",
  },
  {
    accessorKey: "prefix",
    header: "Prefix",
  },
];
