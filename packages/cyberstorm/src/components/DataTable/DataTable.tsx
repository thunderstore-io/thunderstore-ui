import "./DataTable.css";
import ReactDataTable, { TableColumn } from "react-data-table-component";

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  ascending?: boolean;
  defaultSortFieldId?: string | number;
}

const customStyles = {
  headRow: {
    style: {
      color: "var(--color-text--accent)",
      fontWeight: 700,
      backgroundColor: "transparent",
    },
  },
  table: {
    style: {
      backgroundColor: "transparent",
      borderRadius: "8px",
    },
  },
};

export function DataTable<T>(props: DataTableProps<T>) {
  const { columns, data, ascending = true, defaultSortFieldId = 1 } = props;
  return (
    <ReactDataTable
      style={{ backgroundColor: "transparent" }}
      columns={columns}
      data={data}
      defaultSortAsc={ascending}
      defaultSortFieldId={defaultSortFieldId}
      customStyles={customStyles}
    />
  );
}

DataTable.displayName = "DataTable";
