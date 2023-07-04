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

  const [allValue, setAllValue] = useState<boolean | undefined>(undefined);
  function setAllValueWrapper(_label: string, value: boolean | undefined) {
    setAllValue(value);
  }

  useEffect(() => {
    const newFilterItems: {
      [key: string]: {
        label: string;
        value: boolean | undefined;
      };
    } = {};
    Object.keys(filterItems).forEach(function (key) {
      newFilterItems[key] = {
        label: filterItems[key].label,
        value: allValue,
      };
    });
    filterItemsSetter(newFilterItems);
  }, [allValue]);

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
    <div>
      <div className={styles.topActions}>
        <Button
          paddingSize="medium"
          fontSize="medium"
          label="Categories"
          colorScheme="transparentAccent"
          rightIcon={<FontAwesomeIcon icon={faCaretDown} fixedWidth />}
        />
        <Button
          paddingSize="medium"
          fontSize="medium"
          label="Clear all"
          colorScheme="transparentAccent"
        />
      </div>
      <div>
        <FilterItem
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
