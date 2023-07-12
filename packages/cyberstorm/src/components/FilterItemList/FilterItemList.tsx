import styles from "./FilterItemList.module.css";
import { FilterItem } from "./FilterItem/FilterItem";
import { ReactNode } from "react";

export interface FilterItemListProps {
  filterItems: {
    [key: string]: {
      label: string;
      value: boolean | undefined;
    };
  };
  filterItemsSetter: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        label: string;
        value: boolean | undefined;
      };
    }>
  >;
}

/**
 * Cyberstorm FilterItemList
 */
export function FilterItemList(props: FilterItemListProps) {
  const { filterItems, filterItemsSetter } = props;

  const handleSingleCheck = (label: string, value: boolean | undefined) => {
    const newFilterItems: {
      [key: string]: {
        label: string;
        value: boolean | undefined;
      };
    } = {};
    Object.keys(filterItems).forEach(function (key) {
      if (key === label) {
        newFilterItems[key] = {
          label: filterItems[key].label,
          value: value,
        };
      } else {
        newFilterItems[key] = {
          label: filterItems[key].label,
          value: filterItems[key].value,
        };
      }
    });
    filterItemsSetter(newFilterItems);
  };

  const filters: ReactNode[] = [];
  Object.keys(filterItems).forEach(function (key, index) {
    filters.push(
      <div key={index}>
        <FilterItem
          label={key}
          value={filterItems[key].value}
          setChecked={handleSingleCheck}
        />
      </div>
    );
  });

  return (
    <>
      <div className={styles.filterListHeader}>Categories</div>
      {filters}
    </>
  );
}

FilterItemList.displayName = "FilterItemList";
