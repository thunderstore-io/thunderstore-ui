"use client";
import { CSSProperties, ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import styles from "./DataTable.module.css";
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
  current: number;
  direction: 1 | -1;
  hook: React.Dispatch<
    React.SetStateAction<{ identifier: number; direction: 1 | -1 }>
  >;
  label: string;
}

function SortButton(props: SortButtonProps) {
  const { identifier, current, direction = 0, hook, label } = props;
  if (identifier === current) {
    if (direction === 1) {
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
              icon={faSortUp}
              fixedWidth
              className={styles.buttonIconActive}
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
  } else {
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

  const [sortVariables, setSortVariables] = useState({
    identifier: sortByHeader,
    direction: sortDirection,
  });

  function compare(
    a: { value: ReactNode; sortValue: string | number }[],
    b: { value: ReactNode; sortValue: string | number }[]
  ) {
    const column = sortVariables.identifier;
    if (a[column] && b[column] && a[column].sortValue < b[column].sortValue) {
      return sortVariables.direction;
    }
    if (a[column] && b[column] && a[column].sortValue > b[column].sortValue) {
      return -sortVariables.direction;
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
      <div
        className={styles.gridRows}
        style={
          {
            "--row-count": rowCount,
          } as CustomCSSRow
        }
      >
        {rows.map((row, rowI) => (
          <div
            key={`row${rowI}`}
            className={styles.gridRow}
            style={
              {
                "--column-count": columnCount,
              } as CustomCSSColumn
            }
          >
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
