import {
  faArrowLeft,
  faArrowRight,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
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
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { currentPage, onPageChange, totalCount, pageSize, disabled } = props;

  const paginationRange = usePagination(totalCount, pageSize, currentPage);

  return (
    <ul className={`${styles.root} ${disabled ? styles.disabled : ""}`}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        label="Prev"
        leftIcon={<FontAwesomeIcon fixedWidth icon={faArrowLeft} />}
      />

      {mapPageNumbers(paginationRange, onPageChange, currentPage)}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        label="Next"
        rightIcon={<FontAwesomeIcon fixedWidth icon={faArrowRight} />}
      />
    </ul>
  );
};

Pagination.defaultProps = { disabled: false };

const mapPageNumbers = (
  paginationRange: Array<number | string>,
  onPageChange: Dispatch<SetStateAction<number>>,
  currentPage: number
) => {
  return paginationRange.map((pageNumber, index: number) => {
    if (pageNumber === DOTS) {
      return (
        <Button
          key={index}
          leftIcon={<FontAwesomeIcon fixedWidth icon={faEllipsis} />}
        />
      );
    }

    return (
      <Button
        key={index}
        label={pageNumber.toString()}
        colorScheme={currentPage === pageNumber ? "primary" : "default"}
        onClick={() => onPageChange(pageNumber as number)}
      />
    );
  });
};
