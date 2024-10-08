import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Dispatch, SetStateAction } from "react";

import styles from "./FilterMenu.module.css";
import { Icon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

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
    <ol className={styles.list}>
      {filters.map(([checked, setChecked, label]) => (
        <li key={label}>
          <label
            className={classnames(
              styles.label,
              checked ? styles.include : null
            )}
          >
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
  );
};

OthersMenu.displayName = "OthersMenu";
