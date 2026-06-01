import type { ReactNode } from "react";

import { classnames } from "@thunderstore/cyberstorm";

import "./FormSection.css";

export interface FormSectionsProps {
  children: ReactNode;
  rootClasses?: string;
}

export function FormSections({ children, rootClasses }: FormSectionsProps) {
  return (
    <div className={classnames("form-sections", rootClasses)}>{children}</div>
  );
}

export interface FormSectionProps {
  title: string;
  description?: ReactNode;
  metaExtra?: ReactNode;
  children: ReactNode;
  rootClasses?: string;
}

export function FormSection({
  title,
  description,
  metaExtra,
  children,
  rootClasses,
}: FormSectionProps) {
  return (
    <div className={classnames("form-section", rootClasses)}>
      <div className="form-section__meta">
        <p className="form-section__title">{title}</p>
        {description ? (
          <div className="form-section__description">{description}</div>
        ) : null}
        {metaExtra}
      </div>
      <div className="form-section__content">{children}</div>
    </div>
  );
}

export function FormSectionSeparator() {
  return <div className="form-section__separator" role="separator" />;
}

export interface FormSectionIslandProps {
  children: ReactNode;
  rootClasses?: string;
}

export function FormSectionIsland({
  children,
  rootClasses,
}: FormSectionIslandProps) {
  return (
    <div className={classnames("form-section__island", rootClasses)}>
      {children}
    </div>
  );
}
