import styles from "./DataTable.module.css";
import { ReactElement } from "react";

export interface DataTableProps {
  headers?: string[];
  dataRows?: Array<string | number | ReactElement>[];
}

export interface DataTableRowProps {
  rowContent: Array<string | number | ReactElement>;
}

function DataTableRow(props: DataTableRowProps) {
  const { rowContent } = props;

  return (
    <div className={`${styles.row} ${styles.item}`}>
      {rowContent.map((rowItem) => {
        return <div className={styles.column}>{rowItem}</div>;
      })}
    </div>
  );
}

export function DataTable(props: DataTableProps) {
  const { headers = [], dataRows = [] } = props;

  const headersMapped = headers.map((header) => {
    return <div className={styles.column}>{header}</div>;
  });

  const mappedRows = dataRows?.map((dataItem, index: number) => {
    return (
      <div key={index}>
        <DataTableRow rowContent={dataItem} />
      </div>
    );
  });

  return (
    <div className={styles.root}>
      <div className={styles.row}>{headersMapped}</div>
      {mappedRows}
    </div>
  );
}

DataTable.displayName = "DataTable";
