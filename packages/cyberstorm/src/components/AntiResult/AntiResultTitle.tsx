import { PropsWithChildren } from "react";
import styles from "./AntiResult.module.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export function AntiResultTitle(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.title, className)}>{children}</span>
  );
}

AntiResultTitle.displayName = "AntiResultTitle";
