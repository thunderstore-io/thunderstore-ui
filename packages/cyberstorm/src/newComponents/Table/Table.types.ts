import type { ReactNode, Ref } from "react";

// Table ROOT
// Variants
export const TableVariantsList = ["default"] as const;
export type TableVariants = "default";

// Sizes
export const TableSizesList = ["medium"] as const;
export type TableSizes = "medium";

// Modifiers
export const TableModifiersList = ["alignLastColumnRight"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type TableModifiers = typeof TableModifiersList[number];

export enum TableSort {
  DESC = -1,
  OFF,
  ASC,
}

export type TableHeader = {
  value: string;
  disableSort: boolean;
  columnClasses?: string;
  /** CSS length. The column sizes to its content and will not grow past this. */
  maxWidth?: string;
};

export type TableLabels = TableHeader[];

export type TableRow = {
  value: ReactNode;
  sortValue: string | number;
}[];

export type TableRows = TableRow[];

export type TableCompareColumnMeta = {
  identifier: number;
  direction: TableSort;
};

export type TableSortCompare = (
  a: TableRow,
  b: TableRow,
  columnMeta: TableCompareColumnMeta
) => number;

export interface TableProps {
  titleRowContent?: ReactNode;
  headers: TableLabels;
  rows: TableRows;
  disableSort?: boolean;
  sortByHeader?: number;
  sortDirection?: TableSort;
  rootClasses?: string;
  csVariant?: TableVariants;
  csSize?: TableSizes;
  csModifiers?: TableModifiers[];
  horizontalScroll?: boolean;
  customSortCompare?: {
    [key: number]: TableSortCompare;
  };
  ref?: Ref<HTMLTableElement>;
}
