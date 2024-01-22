import { PropsWithChildren } from "react";
import styles from "./EmptyState.module.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export function EmptyStateMessage(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.message, className)}>{children}</span>
  );
}

EmptyStateMessage.displayName = "EmptyStateMessage";
