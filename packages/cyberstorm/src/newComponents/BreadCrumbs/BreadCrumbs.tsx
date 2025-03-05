import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BreadCrumbs.css";
import { classnames, componentClasses } from "../../utils/utils";
import { NewCyberstormLinkProps, NewIcon, NewLink, NewLinkProps } from "../..";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import {
  BreadCrumbsVariants,
  BreadCrumbsSizes,
  BreadCrumbsModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

type BreadCrumbsProps = PropsWithChildren<{
  rootClasses?: string;
  csVariant?: BreadCrumbsVariants;
  csSize?: BreadCrumbsSizes;
  csModifiers?: BreadCrumbsModifiers[];
}>;

// TODO: This component is not complete and probably is in need of redesign
// TODO: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export function BreadCrumbs(props: BreadCrumbsProps) {
  const {
    children,
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    csModifiers,
  } = props;

  return (
    <Frame
      primitiveType="window"
      rootClasses={classnames(
        "breadcrumbs",
        ...componentClasses("breadcrumbs", csVariant, csSize, csModifiers),
        rootClasses
      )}
    >
      <BreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="Index"
        tooltipText="Home"
        aria-label="Home"
        rootClasses={"breadcrumbs__homelink"}
      >
        <NewIcon noWrapper csVariant="cyber">
          <FontAwesomeIcon icon={faHouse} className={"breadcrumbs__home"} />
        </NewIcon>
      </BreadCrumbsLink>
      {children}
    </Frame>
  );
}

export const BreadCrumbsLink = React.forwardRef<
  HTMLAnchorElement,
  NewLinkProps | NewCyberstormLinkProps
>((props: NewLinkProps | NewCyberstormLinkProps, forwardedRef) => {
  const { children, ...forwardedProps } = props;

  return (
    <NewLink {...forwardedProps} ref={forwardedRef}>
      <span>{children}</span>
    </NewLink>
  );
});

BreadCrumbsLink.displayName = "BreadCrumbsLink";
