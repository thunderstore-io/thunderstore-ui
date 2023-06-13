import styles from "./FilterItem.module.css";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
// import { Tag } from "../../Tag/Tag";

export interface FilterItemProps {
  label: string;
  // count: number;
  value?: boolean;
  setChecked?: (label: string, value: boolean | undefined) => void;
}

// TODO: Count is disabled, because we don't have a plan yet,
// how we want to calculate the count and where.
// There is a separate task about this. TS-1715.

/**
 * Cyberstorm FilterItem
 */
export function FilterItem(props: FilterItemProps) {
  const { label, value = undefined, setChecked } = props;
  return (
    <div className={styles.root}>
      <div className={styles.checkBoxContainer}>
        <Checkbox.Root
          id={"categoryCheckbox" + label}
          checked={value}
          onCheckedChange={() => {
            if (setChecked) {
              console.log(value);
              return setChecked(label, getNextValue(value));
            } else {
              return null;
            }
          }}
          className={`${styles.checkBoxRoot} ${getStyle(value)}`}
        >
          <Checkbox.Indicator>
            {value === undefined && <></>}
            {value === true && (
              <FontAwesomeIcon className={styles.icon} icon={faCheck} />
            )}
            {value === false && (
              <FontAwesomeIcon className={styles.icon} icon={faXmark} />
            )}
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label
          className={`${styles.label} ${getStyle(value)}`}
          htmlFor={"categoryCheckbox" + label}
        >
          {label}
        </label>
      </div>
      {/* <div className={styles.tag}>
        <Tag size="tiny" colorScheme="simple" label={count.toString()} />
      </div> */}
    </div>
  );
}

FilterItem.displayName = "FilterItem";

function getNextValue(value: boolean | undefined): boolean | undefined {
  if (value !== undefined) {
    if (value === true) {
      return false;
    } else {
      return undefined;
    }
  } else {
    return true;
  }
}

const getStyle = (checked: boolean | undefined) => {
  if (checked === undefined) {
    return null;
  }
  return checked ? styles.yes : styles.no;
};
