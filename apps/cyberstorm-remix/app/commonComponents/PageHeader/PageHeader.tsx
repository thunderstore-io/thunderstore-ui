import { Heading } from "@thunderstore/cyberstorm";
import "./PageHeader.css";
import { ReactElement } from "react";
import { CollapsibleText } from "../CollapsibleText/CollapsibleText";
import { HeadingSizes } from "@thunderstore/cyberstorm-theme/src/components";

export interface PageHeaderProps {
  image?: ReactElement;
  heading: string;
  headingSize: HeadingSizes;
  headingLevel: "1" | "2" | "3" | "4" | "5" | "6";
  description?: string | null;
  meta?: ReactElement;
}

export function PageHeader(props: PageHeaderProps) {
  const {
    heading,
    headingSize,
    headingLevel,
    description = null,
    image = null,
    meta,
  } = props;

  return (
    <header className="nimbus-commoncomponents-page-header">
      {image ? (
        <div className="nimbus-commoncomponents-page-header__image nimbus-hide-s">
          {image}
        </div>
      ) : null}
      <div className="nimbus-commoncomponents-page-header__content">
        <div className="nimbus-commoncomponents-page-header__info">
          <Heading
            csLevel={headingLevel}
            csSize={headingSize}
            csVariant="primary"
            mode="display"
          >
            {heading}
          </Heading>
          {description ? (
            <CollapsibleText text={description} maxLength={85} />
          ) : null}
        </div>
        {meta ? (
          <div className="nimbus-commoncomponents-page-header__meta">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
}

PageHeader.displayName = "PageHeader";
