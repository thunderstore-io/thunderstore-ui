import { type PropsWithChildren, type ReactElement, memo } from "react";

import { Heading, Image, classnames } from "@thunderstore/cyberstorm";
import type { HeadingSizes } from "@thunderstore/cyberstorm-theme";

import "./PageHeader.css";

export interface PageHeaderProps extends PropsWithChildren {
  image?: string | null;
  icon?: string | null;
  headingSize: HeadingSizes;
  headingLevel: "1" | "2" | "3" | "4" | "5" | "6";
  description?: string | null;
  meta?: ReactElement;
  variant?: "simple" | "detailed";
}

export const PageHeader = memo(function PageHeader(props: PageHeaderProps) {
  const {
    children,
    headingSize,
    headingLevel,
    description = null,
    image = null,
    icon = null,
    meta,
    variant = "simple",
  } = props;

  return (
    <header
      className={classnames(
        "page-header",
        variant === "detailed" ? "page-header--detailed" : "page-header--simple"
      )}
    >
      {image ? (
        <Image
          src={image}
          square
          cardType="community"
          intrinsicWidth={96}
          intrinsicHeight={96}
          rootClasses="page-header__image"
        />
      ) : null}
      {icon ? (
        <Image
          src={icon}
          square
          cardType="community"
          intrinsicWidth={56}
          intrinsicHeight={56}
          rootClasses="page-header__icon"
        />
      ) : null}
      <div
        className={
          variant === "detailed"
            ? "page-header__content-detailed"
            : "page-header__content-simple"
        }
      >
        <div className="page-header__info">
          <Heading
            csLevel={headingLevel}
            csSize={headingSize}
            csVariant="primary"
            mode="display"
            rootClasses="page-header__heading"
          >
            {children}
          </Heading>
          {description ? (
            <span className="page-header__description">{description}</span>
          ) : null}
        </div>
        {meta ? <div className="page-header__meta">{meta}</div> : null}
      </div>
    </header>
  );
});

PageHeader.displayName = "PageHeader";
