import styles from "./EmptyState.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

interface Props {
  children: JSX.Element | JSX.Element[];
  iconClasses?: string;
  wrapperClasses?: string;
}

export function EmptyStateIcon(props: Props) {
  const { children, iconClasses, wrapperClasses } = props;
  return (
    <Icon
      wrapperClasses={classnames(styles.icon, wrapperClasses)}
      iconClasses={iconClasses}
    >
      {children}
    </Icon>
  );
}

EmptyStateIcon.displayName = "EmptyStateIcon";
