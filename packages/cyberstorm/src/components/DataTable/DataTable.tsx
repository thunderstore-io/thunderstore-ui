import { CSSProperties, ReactNode } from "react";
import styles from "./DataTable.module.css";

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
}

interface CustomCSSColumn extends CSSProperties {
  "--column-count": number;
}

interface CustomCSSRow extends CSSProperties {
  "--row-count": number;
}

export function DataTable(props: DataTableProps) {
  const { headers, rows } = props;
  const columnCount = headers ? headers.length : 0;
  const rowCount = rows ? rows.length : 0;
  return (
    <div className={styles.gridTable}>
      <div
        className={styles.gridHeaders}
        style={
          {
            "--column-count": columnCount,
          } as CustomCSSColumn
        }
      >
        {headers &&
          headers.map((h, key) => {
            return (
              <div key={key} className={styles.gridHeader}>
                {h}
              </div>
            );
          })}
      </div>
      <div
        className={styles.gridRows}
        style={
          {
            "--row-count": rowCount,
          } as CustomCSSRow
        }
      >
        {rows &&
          rows.map((r, rk) => {
            return (
              <div
                key={`${rk}`}
                className={styles.gridRow}
                style={
                  {
                    "--column-count": columnCount,
                  } as CustomCSSColumn
                }
              >
                {r.map((c, ck) => {
                  return (
                    <div key={`${rk}_${ck}`} className={styles.gridCell}>
                      {c}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";
