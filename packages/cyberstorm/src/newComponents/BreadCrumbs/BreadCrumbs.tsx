import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Children, type PropsWithChildren, type ReactNode, memo } from "react";

import { classnames } from "../../utils/utils";
import { Icon } from "../Icon/Icon";
import { type CyberstormLinkProps, Link, type LinkProps } from "../Link/Link";
import "./BreadCrumbs.css";

type BreadCrumbsProps = PropsWithChildren<{
  rootClasses?: string;
}>;

// TODO: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export const BreadCrumbs = memo(function BreadCrumbs(props: BreadCrumbsProps) {
  const { children, rootClasses } = props;

  return (
    <nav
      className={
        rootClasses ? classnames("breadcrumbs", rootClasses) : "breadcrumbs"
      }
      aria-label="Breadcrumb"
    >
      <BreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="Index"
        tooltipText="Home"
        aria-label="Home"
        rootClasses="breadcrumbs__homelink"
      >
        <Icon
          noWrapper
          csVariant="cyber"
          csWidth="0.875rem"
          csHeight="0.875rem"
        >
          <FontAwesomeIcon icon={faHouse} />
        </Icon>
      </BreadCrumbsLink>
      {children}
    </nav>
  );
});

function BreadCrumbsItemContent({ children }: PropsWithChildren) {
  return (
    <span className="breadcrumbs__item-content">
      {normalizeBreadCrumbsContent(children)}
    </span>
  );
}

function normalizeBreadCrumbsContent(children: ReactNode) {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      if (child.trim() === "") {
        return null;
      }
      return <span className="breadcrumbs__item-label">{child}</span>;
    }
    return child;
  });
}

export function BreadCrumbsLink(props: LinkProps | CyberstormLinkProps) {
  const { children, rootClasses, ...forwardedProps } = props;

  return (
    <Link
      {...forwardedProps}
      rootClasses={classnames("breadcrumbs__segment", rootClasses)}
    >
      <BreadCrumbsItemContent>{children}</BreadCrumbsItemContent>
    </Link>
  );
}

export function BreadCrumbsItem({ children }: PropsWithChildren) {
  return (
    <span className="breadcrumbs__segment">
      <BreadCrumbsItemContent>{children}</BreadCrumbsItemContent>
    </span>
  );
}
