import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Checkbox from "@radix-ui/react-checkbox";

import styles from "./FilterMenu.module.css";
import { NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

interface Props {
  deprecated: boolean;
  setDeprecated: (v: boolean) => void;
  nsfw: boolean;
  setNsfw: (v: boolean) => void;
}

/**
 * Allow filtering packages by other attributes on PackageSearch.
 */
export const OthersMenu = (props: Props) => {
  const filters: [boolean, (v: boolean) => void, string][] = [
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
              checked ? styles.include : styles.off
            )}
          >
            {label}
            <Checkbox.Root
              checked={checked}
              onCheckedChange={() => setChecked(!checked)}
              className={styles.checkbox}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={checked ? faSquareCheck : faSquare} />
              </NewIcon>
            </Checkbox.Root>
          </label>
        </li>
      ))}
    </ol>
  );
};

OthersMenu.displayName = "OthersMenu";
