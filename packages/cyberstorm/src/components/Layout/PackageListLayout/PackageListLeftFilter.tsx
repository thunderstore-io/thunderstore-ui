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
        <FilterItem count={327} checkBoxId="all" label="All" />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
};

PackageListLeftFilter.displayName = "PackageListLayout";
PackageListLeftFilter.defaultProps = {};

const filterData = [
  { key: "1", label: "Mods", count: 248 },
  { key: "2", label: "Tools", count: 18 },
  { key: "3", label: "Libraries", count: 84 },
  { key: "4", label: "Modpacks", count: 16 },
  { key: "5", label: "Skins", count: 127 },
  { key: "5", label: "Maps", count: 98 },
  { key: "5", label: "Tweaks", count: 227 },
  { key: "5", label: "Items", count: 235 },
  { key: "5", label: "Language", count: 5 },
  { key: "5", label: "Audio", count: 22 },
  { key: "5", label: "Enemies", count: 76 },
];
