import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./FilterMenu.module.css";
import { CycleButton, NewIcon } from "@thunderstore/cyberstorm";
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
            <CycleButton
              onInteract={() => setChecked(!checked)}
              rootClasses={styles.checkbox}
              value={checked ? "on" : "off"}
              noState
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={checked ? faSquareCheck : faSquare} />
              </NewIcon>
            </CycleButton>
          </label>
        </li>
      ))}
    </ol>
  );
};

OthersMenu.displayName = "OthersMenu";
