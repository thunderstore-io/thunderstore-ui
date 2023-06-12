import styles from "./FilterItemList.module.css";
import { FilterItem } from "./FilterItem/FilterItem";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { ReactNode, useEffect, useState } from "react";

export interface FilterItemListProps {
  filterItems: {
    [key: string]: {
      label: string;
      count: number;
      value: boolean | undefined;
    };
  };
  filterItemsSetter: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        label: string;
        count: number;
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

  const [allCount, setAllCount] = useState<number>(0);
  const [allValue, setAllValue] = useState<boolean | undefined>(undefined);
  function setAllValueWrapper(_label: string, value: boolean | undefined) {
    setAllValue(value);
  }

  useEffect(() => {
    let newAllCount = 0;
    Object.keys(filterItems).forEach(function (key) {
      newAllCount = +filterItems[key].count;
    });
    setAllCount(newAllCount);
  }, [filterItems]);

  useEffect(() => {
    const newFilterItems: {
      [key: string]: {
        label: string;
        count: number;
        value: boolean | undefined;
      };
    } = {};
    Object.keys(filterItems).forEach(function (key) {
      newFilterItems[key] = {
        label: filterItems[key].label,
        count: filterItems[key].count,
        value: allValue,
      };
    });
    filterItemsSetter(newFilterItems);
  }, [allValue]);

  const handleSingleCheck = (label: string, value: boolean | undefined) => {
    const newFilterItems: {
      [key: string]: {
        label: string;
        count: number;
        value: boolean | undefined;
      };
    } = {};
    Object.keys(filterItems).forEach(function (key) {
      if (key === label) {
        newFilterItems[key] = {
          label: filterItems[key].label,
          count: filterItems[key].count,
          value: value,
        };
      } else {
        newFilterItems[key] = {
          label: filterItems[key].label,
          count: filterItems[key].count,
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
          count={filterItems[key].count}
          value={filterItems[key].value}
          setChecked={handleSingleCheck}
        />
      </div>
    );
  });

  return (
    <div>
      <div className={styles.topActions}>
        <Button
          size="small"
          label="Categories"
          colorScheme="transparentTertiary"
          rightIcon={<FontAwesomeIcon icon={faCaretDown} fixedWidth />}
        />
        <Button
          size="small"
          label="Clear all"
          colorScheme="transparentTertiary"
        />
      </div>
      <div>
        <FilterItem
          count={allCount}
          label="All"
          value={allValue}
          setChecked={setAllValueWrapper}
        />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
}

FilterItemList.displayName = "FilterItemList";
