import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import { range } from "../utils";
import styles from "./componentStyles/Pagination.module.css";
import { PaginationButton } from "./PaginationButton";

export interface PaginationProps {
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  totalCount: number;
  pageSize: number;
  disabled?: boolean;
  siblingCount?: number;
}

const DOTS = "…";

const getButtonLabels = (
  totalPageCount: number,
  currentPage: number,
  siblingCount = 1
) => {
  // maxButtons is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const maxButtons = siblingCount + 5;

  // Show a button for each page if there's just a few of them.
  if (maxButtons >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const prevPageNumber = Math.max(currentPage - siblingCount, 1);
  const nextPageNumber = Math.min(currentPage + siblingCount, totalPageCount);

  const shouldShowLeftDots = prevPageNumber > 2;
  const shouldShowRightDots = nextPageNumber < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(prevPageNumber, nextPageNumber);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  } else if (shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPageCount];
  } else if (shouldShowLeftDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount
    );
    return [firstPageIndex, DOTS, ...rightRange];
  } else {
    return [];
  }
};

export const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    currentPage,
    onPageChange,
    totalCount,
    pageSize,
    disabled,
    siblingCount = 1,
  } = props;
  const totalPageCount = Math.ceil(totalCount / (pageSize > 0 ? pageSize : 1));
  const paginationRange = getButtonLabels(
    totalPageCount,
    currentPage,
    siblingCount
  );

  function decreaseCurrentPage(currentPage: number) {
    const y = currentPage - 1;
    return y > 0 ? y : 1;
  }

  function increaseCurrentPage(currentPage: number) {
    const y = currentPage + 1;
    return y <= totalPageCount ? y : totalPageCount;
  }

  if (totalCount === 0) {
    return <></>;
  }

  return (
    <nav aria-label="Pagination">
      <ul className={`${styles.root} ${disabled ? styles.disabled : ""}`}>
        <PaginationButton
          onClick={() => onPageChange(decreaseCurrentPage(currentPage))}
          ariaLabel="Previous"
          label="Prev"
          leftIcon={<FontAwesomeIcon fixedWidth icon={faArrowLeft} />}
        />

        {mapPageNumbers(paginationRange, onPageChange, currentPage)}

        <PaginationButton
          onClick={() => onPageChange(increaseCurrentPage(currentPage))}
          ariaLabel="Next"
          label="Next"
          rightIcon={<FontAwesomeIcon fixedWidth icon={faArrowRight} />}
        />
      </ul>
    </nav>
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
        <span className={styles.ellipsis} key={`dots-${index}`}>
          {DOTS}
        </span>
      );
    }

    return (
      <PaginationButton
        key={`page-${pageNumber}`}
        ariaCurrent={currentPage === pageNumber}
        ariaLabel={
          currentPage === pageNumber
            ? `Current page ${pageNumber}`
            : `Page ${pageNumber}`
        }
        label={pageNumber.toString()}
        isSelected={currentPage === pageNumber}
        onClick={() => onPageChange(pageNumber as number)}
      />
    );
  });
};
