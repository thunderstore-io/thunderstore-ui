import styles from "./DropDownLink.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "../Icon/Icon";

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
        <Icon inline iconClasses={styles.arrowUpRightIcon}>
          <FontAwesomeIcon icon={faArrowUpRight} />
        </Icon>
      ) : null}
    </div>
  );
}

DropDownLink.displayName = "DropDownLink";
