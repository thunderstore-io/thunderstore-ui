import styles from "./FilterItemList.module.css";
import { FilterItem } from "./FilterItem/FilterItem";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";

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
export function FilterItemList(props: FilterItemListProps) {
  const { filterData = [] } = props;
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
        <FilterItem count={327} checkBoxId="all" label="All" />
      </div>
      <div className={styles.line}></div>
      {filters}
    </div>
  );
}

FilterItemList.displayName = "FilterItemList";
