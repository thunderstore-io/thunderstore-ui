import { type PropsWithChildren } from "react";

import { classnames } from "../../utils/utils";
import "./EmptyState.css";

interface Props extends PropsWithChildren {
  className?: string;
}

export function EmptyStateTitle(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames("empty-state__title", className)}>
      {children}
    </span>
  );
}

EmptyStateTitle.displayName = "EmptyStateTitle";
