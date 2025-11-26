import { type CSSProperties, type ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";
import {
  type TableVariants,
  type TableSizes,
  type TableModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";
import React from "react";

interface SortButtonProps {
  identifier: number;
  current: number;
  direction: TableSort;
  hook: React.Dispatch<
    React.SetStateAction<{ identifier: number; direction: TableSort }>
  >;
  label: string;
}

export enum TableSort {
  DESC = -1,
  OFF,
  ASC,
}

interface TableItem {
  value: ReactNode;
  sortValue: string | number;
  alignLastRight?: boolean;
}

export type TableLabels = {
  value: string;
  disableSort: boolean;
  columnClasses?: string;
}[];

export type TableRow = TableItem[];

export type TableRows = TableRow[];

export type TableCompareColumnMeta = {
  identifier: number;
  direction: TableSort;
};

export interface TableProps {
  titleRowContent?: ReactNode;
  headers: TableLabels;
  rows: TableRows;
  disableSort?: boolean;
  sortByHeader?: number;
  sortDirection?: TableSort;
  gridTemplateColumns?: string;
  rootClasses?: string;
  csVariant?: TableVariants;
  csSize?: TableSizes;
  csModifiers?: TableModifiers[];
  customSortCompare?: {
    [key: number]: (
      a: TableRow,
      b: TableRow,
      columnMeta: TableCompareColumnMeta
    ) => number;
  };
  ref?: React.Ref<HTMLTableElement>;
}

export function tableDefaultCompare(
  a: TableRow,
  b: TableRow,
  columnMeta: TableCompareColumnMeta
) {
  if (
    a[columnMeta.identifier] &&
    b[columnMeta.identifier] &&
    a[columnMeta.identifier].sortValue < b[columnMeta.identifier].sortValue
  ) {
    return columnMeta.direction;
  }
  if (
    a[columnMeta.identifier] &&
    b[columnMeta.identifier] &&
    a[columnMeta.identifier].sortValue > b[columnMeta.identifier].sortValue
  ) {
    return -columnMeta.direction;
  }
  return 0;
}

function SortButton(props: SortButtonProps) {
  const { identifier, current, direction = TableSort.OFF, hook, label } = props;

  const hookParams = { identifier, direction: TableSort.DESC };
  let icon = faSort;

  if (identifier === current) {
    hookParams.direction =
      direction === TableSort.ASC ? TableSort.DESC : TableSort.ASC;
    icon = direction === TableSort.ASC ? faSortDown : faSortUp;
  }

  return (
    <button className="table__sortbutton" onClick={() => hook(hookParams)}>
      {label}
      <NewIcon noWrapper csMode="inline">
        <FontAwesomeIcon icon={icon} />
      </NewIcon>
    </button>
  );
}

export function Table(props: TableProps) {
  const {
    titleRowContent,
    headers,
    rows,
    sortByHeader = 0,
    sortDirection = TableSort.DESC,
    disableSort = false,
    gridTemplateColumns,
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    csModifiers = [],
    customSortCompare,
    ref,
  } = props;

  const [sortVariables, setSortVariables] = useState<TableCompareColumnMeta>({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  if (!disableSort) {
    if (customSortCompare && customSortCompare[sortVariables.identifier]) {
      rows.sort((a, b) =>
        customSortCompare[sortVariables.identifier](a, b, sortVariables)
      );
    } else {
      rows.sort((a, b) => tableDefaultCompare(a, b, sortVariables));
    }
  }

  // const rowCount = { "--row-count": rows.length } as CSSProperties;
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
    <table
      className={classnames(
        "table",
        ...componentClasses("table", csVariant, csSize, csModifiers),
        rootClasses
      )}
      ref={ref}
    >
      <colgroup>
        <col span={headers.length} />
      </colgroup>
      {titleRowContent ? (
        <caption className="table__caption">{titleRowContent}</caption>
      ) : null}
      <thead>
        <tr className="table__row" style={columnCSSProps}>
          {headers.map((header, headerI) => (
            <th
              key={headerI}
              className="table__header"
              style={columnCSSProps}
              scope="col"
            >
              {header.disableSort ? (
                header.value
              ) : (
                <SortButton
                  identifier={headerI}
                  current={sortVariables.identifier}
                  direction={sortVariables.direction}
                  hook={setSortVariables}
                  label={header.value}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowI) => (
          <tr key={`row${rowI}`} className="table__row" style={columnCSSProps}>
            {row.map((col, colI) => (
              <td
                key={`row${rowI}_col${colI}`}
                className={classnames(
                  "table__item",
                  headers[colI] && headers[colI].columnClasses
                    ? `${headers[colI].columnClasses}`
                    : undefined
                )}
              >
                {col.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Table.displayName = "Table";
