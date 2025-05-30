import { Fragment } from "react";
import { DataTable } from "./components/data-table";
import { createDynamicColumns } from "./components/columns";

interface MasterTableProps {
  data: any[];
  searchable?: boolean;
}

export default function MasterTable({
  data,
  searchable = true,
}: MasterTableProps) {
  const columns = createDynamicColumns(data);

  return (
    <Fragment>
      <DataTable 
        columns={columns} 
        data={data}
        searchable={searchable}
      />
    </Fragment>
  );
}
