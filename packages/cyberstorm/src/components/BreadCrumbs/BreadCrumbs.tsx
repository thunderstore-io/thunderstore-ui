import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { CyberstormLink } from "../Links/Links";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { Tooltip } from "../Tooltip/Tooltip";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

// TODO: Bug: when excludeHome is true, last element's style is wrong
export function BreadCrumbs(props: BreadCrumbsProps) {
  const children = React.Children.toArray(props.children);

  const nodes = children.map((node, index) => {
    const homifiedIndex = props.excludeHome ? index - 1 : index;
    const isLast = homifiedIndex == children.length - 1;
    return (
      <div
        key={homifiedIndex}
        className={classnames(
          homifiedIndex == -1 ? styles.outer__start : null,
          styles.outer,
          isLast ? styles.outer__end : null
        )}
      >
        <div
          className={classnames(
            styles.inner,
            isLast ? styles.inner__end : null
          )}
        >
          {node}
        </div>
      </div>
    );
  });

  const home = (
    <div
      key={0}
      className={classnames(
        styles.outer__start,
        styles.outer,
        styles.outerHome
      )}
    >
      <div className={classnames(styles.inner, styles.innerHome)}>
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
    <Tooltip content={"Home"} side="bottom">
      <CyberstormLink linkId="Index">
        <Icon>
          <FontAwesomeIcon icon={faHouse} className={styles.home} />
        </Icon>
      </CyberstormLink>
    </Tooltip>
  );
}
