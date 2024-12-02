import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classnames, range } from "../../utils/utils";
import styles from "./Pagination.module.css";
import { PaginationButton } from "./PaginationButton";

export interface PaginationProps {
  currentPage: number;
  onPageChange: (v: number) => void;
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
    disabled = false,
    siblingCount = 1,
  } = props;

  if (totalCount === 0) {
    return null;
  }

  //Note that the ellipsis is a "…" character, not three dots.
  const ellipsisButtonLeft = (
    <li key="page-ellipsis-left">
      <span className={styles.ellipsis}>{"…"}</span>
    </li>
  );
  const ellipsisButtonRight = (
    <li key="page-ellipsis-right">
      <span className={styles.ellipsis}>{"…"}</span>
    </li>
  );

  const totalPageCount = Math.ceil(totalCount / (pageSize > 0 ? pageSize : 1));

  const buttons = [];

  const leftmostSibling = Math.max(currentPage - siblingCount, 1);
  const rightmostSibling = Math.min(currentPage + siblingCount, totalPageCount);

  if (currentPage > 1) {
    buttons.push(
      <li key="page-previous">
        <PaginationButton
          onClick={() => onPageChange(decreaseCurrentPage(currentPage))}
          ariaLabel="Previous"
          label="Prev"
          leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
        />
      </li>
    );
  }
  if (leftmostSibling > 1) {
    buttons.push(
      <li key="page-1">
        <PaginationButton
          ariaLabel="Page 1"
          label="1"
          onClick={() => onPageChange(1)}
        />
      </li>
    );
    buttons.push(ellipsisButtonLeft);
  }

  range(leftmostSibling, rightmostSibling).forEach((pageNumber) => {
    buttons.push(
      <li key={`page-${pageNumber}`}>
        <PaginationButton
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
    buttons.push(ellipsisButtonRight);
    buttons.push(
      <li key={`page-${totalPageCount}`}>
        <PaginationButton
          ariaLabel={`Page ${totalPageCount}`}
          label={`${totalPageCount}`}
          onClick={() => onPageChange(totalPageCount)}
        />
      </li>
    );
  }
  if (currentPage !== totalPageCount) {
    buttons.push(
      <li key="page-next">
        <PaginationButton
          onClick={() =>
            onPageChange(increaseCurrentPage(currentPage, totalPageCount))
          }
          ariaLabel="Next"
          label="Next"
          rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
        />
      </li>
    );
  }

  return (
    <nav aria-label="Pagination">
      <ul
        className={classnames(styles.list, disabled ? styles.disabled : null)}
      >
        {buttons}
      </ul>
    </nav>
  );
}

function decreaseCurrentPage(currentPage: number) {
  const newPage = currentPage - 1;
  return newPage > 0 ? newPage : 1;
}

function increaseCurrentPage(currentPage: number, totalPageCount: number) {
  const newPage = currentPage + 1;
  return newPage <= totalPageCount ? newPage : totalPageCount;
}
