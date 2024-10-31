import styles from "./DropDownLink.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { NewIcon } from "../..";

export interface DropDownLinkProps {
  label: string;
  leftIcon?: ReactElement;
  isExternal?: boolean;
}

/**
 * Cyberstorm DropDownLink component
 */
export function DropDownLink(props: DropDownLinkProps) {
  const { label, leftIcon, isExternal = false } = props;
  return (
    <div className={styles.root}>
      <div className={styles.label}>
        {leftIcon ? <div className={styles.icon}>{leftIcon}</div> : null}
        {label}
      </div>
      {isExternal ? (
        <NewIcon
          csMode="inline"
          noWrapper
          csVariant="secondary"
          rootClasses={styles.arrowUpRightIcon}
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </NewIcon>
      ) : null}
    </div>
  );
}

DropDownLink.displayName = "DropDownLink";
