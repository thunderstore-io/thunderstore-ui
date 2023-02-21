import React from "react";
import styles from "./PackageListLeftFilter.module.css";
import { FilterItem } from "../../FilterItem/FilterItem";

interface PackageListFilterDataItem {
  key: string;
  label: string;
  count: number;
}
export interface PackageListLeftFilterProps {
  filterData?: Array<PackageListFilterDataItem>;
}

/**
 * Cyberstorm PackageListTopFilter
 */
export const PackageListLeftFilter: React.FC<PackageListLeftFilterProps> = (
  props
) => {
  const { filterData } = props;
  const filters = filterData?.map((filter) => {
    return (
      <div className={styles.root} key={filter.key}>
        <FilterItem
          count={filter.count}
          checkBoxId={filter.key}
          label={filter.label}
        />
      </div>
    );
  });

  return (
    <div className={styles.root}>
      <div className={styles.allFilter}>
        <FilterItem count={327} checkBoxId="all" label="All" />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
};

PackageListLeftFilter.displayName = "PackageListLayout";
PackageListLeftFilter.defaultProps = { filterData: [] };
