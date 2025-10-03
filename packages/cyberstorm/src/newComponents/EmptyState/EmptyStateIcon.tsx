import "./EmptyState.css";
import { classnames } from "../../utils/utils";
import { NewIcon } from "../..";
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
