import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Children,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  isValidElement,
  memo,
  useContext,
} from "react";

import { classnames } from "../../utils/utils";
import { Icon } from "../Icon/Icon";
import { type CyberstormLinkProps, Link, type LinkProps } from "../Link/Link";
import "./BreadCrumbs.css";

type BreadCrumbsProps = PropsWithChildren<{
  rootClasses?: string;
}>;

type BreadCrumbState = {
  isCurrent: boolean;
  position: number;
};

const BreadCrumbContext = createContext<BreadCrumbState>({
  isCurrent: false,
  position: 1,
});

// https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export const BreadCrumbs = memo(function BreadCrumbs(props: BreadCrumbsProps) {
  const { children, rootClasses } = props;
  const crumbs = Children.toArray(children);

  return (
    <nav
      className={
        rootClasses ? classnames("breadcrumbs", rootClasses) : "breadcrumbs"
      }
      aria-label="Breadcrumb"
    >
      <ol
        className="breadcrumbs__list"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <BreadCrumbContext.Provider
          value={{ isCurrent: crumbs.length === 0, position: 1 }}
        >
          <BreadCrumbsLink
            primitiveType="cyberstormLink"
            linkId="Index"
            tooltipText="Home"
            aria-label="Home"
            rootClasses="breadcrumbs__homelink"
          >
            <span className="breadcrumbs__home-name" itemProp="name">
              Home
            </span>
            <Icon
              noWrapper
              csVariant="cyber"
              csWidth="0.875rem"
              csHeight="0.875rem"
            >
              <FontAwesomeIcon icon={faHouse} />
            </Icon>
          </BreadCrumbsLink>
        </BreadCrumbContext.Provider>
        {crumbs.map((crumb, index) => (
          <BreadCrumbContext.Provider
            key={isValidElement(crumb) ? crumb.key : index}
            value={{
              isCurrent: index === crumbs.length - 1,
              position: index + 2,
            }}
          >
            {crumb}
          </BreadCrumbContext.Provider>
        ))}
      </ol>
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
      return (
        <span className="breadcrumbs__item-label" itemProp="name">
          {child}
        </span>
      );
    }
    return child;
  });
}

function BreadCrumbListItem({ children }: PropsWithChildren) {
  const { position } = useContext(BreadCrumbContext);

  return (
    <li
      className="breadcrumbs__crumb"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
    >
      {children}
      <meta itemProp="position" content={String(position)} />
    </li>
  );
}

export function BreadCrumbsLink(props: LinkProps | CyberstormLinkProps) {
  const { children, rootClasses, ...forwardedProps } = props;
  const { isCurrent } = useContext(BreadCrumbContext);

  return (
    <BreadCrumbListItem>
      <Link
        {...forwardedProps}
        itemProp="item"
        aria-current={isCurrent ? "page" : undefined}
        rootClasses={classnames("breadcrumbs__segment", rootClasses)}
      >
        <BreadCrumbsItemContent>{children}</BreadCrumbsItemContent>
      </Link>
    </BreadCrumbListItem>
  );
}

export function BreadCrumbsItem({ children }: PropsWithChildren) {
  const { isCurrent } = useContext(BreadCrumbContext);

  return (
    <BreadCrumbListItem>
      <span
        className="breadcrumbs__segment"
        aria-current={isCurrent ? "page" : undefined}
      >
        <BreadCrumbsItemContent>{children}</BreadCrumbsItemContent>
      </span>
    </BreadCrumbListItem>
  );
}
