import "./DataTable.css";
import ReactDataTable, { TableProps } from "react-data-table-component";

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

export function DataTable<T>(props: TableProps<T>) {
  return <ReactDataTable {...props} customStyles={customStyles} />;
}

DataTable.displayName = "DataTable";
