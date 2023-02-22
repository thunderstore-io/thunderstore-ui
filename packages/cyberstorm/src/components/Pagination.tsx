import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import { range } from "../utils/utils";
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

  const leftmostSibling = Math.max(currentPage - siblingCount, 1);
  const rightmostSibling = Math.min(currentPage + siblingCount, totalPageCount);

  const shouldShowLeftDots = leftmostSibling > 2;
  const shouldShowRightDots = rightmostSibling < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftmostSibling, rightmostSibling);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  } else if (shouldShowRightDots) {
    const leftItemCount = 2 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPageCount];
  } else if (shouldShowLeftDots) {
    const rightItemCount = 2 + 2 * siblingCount;
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
    siblingCount,
  } = props;
  const totalPageCount = Math.ceil(totalCount / (pageSize > 0 ? pageSize : 1));
  const paginationRange = getButtonLabels(
    totalPageCount,
    currentPage,
    siblingCount
  );

  function decreaseCurrentPage(currentPage: number) {
    const newPage = currentPage - 1;
    return newPage > 0 ? newPage : 1;
  }

  function increaseCurrentPage(currentPage: number) {
    const newPage = currentPage + 1;
    return newPage <= totalPageCount ? newPage : totalPageCount;
  }

  if (totalCount === 0) {
    return null;
  }

  return (
    <nav aria-label="Pagination">
      <ul className={`${styles.root} ${disabled ? styles.disabled : ""}`}>
        {currentPage === 1 ? null : (
          <li>
            <PaginationButton
              onClick={() => onPageChange(decreaseCurrentPage(currentPage))}
              ariaLabel="Previous"
              label="Prev"
              leftIcon={<FontAwesomeIcon fixedWidth icon={faArrowLeft} />}
            />
          </li>
        )}

        {mapPageNumbers(paginationRange, onPageChange, currentPage)}

        {currentPage === totalPageCount ? null : (
          <li>
            <PaginationButton
              onClick={() => onPageChange(increaseCurrentPage(currentPage))}
              ariaLabel="Next"
              label="Next"
              rightIcon={<FontAwesomeIcon fixedWidth icon={faArrowRight} />}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};

Pagination.defaultProps = { disabled: false, siblingCount: 1 };

const mapPageNumbers = (
  paginationRange: Array<number | string>,
  onPageChange: Dispatch<SetStateAction<number>>,
  currentPage: number
) => {
  return paginationRange.map((pageNumber, index: number) => {
    if (pageNumber === DOTS) {
      return (
        <li>
          <span className={styles.ellipsis} key={`dots-${index}`}>
            {DOTS}
          </span>
        </li>
      );
    } else {
      return (
        <li>
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
        </li>
      );
    }
  });
};
