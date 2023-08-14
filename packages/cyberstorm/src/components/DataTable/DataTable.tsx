"use client";
import { CSSProperties, ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import styles from "./DataTable.module.css";
import { Button } from "../Button/Button";

export enum Sort {
  DESC = -1,
  OFF,
  ASC,
}

interface DataTableColumn {
  value: ReactNode;
  sortValue: string | number;
}

type DataTableRow = DataTableColumn[];

export type DataTableRows = DataTableRow[];

export interface DataTableProps {
  headers: { value: string; disableSort: boolean }[];
  rows: DataTableRows;
  disableSort?: boolean;
  sortByHeader?: number;
  sortDirection?: Sort;
}

interface SortButtonProps {
  identifier: number;
  current: number;
  direction: Sort;
  hook: React.Dispatch<
    React.SetStateAction<{ identifier: number; direction: Sort }>
  >;
  label: string;
}

function SortButton(props: SortButtonProps) {
  const { identifier, current, direction = Sort.OFF, hook, label } = props;

  const hookParams = { identifier, direction: Sort.DESC };
  let icon = faSort;
  let iconClass = styles.buttonIcon;

  if (identifier === current) {
    hookParams.direction = direction === Sort.ASC ? Sort.DESC : Sort.ASC;
    icon = direction === Sort.ASC ? faSortDown : faSortUp;
    iconClass = styles.buttonIconActive;
  }

  return (
    <Button
      iconAlignment="side"
      colorScheme="transparentTertiary"
      paddingSize="medium"
      fontSize="medium"
      fontWeight="700"
      onClick={() => hook(hookParams)}
      rightIcon={
        <FontAwesomeIcon icon={icon} fixedWidth className={iconClass} />
      }
      label={label}
    />
  );
}

export function DataTable(props: DataTableProps) {
  const {
    headers,
    rows,
    sortByHeader = 0,
    sortDirection = Sort.DESC,
    disableSort = false,
  } = props;

  const [sortVariables, setSortVariables] = useState({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  function compare(a: DataTableRow, b: DataTableRow) {
    const column = sortVariables.identifier;
    if (a[column] && b[column] && a[column].sortValue < b[column].sortValue) {
      return sortVariables.direction;
    }
    if (a[column] && b[column] && a[column].sortValue > b[column].sortValue) {
      return -sortVariables.direction;
    }
    return 0;
  }

  if (!disableSort) {
    rows.sort(compare);
  }

  const rowsStyles = { "--row-count": rows.length } as CSSProperties;
  const rowStyles = { "--column-count": headers.length } as CSSProperties;

  return (
    <div className={styles.gridTable}>
      <div className={styles.gridHeaders} style={rowStyles}>
        {headers.map((header, headerI) => (
          <div key={headerI} className={styles.gridHeader}>
            {header.disableSort ? (
              <Button
                iconAlignment="side"
                colorScheme="transparentTertiary"
                paddingSize="large"
                fontSize="medium"
                fontWeight="700"
                label={header.value}
              />
            ) : (
              <SortButton
                identifier={headerI}
                current={sortVariables.identifier}
                direction={sortVariables.direction}
                hook={setSortVariables}
                label={header.value}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.gridRows} style={rowsStyles}>
        {rows.map((row, rowI) => (
          <div key={`row${rowI}`} className={styles.gridRow} style={rowStyles}>
            {row.map((col, colI) => (
              <div key={`row${rowI}_col${colI}`} className={styles.gridCell}>
                {col.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";
