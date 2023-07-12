import { CSSProperties, ReactNode, useState } from "react";
import styles from "./DataTable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "../Button/Button";

export type DataTableRows = {
  value: ReactNode;
  sortValue: string | number;
}[][];

export interface DataTableProps {
  headers: { value: string; disableSort: boolean }[];
  rows: DataTableRows;
  disableSort?: boolean;
  sortByHeader?: number;
  sortDirection?: 1 | -1;
}

interface CustomCSSColumn extends CSSProperties {
  "--column-count": number;
}

interface CustomCSSRow extends CSSProperties {
  "--row-count": number;
}

interface SortButtonProps {
  identifier: number;
  direction: 1 | 0 | -1;
  hook: React.Dispatch<
    React.SetStateAction<{ identifier: number; direction: 1 | 0 | -1 }>
  >;
  fallbackIdentfier?: number;
  label: string;
}

function SortButton(props: SortButtonProps) {
  const {
    identifier,
    direction = 0,
    hook,
    fallbackIdentfier = 0,
    label,
  } = props;
  if (direction === 1) {
    return (
      <Button
        iconAlignment="side"
        colorScheme="transparentTertiary"
        paddingSize="medium"
        fontSize="medium"
        fontWeight="700"
        onClick={() => hook({ identifier: fallbackIdentfier, direction: 0 })}
        rightIcon={
          <FontAwesomeIcon
            icon={faSortUp}
            fixedWidth
            className={styles.buttonIconActive}
          />
        }
        label={label}
      />
    );
  } else if (direction === 0) {
    return (
      <Button
        iconAlignment="side"
        colorScheme="transparentTertiary"
        paddingSize="medium"
        fontSize="medium"
        fontWeight="700"
        onClick={() => hook({ identifier, direction: -1 })}
        rightIcon={
          <FontAwesomeIcon
            icon={faSort}
            fixedWidth
            className={styles.buttonIcon}
          />
        }
        label={label}
      />
    );
  } else {
    return (
      <Button
        iconAlignment="side"
        colorScheme="transparentTertiary"
        paddingSize="medium"
        fontSize="medium"
        fontWeight="700"
        onClick={() => hook({ identifier, direction: 1 })}
        rightIcon={
          <FontAwesomeIcon
            icon={faSortDown}
            fixedWidth
            className={styles.buttonIconActive}
          />
        }
        label={label}
      />
    );
  }
}

export function DataTable(props: DataTableProps) {
  const {
    headers,
    rows,
    sortByHeader = 0,
    sortDirection = -1,
    disableSort = false,
  } = props;
  const [sortVariables, setSortVariables] = useState<{
    identifier: number;
    direction: 1 | 0 | -1;
  }>({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  function compare(
    a: { value: ReactNode; sortValue: string | number }[],
    b: { value: ReactNode; sortValue: string | number }[]
  ) {
    const column = sortVariables.identifier;
    const sortD = sortVariables.direction === 0 ? -1 : sortVariables.direction;
    if (a[column] && b[column] && a[column].sortValue < b[column].sortValue) {
      return sortD;
    }
    if (a[column] && b[column] && a[column].sortValue > b[column].sortValue) {
      return -sortD;
    }
    return 0;
  }

  const columnCount = headers ? headers.length : 0;
  const rowCount = rows ? rows.length : 0;
  if (!disableSort) {
    rows.sort(compare);
  }
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
                {h.disableSort ? (
                  <Button
                    iconAlignment="side"
                    colorScheme="transparentTertiary"
                    paddingSize="large"
                    fontSize="medium"
                    fontWeight="700"
                    label={h.value}
                  />
                ) : (
                  <SortButton
                    identifier={key}
                    direction={
                      sortVariables.identifier === key
                        ? sortVariables.direction
                        : 0
                    }
                    hook={setSortVariables}
                    fallbackIdentfier={sortByHeader}
                    label={h.value}
                  />
                )}
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
                      {c.value}
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
