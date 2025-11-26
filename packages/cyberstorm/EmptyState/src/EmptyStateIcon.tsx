import "./EmptyState.css";
import { classnames } from "@thunderstore/cyberstorm-utils";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode | ReactNode[];
  iconClasses?: string;
  wrapperClasses?: string;
}

export function EmptyStateIcon(props: Props) {
  const { children, iconClasses, wrapperClasses } = props;
  return (
    <NewIcon
      wrapperClasses={classnames("empty-state__icon", wrapperClasses)}
      rootClasses={iconClasses}
    >
      {children}
    </NewIcon>
  );
}

EmptyStateIcon.displayName = "EmptyStateIcon";
