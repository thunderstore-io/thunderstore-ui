import { CSSProperties, ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import { NewIcon } from "../..";
import { classnames, componentClasses } from "../../utils/utils";
import {
  TableVariants,
  TableSizes,
  TableModifiers,
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

type TableRow = TableItem[];

export type TableRows = TableRow[];

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

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (props: TableProps, forwardedRef) => {
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
        ref={forwardedRef}
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
            <tr
              key={`row${rowI}`}
              className="table__row"
              style={columnCSSProps}
            >
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
);

Table.displayName = "Table";
