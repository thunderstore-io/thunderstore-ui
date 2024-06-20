import { PropsWithChildren } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CollapsibleMenu.module.css";
import { Icon } from "@thunderstore/cyberstorm";

interface Props extends PropsWithChildren {
  headerTitle: string;
  defaultOpen?: boolean;
}

/**
 * Wrapper for making a menu collapsible
 */
export const CollapsibleMenu = (props: Props) => {
  const { headerTitle, defaultOpen, children } = props;

  return (
    <details className={styles.root} open={defaultOpen}>
      <summary className={styles.header}>
        {headerTitle}
        <Icon inline>
          <FontAwesomeIcon icon={faCaretDown} />
        </Icon>
      </summary>
      {children}
    </details>
  );
};

CollapsibleMenu.displayName = "CollapsibleMenu";
