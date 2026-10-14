import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Children,
  type PropsWithChildren,
  createContext,
  memo,
  useContext,
} from "react";

import { classnames } from "../../utils/utils";
import { Icon } from "../Icon/Icon";
import { type CyberstormLinkProps, Link, type LinkProps } from "../Link/Link";
import "./BreadCrumbs.css";

const BreadCrumbContext = createContext<{
  isCurrent: boolean;
  position: number;
}>({
  isCurrent: false,
  position: 1,
});

// https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#microdata
export const BreadCrumbs = memo(function BreadCrumbs(
  props: PropsWithChildren<{ rootClasses?: string }>
) {
  const { children, rootClasses } = props;
  // Callers pass arrays of crumbs and null for routes that do not apply.
  const crumbs = [
    <BreadCrumbsItem
      key="home"
      primitiveType="cyberstormLink"
      linkId="Index"
      tooltipText="Home"
      aria-label="Home"
      rootClasses="breadcrumbs__homelink"
    >
      <span className="breadcrumbs__home-name" itemProp="name">
        Home
      </span>
      <Icon noWrapper csVariant="cyber" csWidth="0.875rem" csHeight="0.875rem">
        <FontAwesomeIcon icon={faHouse} />
      </Icon>
    </BreadCrumbsItem>,
    ...Children.toArray(children),
  ];

  return (
    <nav
      className={classnames("breadcrumbs", rootClasses)}
      aria-label="Breadcrumb"
    >
      <ol
        className="breadcrumbs__list"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {crumbs.map((crumb, index) => (
          <BreadCrumbContext.Provider
            key={index}
            value={{
              isCurrent: index === crumbs.length - 1,
              position: index + 1,
            }}
          >
            {crumb}
          </BreadCrumbContext.Provider>
        ))}
      </ol>
    </nav>
  );
});

/**
 * One crumb. Link props (`primitiveType` plus an href or `linkId`) render a
 * link; without them the crumb is text, which is how the current page is shown.
 */
export function BreadCrumbsItem(
  props:
    | PropsWithChildren<{ rootClasses?: string }>
    | LinkProps
    | CyberstormLinkProps
) {
  const { isCurrent, position } = useContext(BreadCrumbContext);
  const current = isCurrent ? "page" : undefined;
  const content = (
    <span className="breadcrumbs__item-content">
      {Children.map(props.children, (child) => {
        if (typeof child !== "string") {
          return child;
        }
        if (child.trim() === "") {
          return null;
        }
        return (
          <span className="breadcrumbs__item-label" itemProp="name">
            {child}
          </span>
        );
      })}
    </span>
  );
  const segmentClass = classnames("breadcrumbs__segment", props.rootClasses);

  return (
    <li
      className="breadcrumbs__crumb"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
    >
      {"primitiveType" in props ? (
        <Link
          {...props}
          itemProp="item"
          aria-current={current}
          rootClasses={segmentClass}
        >
          {content}
        </Link>
      ) : (
        <span className={segmentClass} aria-current={current}>
          {content}
        </span>
      )}
      <meta itemProp="position" content={String(position)} />
    </li>
  );
}
