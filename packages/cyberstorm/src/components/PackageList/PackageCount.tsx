import styles from "./PackageList.module.css";

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
export const PackageCount = (props: Props) => {
  const { page, pageSize, searchQuery, totalCount } = props;
  const first = (page - 1) * pageSize + 1;
  const last = first + pageSize - 1;

  return (
    <p className={styles.packageCount}>
      Showing{" "}
      <strong>
        {first}-{last}
      </strong>{" "}
      of <strong>{totalCount}</strong> results
      {searchQuery !== "" ? ` for "${searchQuery}"` : ""}
    </p>
  );
};

PackageCount.displayName = "PackageCount";
