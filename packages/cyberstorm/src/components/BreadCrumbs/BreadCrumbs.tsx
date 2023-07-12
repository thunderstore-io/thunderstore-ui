import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { IndexLink } from "../Links/Links";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

export function BreadCrumbs(props: BreadCrumbsProps) {
  const children = React.Children.toArray(props.children);
  if (!props.excludeHome) {
    children.unshift(<DefaultHomeCrumb />);
  }

  const nodes = children.map((node, index) => {
    const isLast = index == children.length - 1;
    return (
      <div
        key={index}
        className={`${index == 0 ? styles.outer__start : ""} ${styles.outer} ${
          isLast ? styles.outer__end : ""
        }`}
      >
        <div className={`${styles.inner} ${isLast ? styles.inner__end : ""}`}>
          {node}
        </div>
      </div>
    );
  });

  return <div className={styles.root}>{nodes}</div>;
}

export function DefaultHomeCrumb() {
  return (
    <IndexLink>
      <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
    </IndexLink>
  );
}
