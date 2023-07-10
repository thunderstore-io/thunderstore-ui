import styles from "./Link.module.css";
import { ReactElement } from "react";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <a href={externalUrl} className={`${styles.root} ${getSize(size)}`}>
        {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
        {label}
        <div className={styles.rightIcon}>
          <FontAwesomeIcon icon={faArrowUpRight} fixedWidth />
        </div>
      </a>
    );
  } else {
    return (
      <div className={styles.root}>
        {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
        {label}
        {rightIcon ? <div className={styles.rightIcon}>{rightIcon}</div> : null}
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
