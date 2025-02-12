import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BreadCrumbs.css";
import { classnames, componentClasses } from "../../utils/utils";
import { NewIcon, NewLink } from "../..";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import {
  BreadCrumbsVariants,
  BreadCrumbsSizes,
  BreadCrumbsModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
  rootClasses?: string;
  csVariant?: BreadCrumbsVariants;
  csSize?: BreadCrumbsSizes;
  csModifiers?: BreadCrumbsModifiers[];
}>;

// TODO: This component is not complete and probably is in need of redesign
// TODO: Bug: when excludeHome is true, last element's style is wrong
// TODO: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export function BreadCrumbs(props: BreadCrumbsProps) {
  const {
    children,
    excludeHome,
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    csModifiers,
  } = props;
  const childrenArray = React.Children.toArray(children);

  const nodes = childrenArray.map((node, index) => {
    const homifiedIndex = excludeHome ? index - 1 : index;
    const isLast = homifiedIndex == childrenArray.length - 1;
    return (
      <Frame
        key={homifiedIndex}
        primitiveType="window"
        rootClasses={classnames(
          homifiedIndex == -1 ? "breadcrumbs__outerstart" : null,
          "breadcrumbs__outer",
          ...componentClasses(
            "breadcrumbs__outer",
            csVariant,
            csSize,
            csModifiers
          ),
          isLast ? "breadcrumbs__outerend" : null,
          ...(isLast
            ? componentClasses(
                "breadcrumbs__outerend",
                csVariant,
                csSize,
                csModifiers
              )
            : [])
        )}
      >
        <Frame
          primitiveType="window"
          rootClasses={classnames(
            "breadcrumbs__inner",
            ...componentClasses(
              "breadcrumbs__inner",
              csVariant,
              csSize,
              csModifiers
            ),
            isLast ? "breadcrumbs__innerend" : null,
            ...(isLast
              ? componentClasses(
                  "breadcrumbs__innerend",
                  csVariant,
                  csSize,
                  csModifiers
                )
              : [])
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
        "breadcrumbs__outerstart",
        "breadcrumbs__outer",
        "breadcrumbs__outerhome",
        ...componentClasses(
          "breadcrumbs__outer",
          csVariant,
          csSize,
          csModifiers
        )
      )}
    >
      <div
        className={classnames("breadcrumbs__inner", "breadcrumbs__innerhome")}
      >
        <DefaultHomeCrumb />
      </div>
    </Frame>
  );

  return (
    <Frame
      primitiveType="window"
      rootClasses={classnames("breadcrumbs", rootClasses)}
    >
      {excludeHome ? null : home}
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
      aria-label="Home"
      rootClasses={"breadcrumbs__homelink"}
    >
      <NewIcon noWrapper csVariant="cyber">
        <FontAwesomeIcon icon={faHouse} className={"breadcrumbs__home"} />
      </NewIcon>
    </NewLink>
  );
}
