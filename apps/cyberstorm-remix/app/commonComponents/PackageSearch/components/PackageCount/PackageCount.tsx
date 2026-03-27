import { memo } from "react";

interface Props {
  /** Current page number */
  page: number;
  /** Packages show per page */
  pageSize: number;
  /** Total number of packages matching current query */
  totalCount: number;
}

/**
 * Show the currently displayed packages and the total count of matches
 * for the current filters.
 */
export const PackageCount = memo(function PackageCount(props: Props) {
  const { page, pageSize, totalCount } = props;
  const first = (page - 1) * pageSize + 1;
  const last = first + pageSize - 1;

  if (totalCount === 0) {
    return <p className="package-count">No results</p>;
  }

  return (
    <p className="package-count">
      <b>{`${first}${
        first !== totalCount ? `-${Math.min(last, totalCount)}` : ""
      } `}</b>
      &nbsp;of&nbsp;<b>{totalCount}</b>&nbsp;result{totalCount === 1 ? "" : "s"}
    </p>
  );
});

PackageCount.displayName = "PackageCount";
