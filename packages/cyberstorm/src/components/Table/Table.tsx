"use client";
import { CSSProperties, ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import styles from "./Table.module.css";
import * as Button from "../Button";
import { Icon } from "../Icon/Icon";

export enum Sort {
  DESC = -1,
  OFF,
  ASC,
}

interface TableColumn {
  value: ReactNode;
  sortValue: string | number;
}

type TableRow = TableColumn[];

export type TableRows = TableRow[];

export interface TableProps {
  headers: { value: string; disableSort: boolean }[];
  rows: TableRows;
  disableSort?: boolean;
  sortByHeader?: number;
  sortDirection?: Sort;
  variant?: "default" | "itemList";
  gridTemplateColumns?: string;
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
    <Button.Root
      iconAlignment="side"
      colorScheme="transparentTertiary"
      paddingSize="medium"
      onClick={() => hook(hookParams)}
    >
      <Button.ButtonLabel>{label}</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={icon} className={iconClass} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
  );
}

export function Table(props: TableProps) {
  const {
    headers,
    rows,
    sortByHeader = 0,
    sortDirection = Sort.DESC,
    disableSort = false,
    variant = "default",
    gridTemplateColumns,
  } = props;

  const [sortVariables, setSortVariables] = useState({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  function compare(a: TableRow, b: TableRow) {
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

  const rowCount = { "--row-count": rows.length } as CSSProperties;
  let columnCSSProps = {};
  if (gridTemplateColumns) {
    columnCSSProps = {
      "--column-count": headers.length,
      "--dynamic-grid-template-columns": gridTemplateColumns,
    } as CSSProperties;
  } else {
    columnCSSProps = { "--column-count": headers.length } as CSSProperties;
  }

  return (
    <div className={getTableVariant(variant)}>
      <div className={getHeadersVariant(variant)} style={columnCSSProps}>
        {headers.map((header, headerI) => (
          <div
            key={headerI}
            className={getHeaderVariant(variant)}
            style={columnCSSProps}
          >
            {variant === "default" ? (
              header.value
            ) : header.disableSort ? (
              <Button.Root
                iconAlignment="side"
                colorScheme="transparentTertiary"
                paddingSize="large"
              >
                <Button.ButtonLabel>{header.value}</Button.ButtonLabel>
              </Button.Root>
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

      <div className={getRowsVariant(variant)} style={rowCount}>
        {rows.map((row, rowI) => (
          <div
            key={`row${rowI}`}
            className={getRowVariant(variant)}
            style={columnCSSProps}
          >
            {row.map((col, colI) => (
              <div
                key={`row${rowI}_col${colI}`}
                className={getCellVariant(variant)}
              >
                {col.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const getTableVariant = (scheme: string) => {
  return {
    default: styles.grid__Table,
    itemList: styles.grid__Table_ItemList,
  }[scheme];
};
const getHeadersVariant = (scheme: string) => {
  return {
    default: styles.grid__Headers,
    itemList: styles.grid__Headers_ItemList,
  }[scheme];
};
const getHeaderVariant = (scheme: string) => {
  return {
    default: styles.grid__Header,
    itemList: styles.grid__Header_ItemList,
  }[scheme];
};
const getRowsVariant = (scheme: string) => {
  return {
    default: styles.grid__Rows,
    itemList: styles.grid__Rows_ItemList,
  }[scheme];
};
const getRowVariant = (scheme: string) => {
  return {
    default: styles.grid__Row,
    itemList: styles.grid__Row_ItemList,
  }[scheme];
};
const getCellVariant = (scheme: string) => {
  return {
    default: styles.grid__Cell,
    itemList: styles.grid__Cell_ItemList,
  }[scheme];
};

Table.displayName = "Table";
