import React from "react";
import styles from "./PackageListLeftFilter.module.css";
import { FilterItem } from "../../FilterItem/FilterItem";

export interface PackageListLeftFilterProps {}

/**
 * Cyberstorm PackageListTopFilter
 */
export const PackageListLeftFilter: React.FC<PackageListLeftFilterProps> = (
  props
) => {
  const filters = filterData.map((filter) => {
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
        <FilterItem count={24539} checkBoxId="all" label="All" />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
};

PackageListLeftFilter.displayName = "PackageListLayout";
PackageListLeftFilter.defaultProps = {};

const filterData = [
  { key: "1", label: "Mods", count: 123 },
  { key: "2", label: "Tools", count: 35 },
  { key: "3", label: "Libraries", count: 745 },
  { key: "4", label: "Modpacks", count: 25 },
  { key: "5", label: "Skins", count: 858 },
];
