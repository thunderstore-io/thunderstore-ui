import { memo, type PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./BreadCrumbs.css";
import { classnames, componentClasses } from "../../utils/utils";
import {
  NewIcon,
  NewLink,
  type NewCyberstormLinkProps,
  type NewLinkProps,
} from "../..";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import {
  type BreadCrumbsVariants,
  type BreadCrumbsSizes,
  type BreadCrumbsModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

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
        <NewIcon noWrapper csVariant="cyber">
          <FontAwesomeIcon icon={faHouse} className={"breadcrumbs__home"} />
        </NewIcon>
      </BreadCrumbsLink>
      {children}
    </Frame>
  );
});

export function BreadCrumbsLink(props: NewLinkProps | NewCyberstormLinkProps) {
  const { children, ...forwardedProps } = props;

  return (
    <NewLink {...forwardedProps} ref={props.ref}>
      <span>{children}</span>
    </NewLink>
  );
}

BreadCrumbsLink.displayName = "BreadCrumbsLink";
