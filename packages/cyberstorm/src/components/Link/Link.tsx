import styles from "./Link.module.css";
import { ReactElement } from "react";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface LinkProps {
  label: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  externalUrl?: string;
  size?: "thin" | "bold";
}

/**
 * Cyberstorm Link component
 */
export function Link(props: LinkProps) {
  const {
    label,
    leftIcon = null,
    rightIcon = null,
    externalUrl = null,
    size = "thin",
  } = props;

  if (externalUrl) {
    return (
      <a href={externalUrl} className={classnames(styles.root, getSize(size))}>
        {leftIcon ? (
          <Icon wrapperClasses={styles.leftIcon}>{leftIcon}</Icon>
        ) : null}
        {label}
        <Icon wrapperClasses={styles.rightIcon}>
          <FontAwesomeIcon icon={faArrowUpRight} />
        </Icon>
      </a>
    );
  } else {
    return (
      <div className={styles.root}>
        {leftIcon ? (
          <Icon wrapperClasses={styles.leftIcon}>{leftIcon}</Icon>
        ) : null}
        {label}
        {rightIcon ? (
          <Icon wrapperClasses={styles.rightIcon}>{rightIcon}</Icon>
        ) : null}
      </div>
    );
  }
}

Link.displayName = "Link";

const getSize = (scheme: LinkProps["size"] = "thin") => {
  return {
    thin: styles.link__thin,
    bold: styles.link__bold,
  }[scheme];
};
