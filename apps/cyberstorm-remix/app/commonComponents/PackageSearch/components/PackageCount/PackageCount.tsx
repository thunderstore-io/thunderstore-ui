import { memo } from "react";

import "./PackageCount.css";

interface Props {
  /** Current page number */
  page: number;
  /** Packages show per page */
  pageSize: number;
  /** Currently active text search */
  searchQuery: string;
  /** Total number of packages matching current query */
  totalCount: number;
}

/**
 * Show the currently displayed packages and the total count of matches
 * for the current filters.
 */
export const PackageCount = memo(function PackageCount(props: Props) {
  const { page, pageSize, searchQuery, totalCount } = props;
  const first = (page - 1) * pageSize + 1;
  const last = first + pageSize - 1;
  const query = searchQuery !== "" ? ` for "${searchQuery}"` : "";

  if (totalCount === 0) {
    return <p className="package-count">No results{query}</p>;
  }

  return (
    <p className="package-count">
      {`${first}${
        first !== totalCount ? `-${Math.min(last, totalCount)}` : ""
      } of ${totalCount} results ${query}`}
    </p>
  );
});

PackageCount.displayName = "PackageCount";
