import React from "react";
import styles from "./DropDownLink.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export interface DropDownLinkProps {
  label: string;
  isExternal?: boolean;
}

/**
 * Cyberstorm DropDownLink component
 */
export const DropDownLink: React.FC<DropDownLinkProps> = (props) => {
  const { label, isExternal } = props;
  return (
    <div className={styles.root}>
      <>{label}</>
      {isExternal ? <FontAwesomeIcon icon={faArrowRight} fixedWidth /> : null}
    </div>
  );
};

DropDownLink.displayName = "DropDownLink";
DropDownLink.defaultProps = { isExternal: false };
