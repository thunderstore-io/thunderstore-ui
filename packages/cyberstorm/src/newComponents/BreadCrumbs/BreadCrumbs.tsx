import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type PropsWithChildren, memo } from "react";

import {
  type BreadCrumbsModifiers,
  type BreadCrumbsSizes,
  type BreadCrumbsVariants,
} from "@thunderstore/cyberstorm-theme";

import { Frame } from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon } from "../Icon/Icon";
import { type CyberstormLinkProps, Link, type LinkProps } from "../Link/Link";
import "./BreadCrumbs.css";

type BreadCrumbsProps = PropsWithChildren<{
  rootClasses?: string;
  csVariant?: BreadCrumbsVariants;
  csSize?: BreadCrumbsSizes;
  csModifiers?: BreadCrumbsModifiers[];
}>;

// TODO: This component is not complete and probably is in need of redesign
// TODO: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export const BreadCrumbs = memo(function BreadCrumbs(props: BreadCrumbsProps) {
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
        <Icon noWrapper csVariant="cyber">
          <FontAwesomeIcon icon={faHouse} className={"breadcrumbs__home"} />
        </Icon>
      </BreadCrumbsLink>
      {children}
    </Frame>
  );
});

export function BreadCrumbsLink(props: LinkProps | CyberstormLinkProps) {
  const { children, ...forwardedProps } = props;

  return (
    <Link {...forwardedProps} ref={props.ref}>
      <span>{children}</span>
    </Link>
  );
}

BreadCrumbsLink.displayName = "BreadCrumbsLink";
