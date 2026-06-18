import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import { classnames, range } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./Pagination.css";

export interface PaginationProps {
  currentPage: number;
  onPageChange: (v: number) => void;
  totalCount: number;
  pageSize: number;
  siblingCount: number;
}

interface PageButtonProps {
  page: number;
  onClick: () => void;
  isCurrent?: boolean;
  label?: React.ReactNode;
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

    // The window of pages rendered around the current page.
    const leftmostSibling = Math.max(currentPage - siblingCount, 1);
    const rightmostSibling = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // The first/last page get their own buttons when they fall outside the window.
    const showFirstPage = leftmostSibling > 1;
    const showLastPage = rightmostSibling < totalPageCount;

    return (
      <nav aria-label="Pagination" ref={forwardedRef} className="pagination">
        {currentPage > 1 && (
          <NavButton
            direction="previous"
            onClick={() => onPageChange(currentPage - 1)}
          />
        )}

        {showFirstPage && (
          <PageButton page={1} onClick={() => onPageChange(1)} />
        )}

        {range(leftmostSibling, rightmostSibling).map((page) => (
          <PageButton
            key={`page-${page}`}
            page={page}
            isCurrent={page === currentPage}
            label={getSiblingLabel({
              page,
              currentPage,
              leftmostSibling,
              rightmostSibling,
              totalPageCount,
            })}
            onClick={() => onPageChange(page)}
          />
        ))}

        {showLastPage && (
          <PageButton
            page={totalPageCount}
            onClick={() => onPageChange(totalPageCount)}
          />
        )}

        {currentPage < totalPageCount && (
          <NavButton
            direction="next"
            onClick={() => onPageChange(currentPage + 1)}
          />
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

function PageButton({ page, onClick, isCurrent, label }: PageButtonProps) {
  return (
    <Actionable
      primitiveType="button"
      onClick={onClick}
      rootClasses={classnames(
        "pagination__item",
        isCurrent ? "pagination__item--selected" : undefined
      )}
    >
      {label ?? page}
    </Actionable>
  );
}

interface NavButtonProps {
  direction: "previous" | "next";
  onClick: () => void;
}

function NavButton({ direction, onClick }: NavButtonProps) {
  const isPrevious = direction === "previous";
  const icon = (
    <NewIcon csMode="inline" noWrapper>
      <FontAwesomeIcon icon={isPrevious ? faArrowLeft : faArrowRight} />
    </NewIcon>
  );

  return (
    <Actionable
      primitiveType="button"
      onClick={onClick}
      rootClasses="pagination__item"
    >
      {isPrevious && icon}
      {isPrevious ? "Prev" : "Next"}
      {!isPrevious && icon}
    </Actionable>
  );
}

/**
 * Preserves the existing label behaviour: the sibling that borders a hidden
 * range is shown as an ellipsis instead of its page number.
 */
function getSiblingLabel(args: {
  page: number;
  currentPage: number;
  leftmostSibling: number;
  rightmostSibling: number;
  totalPageCount: number;
}): React.ReactNode {
  const {
    page,
    currentPage,
    leftmostSibling,
    rightmostSibling,
    totalPageCount,
  } = args;

  const isLeftBoundary =
    page === leftmostSibling &&
    currentPage !== leftmostSibling &&
    leftmostSibling > 1;

  const isRightBoundary =
    page === rightmostSibling &&
    currentPage !== rightmostSibling &&
    rightmostSibling < totalPageCount;

  return isLeftBoundary || isRightBoundary ? "…" : page;
}
