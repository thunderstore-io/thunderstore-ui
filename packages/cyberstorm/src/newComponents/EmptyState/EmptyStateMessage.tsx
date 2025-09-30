import { type PropsWithChildren } from "react";
import "./EmptyState.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export function EmptyStateMessage(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames("empty-state__message", className)}>
      {children}
    </span>
  );
}

EmptyStateMessage.displayName = "EmptyStateMessage";
