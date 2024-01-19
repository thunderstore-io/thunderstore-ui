import { PropsWithChildren } from "react";
import styles from "./EmptyState.module.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export function EmptyStateTitle(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.title, className)}>{children}</span>
  );
}

EmptyStateTitle.displayName = "EmptyStateTitle";
