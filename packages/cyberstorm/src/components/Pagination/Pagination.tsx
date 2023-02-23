import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import { range } from "../../utils/utils";
import styles from "./Pagination.module.css";
import { PaginationButton } from "./PaginationButton";

export interface PaginationProps {
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  totalCount: number;
  pageSize: number;
  disabled?: boolean;
  siblingCount: number;
}

const DOTS = "…";

export const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    currentPage,
    onPageChange,
    totalCount,
    pageSize,
    disabled,
    siblingCount,
  } = props;

  if (totalCount === 0) {
    return null;
  }

  const totalPageCount = Math.ceil(totalCount / (pageSize > 0 ? pageSize : 1));

  const buttons = [];

  const leftmostSibling = Math.max(currentPage - siblingCount, 1);
  const rightmostSibling = Math.min(currentPage + siblingCount, totalPageCount);

  if (currentPage > 1) {
    buttons.push(
      <li>
        <PaginationButton
          onClick={() => onPageChange(decreaseCurrentPage(currentPage))}
          ariaLabel="Previous"
          label="Prev"
          leftIcon={<FontAwesomeIcon fixedWidth icon={faArrowLeft} />}
        />
      </li>
    );
  }
  if (leftmostSibling > 1) {
    buttons.push(
      <li>
        <PaginationButton
          key="page-1"
          ariaLabel="Page 1"
          label="1"
          onClick={() => onPageChange(1)}
        />
      </li>
    );
    buttons.push(
      <li>
        <span className={styles.ellipsis}>{DOTS}</span>
      </li>
    );
  }

  range(leftmostSibling, rightmostSibling).forEach((pageNumber) => {
    buttons.push(
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
  });

  if (rightmostSibling < totalPageCount) {
    buttons.push(
      <li>
        <span className={styles.ellipsis}>{DOTS}</span>
      </li>
    );
    buttons.push(
      <li>
        <PaginationButton
          key={`page-${totalPageCount}`}
          ariaLabel={`Page ${totalPageCount}`}
          label={`${totalPageCount}`}
          onClick={() => onPageChange(totalPageCount)}
        />
      </li>
    );
  }
  if (currentPage !== totalPageCount) {
    buttons.push(
      <li>
        <PaginationButton
          onClick={() => onPageChange(increaseCurrentPage(currentPage))}
          ariaLabel="Next"
          label="Next"
          rightIcon={<FontAwesomeIcon fixedWidth icon={faArrowRight} />}
        />
      </li>
    );
  }

  function decreaseCurrentPage(currentPage: number) {
    const newPage = currentPage - 1;
    return newPage > 0 ? newPage : 1;
  }

  function increaseCurrentPage(currentPage: number) {
    const newPage = currentPage + 1;
    return newPage <= totalPageCount ? newPage : totalPageCount;
  }

  return (
    <nav aria-label="Pagination">
      <ul className={`${styles.root} ${disabled ? styles.disabled : ""}`}>
        {buttons}
      </ul>
    </nav>
  );
};

Pagination.defaultProps = { disabled: false, siblingCount: 1 };
