import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Dispatch, SetStateAction } from "react";

import styles from "./FilterMenu.module.css";
import { Icon } from "../../Icon/Icon";

interface Props {
  deprecated: boolean;
  setDeprecated: Dispatch<SetStateAction<boolean>>;
  nsfw: boolean;
  setNsfw: Dispatch<SetStateAction<boolean>>;
}

/**
 * Allow filtering packages by other attributes on PackageSearch.
 */
export const OthersMenu = (props: Props) => {
  const filters: [boolean, Dispatch<SetStateAction<boolean>>, string][] = [
    [props.nsfw, props.setNsfw, "NSFW"],
    [props.deprecated, props.setDeprecated, "Deprecated"],
  ];

  return (
    <div className={styles.root}>
      <h2 className={styles.header}>Other filters</h2>

      <ol className={styles.list}>
        {filters.map(([checked, setChecked, label]) => (
          <li key={label}>
            <label className={`${styles.label} ${checked && styles.include}`}>
              <Checkbox.Root
                checked={checked}
                onCheckedChange={() => setChecked(!checked)}
                className={styles.checkbox}
              >
                <Checkbox.Indicator>
                  <Icon>
                    <FontAwesomeIcon icon={faCheck} className={styles.icon} />
                  </Icon>
                </Checkbox.Indicator>
              </Checkbox.Root>
              {label}
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
};

OthersMenu.displayName = "OthersMenu";
