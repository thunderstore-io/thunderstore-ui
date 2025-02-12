import { PropsWithChildren } from "react";
import "./EmptyState.css";
import { classnames } from "../../utils/utils";

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
