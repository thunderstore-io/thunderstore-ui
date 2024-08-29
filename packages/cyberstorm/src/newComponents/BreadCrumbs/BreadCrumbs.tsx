import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { classnames } from "../../utils/utils";
import { NewIcon, NewLink } from "../..";
import { Frame } from "../../primitiveComponents/Frame/Frame";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
  rootClasses?: string;
}>;

// TODO: This component is not complete and probably is in need of redesign
// TODO: Bug: when excludeHome is true, last element's style is wrong
export function BreadCrumbs(props: BreadCrumbsProps) {
  const children = React.Children.toArray(props.children);

  const nodes = children.map((node, index) => {
    const homifiedIndex = props.excludeHome ? index - 1 : index;
    const isLast = homifiedIndex == children.length - 1;
    return (
      <Frame
        key={homifiedIndex}
        primitiveType="window"
        rootClasses={classnames(
          homifiedIndex == -1 ? styles.outer__start : null,
          styles.outer,
          isLast ? styles.outer__end : null
        )}
      >
        <Frame
          primitiveType="window"
          rootClasses={classnames(
            styles.inner,
            isLast ? styles.inner__end : null
          )}
        >
          {node}
        </Frame>
      </Frame>
    );
  });

  const home = (
    <Frame
      key={0}
      primitiveType="window"
      rootClasses={classnames(
        styles.outer__start,
        styles.outer,
        styles.outerHome
      )}
    >
      <div className={classnames(styles.inner, styles.innerHome)}>
        <DefaultHomeCrumb />
      </div>
    </Frame>
  );

  return (
    <Frame
      primitiveType="window"
      rootClasses={classnames(styles.root, props.rootClasses)}
      csColor="surface"
      csVariant="default"
      csTextStyles={["fontWeightMedium", "fontSizeXS", "lineHeightAuto"]}
    >
      {props.excludeHome ? null : home}
      {nodes}
    </Frame>
  );
}

export function DefaultHomeCrumb() {
  return (
    <NewLink
      primitiveType="cyberstormLink"
      linkId="Index"
      tooltipText="Home"
      csTextStyles={["fontSizeS", "fontWeightRegular"]}
      aria-label="Home"
    >
      <NewIcon noWrapper csColor="cyber-green" csVariant="default">
        <FontAwesomeIcon icon={faHouse} className={styles.home} />
      </NewIcon>
    </NewLink>
  );
}
