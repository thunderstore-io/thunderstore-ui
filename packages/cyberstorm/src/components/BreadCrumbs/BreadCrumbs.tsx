import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { IndexLink } from "../Links/Links";
import { Icon } from "../Icon/Icon";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

export function BreadCrumbs(props: BreadCrumbsProps) {
  const children = React.Children.toArray(props.children);

  const nodes = children.map((node, index) => {
    const homifiedIndex = props.excludeHome ? index - 1 : index;
    const isLast = homifiedIndex == children.length - 1;
    return (
      <div
        key={homifiedIndex}
        className={`${homifiedIndex == -1 ? styles.outer__start : ""} ${
          styles.outer
        } ${isLast ? styles.outer__end : ""}`}
      >
        <div className={`${styles.inner} ${isLast ? styles.inner__end : ""}`}>
          {node}
        </div>
      </div>
    );
  });

  const home = (
    <div key={0} className={`${styles.outer__start} ${styles.outer}`}>
      <div className={`${styles.inner} ${styles.innerHome}`}>
        <DefaultHomeCrumb />
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      {props.excludeHome ? null : home}
      {nodes}
    </div>
  );
}

export function DefaultHomeCrumb() {
  return (
    <IndexLink>
      <Icon>
        <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
      </Icon>
    </IndexLink>
  );
}
