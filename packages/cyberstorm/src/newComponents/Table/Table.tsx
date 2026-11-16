import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./Table.css";
import {
  type TableCompareColumnMeta,
  type TableHeader,
  type TableLabels,
  type TableProps,
  type TableRow,
  TableSort,
  type TableSortCompare,
} from "./Table.types";

export type {
  TableCompareColumnMeta,
  TableHeader,
  TableLabels,
  TableProps,
  TableRow,
  TableRows,
} from "./Table.types";
export { TableSort } from "./Table.types";

interface SortButtonProps {
  identifier: number;
  current: number;
  direction: TableSort;
  hook: Dispatch<SetStateAction<TableCompareColumnMeta>>;
  label: string;
}

function columnTrack(header: TableHeader): string {
  return header.maxWidth ? `fit-content(${header.maxWidth})` : "1fr";
}

function gridTemplateColumns(headers: TableLabels): string {
  return headers.map(columnTrack).join(" ");
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

function sortRows(
  rows: TableRow[],
  sort: TableCompareColumnMeta,
  customSortCompare?: TableProps["customSortCompare"]
): TableRow[] {
  const compare: TableSortCompare =
    customSortCompare?.[sort.identifier] ?? tableDefaultCompare;
  return [...rows].sort((a, b) => compare(a, b, sort));
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
    <button
      type="button"
      className="table__sortbutton"
      onClick={() => hook(hookParams)}
    >
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
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    csModifiers = [],
    horizontalScroll = true,
    customSortCompare,
    ref,
  } = props;

  const [sortVariables, setSortVariables] = useState<TableCompareColumnMeta>({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  const sortedRows = disableSort
    ? rows
    : sortRows(rows, sortVariables, customSortCompare);

  const gridStyle = {
    "--grid-template-columns": gridTemplateColumns(headers),
  } as CSSProperties;

  const tableElement = (
    <table
      className={classnames(
        "table",
        ...componentClasses("table", csVariant, csSize, csModifiers),
        rootClasses
      )}
      style={gridStyle}
      ref={ref}
    >
      {titleRowContent ? (
        <caption className="table__caption">{titleRowContent}</caption>
      ) : null}
      <thead>
        <tr className="table__row">
          {headers.map((header, headerI) => (
            <th
              key={headerI}
              className={classnames(
                "table__header",
                header.maxWidth ? "table__header--capped" : undefined
              )}
              scope="col"
            >
              {header.disableSort ? (
                <span className="table__header-text">{header.value}</span>
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
        {sortedRows.map((row, rowI) => (
          <tr key={`row${rowI}`} className="table__row">
            {row.map((col, colI) => (
              <td
                key={`row${rowI}_col${colI}`}
                className={classnames(
                  "table__item",
                  headers[colI]?.maxWidth ? "table__item--capped" : undefined,
                  headers[colI]?.columnClasses
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

  if (horizontalScroll) {
    return <div className="table__scroll-wrapper">{tableElement}</div>;
  }

  return tableElement;
}

Table.displayName = "Table";
