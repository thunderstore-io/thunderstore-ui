import type { ReactNode } from "react";

import { Heading, classnames } from "@thunderstore/cyberstorm";

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
    <section className={classnames("form-section", rootClasses)}>
      <header className="form-section__header">
        <div className="form-section__header-texts">
          <Heading csLevel="3" csVariant="primary">
            {title}
          </Heading>
          {description ? (
            <div className="form-section__description">{description}</div>
          ) : null}
        </div>
        {metaExtra}
      </header>
      <div className="form-section__content">{children}</div>
    </section>
  );
}

export function FormSectionSeparator() {
  return <div className="form-section__separator" role="separator" />;
}
