import styles from "./FilterItem.module.css";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../Icon/Icon";
import { CSSProperties } from "react";

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

  const filterColor = {
    "--filter-color": value ? "var(--color-highlight)" : "var(--color-danger)",
  } as CSSProperties;

  return (
    <label className={styles.root} htmlFor={"categoryCheckbox" + label}>
      <div className={styles.checkBoxContainer}>
        <Checkbox.Root
          id={"categoryCheckbox" + label}
          checked={value}
          onCheckedChange={() => {
            if (setChecked) {
              return setChecked(label, getNextValue(value));
            } else {
              return null;
            }
          }}
          className={styles.checkBoxRoot}
          style={value !== undefined ? filterColor : {}}
        >
          <Checkbox.Indicator forceMount>
            {value === undefined && <></>}
            {value === true && (
              <Icon>
                <FontAwesomeIcon className={styles.icon} icon={faCheck} />
              </Icon>
            )}
            {value === false && (
              <Icon>
                <FontAwesomeIcon className={styles.icon} icon={faXmark} />
              </Icon>
            )}
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span
          className={styles.label}
          style={value !== undefined ? filterColor : {}}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      </div>
    </label>
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
