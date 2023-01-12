import React, { Dispatch, SetStateAction } from "react";
import styles from "./componentStyles/Pagination.module.css";

const DOTS = "...";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = (
  totalCount: number,
  pageSize: number,
  currentPage: number
) => {
  const siblingCount = 1;
  const totalPageCount = Math.ceil(totalCount / pageSize);

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5;

  /*
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1..totalPageCount]
  */
  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount
  );

  /*
    We do not want to show dots if there is only one position left
    after/before the left/right page count as that would lead to a change if our Pagination
    component size which we do not want
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, DOTS, totalPageCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }
  return [];
};

export interface PaginationProps {
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  totalCount: number;
  pageSize: number;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { currentPage, onPageChange, totalCount, pageSize } = props;

  const paginationRange = usePagination(totalCount, pageSize, currentPage);

  return (
    <ul className={styles.root}>
      <button
        className={styles.item}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <div className={styles.leftArrow} />
      </button>

      {mapPageNumbers(paginationRange, onPageChange, currentPage)}

      <button
        className={styles.item}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <div className={`${styles.rightArrow} ${styles.arrow}`} />
      </button>
    </ul>
  );
};

const mapPageNumbers = (
  paginationRange: Array<number | string>,
  onPageChange: Dispatch<SetStateAction<number>>,
  currentPage: number
) => {
  return paginationRange.map((pageNumber, index: number) => {
    if (pageNumber === DOTS) {
      return (
        <li key={index} className={styles.dots}>
          {DOTS}
        </li>
      );
    }

    return (
      <button
        key={index}
        className={`${styles.item} ${
          currentPage === pageNumber ? styles.arrow : ""
        }`}
        onClick={() => onPageChange(pageNumber as number)}
      >
        {pageNumber}
      </button>
    );
  });
};
