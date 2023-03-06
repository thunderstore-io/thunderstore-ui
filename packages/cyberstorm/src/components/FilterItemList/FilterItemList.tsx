import React from "react";
import styles from "./FilterItemList.module.css";
import { FilterItem } from "../FilterItem/FilterItem";

interface FilterDataItem {
  key: string;
  label: string;
  count: number;
}
export interface FilterItemListProps {
  filterData?: Array<FilterDataItem>;
}

/**
 * Cyberstorm FilterItemList
 */
export const FilterItemList: React.FC<FilterItemListProps> = (props) => {
  const { filterData } = props;
  const filters = filterData?.map((filter) => {
    return (
      <div key={filter.key}>
        <FilterItem
          count={filter.count}
          checkBoxId={filter.key}
          label={filter.label}
        />
      </div>
    );
  });

  return (
    <div>
      <div>
        <FilterItem count={327} checkBoxId="all" label="All" />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
};

FilterItemList.displayName = "FilterItemList";
FilterItemList.defaultProps = { filterData: [] };
