import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
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

export function Pagination(props: PaginationProps) {
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

  //Note that the ellipsis is a "…" character, not three dots.
  const ellipsisButton = (
    <li>
      <span className={styles.ellipsis}>{"…"}</span>
    </li>
  );

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
    buttons.push(ellipsisButton);
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
    buttons.push(ellipsisButton);
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
          onClick={() =>
            onPageChange(increaseCurrentPage(currentPage, totalPageCount))
          }
          ariaLabel="Next"
          label="Next"
          rightIcon={<FontAwesomeIcon fixedWidth icon={faArrowRight} />}
        />
      </li>
    );
  }

  return (
    <nav aria-label="Pagination">
      <ul className={`${styles.list} ${disabled ? styles.disabled : ""}`}>
        {buttons}
      </ul>
    </nav>
  );
}

Pagination.defaultProps = { disabled: false, siblingCount: 1 };

function decreaseCurrentPage(currentPage: number) {
  const newPage = currentPage - 1;
  return newPage > 0 ? newPage : 1;
}

function increaseCurrentPage(currentPage: number, totalPageCount: number) {
  const newPage = currentPage + 1;
  return newPage <= totalPageCount ? newPage : totalPageCount;
}
