import "./EmptyState.css";
import { classnames } from "../../utils/utils";
import { NewIcon } from "../..";

interface Props {
  children: JSX.Element | JSX.Element[];
  iconClasses?: string;
  wrapperClasses?: string;
}

export function EmptyStateIcon(props: Props) {
  const { children, iconClasses, wrapperClasses } = props;
  return (
    <NewIcon
      wrapperClasses={classnames("ts-emptyState__icon", wrapperClasses)}
      rootClasses={iconClasses}
    >
      {children}
    </NewIcon>
  );
}

EmptyStateIcon.displayName = "EmptyStateIcon";
