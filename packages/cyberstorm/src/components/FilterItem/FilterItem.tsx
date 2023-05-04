import styles from "../FilterItem/FilterItem.module.css";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Tag } from "../Tag/Tag";

export interface FilterItemProps {
  label: string;
  count: number;
  checkBoxId: string;
}

/**
 * Cyberstorm BackgroundImage
 */
export function FilterItem(props: FilterItemProps) {
  const { label, count, checkBoxId } = props;

  const [checked, setChecked] = React.useState<boolean | undefined>(undefined);

  return (
    <div className={styles.root}>
      <div className={styles.checkBoxContainer}>
        <Checkbox.Root
          id={checkBoxId}
          checked={checked}
          onCheckedChange={() => setChecked(getNextValue(checked))}
          className={`${styles.checkBoxRoot} ${getStyle(checked)}`}
        >
          {<FontAwesomeIcon className={styles.icon} icon={getIcon(checked)} />}
        </Checkbox.Root>
        <label
          className={`${styles.label} ${getStyle(checked)}`}
          htmlFor={checkBoxId}
        >
          {label}
        </label>
      </div>
      <div className={styles.tag}>
        <Tag size="tiny" colorScheme="simple" label={count.toString()} />
      </div>
    </div>
  );
}

FilterItem.displayName = "FilterItem";
FilterItem.defaultProps = {};

function getNextValue(checked: boolean | undefined): boolean | undefined {
  if (checked === undefined) {
    return true;
  }
  return checked ? false : undefined;
}

const getStyle = (checked: boolean | undefined) => {
  if (checked === undefined) {
    return null;
  }
  return checked ? styles.yes : styles.no;
};

const getIcon = (checked: boolean | undefined) => {
  if (checked === undefined) {
    return faMinus;
  }
  return checked ? faCheck : faXmark;
};
