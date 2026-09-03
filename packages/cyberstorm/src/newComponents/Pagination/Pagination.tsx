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
  /**
   * Builds the URL for a page number. When provided the controls render as
   * anchors instead of buttons, so page 2 onwards is reachable without JS.
   * Omit it where the paginated content has no URL of its own.
   */
  pageHref?: (page: number) => string;
}

interface PageButtonProps {
  page: number;
  onClick: () => void;
  href?: string;
  isCurrent?: boolean;
}

// Modifier and non-primary clicks mean "new tab": let them through.
function handleInPlace(event: React.MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (props: PaginationProps, forwardedRef) => {
    const {
      currentPage,
      onPageChange,
      totalCount,
      pageSize,
      siblingCount = 4,
      pageHref,
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

    // An ellipsis is shown when one or more pages are skipped between the
    // first/last page and the window. When the window sits right next to the
    // first/last page (no gap), no ellipsis is rendered.
    const showLeftEllipsis = leftmostSibling > 2;
    const showRightEllipsis = rightmostSibling < totalPageCount - 1;

    return (
      <nav aria-label="Pagination" ref={forwardedRef} className="pagination">
        {currentPage > 1 && (
          <NavButton
            direction="previous"
            href={pageHref?.(currentPage - 1)}
            onClick={() => onPageChange(currentPage - 1)}
          />
        )}

        {showFirstPage && (
          <PageButton
            page={1}
            href={pageHref?.(1)}
            onClick={() => onPageChange(1)}
          />
        )}

        {showLeftEllipsis && <Ellipsis />}

        {range(leftmostSibling, rightmostSibling).map((page) => (
          <PageButton
            key={`page-${page}`}
            page={page}
            href={pageHref?.(page)}
            isCurrent={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        ))}

        {showRightEllipsis && <Ellipsis />}

        {showLastPage && (
          <PageButton
            page={totalPageCount}
            href={pageHref?.(totalPageCount)}
            onClick={() => onPageChange(totalPageCount)}
          />
        )}

        {currentPage < totalPageCount && (
          <NavButton
            direction="next"
            href={pageHref?.(currentPage + 1)}
            onClick={() => onPageChange(currentPage + 1)}
          />
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

function PageButton({ page, onClick, href, isCurrent }: PageButtonProps) {
  const rootClasses = classnames(
    "pagination__item",
    isCurrent ? "pagination__item--selected" : undefined
  );
  const ariaCurrent = isCurrent ? "page" : undefined;

  if (href !== undefined) {
    return (
      <Actionable
        primitiveType="link"
        href={href}
        onClick={(e) => {
          if (handleInPlace(e)) {
            e.preventDefault();
            onClick();
          }
        }}
        aria-current={ariaCurrent}
        rootClasses={rootClasses}
      >
        {page}
      </Actionable>
    );
  }

  return (
    <Actionable
      primitiveType="button"
      onClick={onClick}
      aria-current={ariaCurrent}
      rootClasses={rootClasses}
    >
      {page}
    </Actionable>
  );
}

interface NavButtonProps {
  direction: "previous" | "next";
  onClick: () => void;
  href?: string;
}

function NavButton({ direction, onClick, href }: NavButtonProps) {
  const isPrevious = direction === "previous";
  const icon = (
    <NewIcon csMode="inline" noWrapper>
      <FontAwesomeIcon icon={isPrevious ? faArrowLeft : faArrowRight} />
    </NewIcon>
  );
  const content = (
    <>
      {isPrevious && icon}
      {isPrevious ? "Prev" : "Next"}
      {!isPrevious && icon}
    </>
  );

  if (href !== undefined) {
    return (
      <Actionable
        primitiveType="link"
        href={href}
        rel={isPrevious ? "prev" : "next"}
        onClick={(e) => {
          if (handleInPlace(e)) {
            e.preventDefault();
            onClick();
          }
        }}
        rootClasses="pagination__item"
      >
        {content}
      </Actionable>
    );
  }

  return (
    <Actionable
      primitiveType="button"
      onClick={onClick}
      rootClasses="pagination__item"
    >
      {content}
    </Actionable>
  );
}

/** Non-interactive indicator for a range of skipped pages. */
function Ellipsis() {
  return (
    <span
      className="pagination__item pagination__item--ellipsis"
      aria-hidden="true"
    >
      …
    </span>
  );
}
