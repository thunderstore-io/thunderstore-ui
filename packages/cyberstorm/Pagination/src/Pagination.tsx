import "./Pagination.css";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classnames, range } from "@thunderstore/cyberstorm-utils";
import React from "react";
import { Actionable } from "@thunderstore/cyberstorm-actionable";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";

export interface PaginationProps {
  currentPage: number;
  onPageChange: (v: number) => void;
  totalCount: number;
  pageSize: number;
  siblingCount: number;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (props: PaginationProps, forwardedRef) => {
    const {
      currentPage,
      onPageChange,
      totalCount,
      pageSize,
      siblingCount = 4,
    } = props;

    if (totalCount === 0) {
      return null;
    }

    const totalPageCount = Math.ceil(
      totalCount / (pageSize > 0 ? pageSize : 1)
    );

    const buttons = [];

    const leftmostSibling = Math.max(currentPage - siblingCount, 1);
    const rightmostSibling = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // START Add buttons
    if (currentPage > 1) {
      buttons.push(
        <Actionable
          key="page-previous"
          primitiveType="button"
          onClick={() => onPageChange(decreaseCurrentPage(currentPage))}
          rootClasses="pagination__item"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowLeft} />
          </NewIcon>
          Prev
        </Actionable>
      );
    }
    if (leftmostSibling > 1) {
      buttons.push(
        <Actionable
          key="page-1"
          primitiveType="button"
          onClick={() => onPageChange(1)}
          rootClasses="pagination__item"
        >
          1
        </Actionable>
      );
    }
    range(leftmostSibling, rightmostSibling).forEach((pageNumber) => {
      buttons.push(
        <Actionable
          key={`page-${pageNumber}`}
          primitiveType="button"
          onClick={() => onPageChange(pageNumber)}
          rootClasses={classnames(
            "pagination__item",
            currentPage === pageNumber
              ? "pagination__item--selected"
              : undefined
          )}
        >
          {(pageNumber === leftmostSibling &&
            currentPage !== leftmostSibling &&
            leftmostSibling > 1) ||
          (pageNumber === rightmostSibling &&
            currentPage !== rightmostSibling &&
            rightmostSibling < totalPageCount)
            ? "…"
            : pageNumber}
        </Actionable>
      );
    });
    if (rightmostSibling < totalPageCount) {
      buttons.push(
        <Actionable
          key={`page-${totalPageCount}`}
          primitiveType="button"
          onClick={() => onPageChange(totalPageCount)}
          rootClasses="pagination__item"
        >
          {totalPageCount}
        </Actionable>
      );
    }
    if (currentPage !== totalPageCount) {
      buttons.push(
        <Actionable
          key="page-next"
          primitiveType="button"
          onClick={() =>
            onPageChange(increaseCurrentPage(currentPage, totalPageCount))
          }
          rootClasses="pagination__item"
        >
          Next
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowRight} />
          </NewIcon>
        </Actionable>
      );
    }
    // END Add buttons

    return (
      <nav aria-label="Pagination" ref={forwardedRef} className="pagination">
        {buttons}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

function decreaseCurrentPage(currentPage: number) {
  const newPage = currentPage - 1;
  return newPage > 0 ? newPage : 1;
}

function increaseCurrentPage(currentPage: number, totalPageCount: number) {
  const newPage = currentPage + 1;
  return newPage <= totalPageCount ? newPage : totalPageCount;
}
