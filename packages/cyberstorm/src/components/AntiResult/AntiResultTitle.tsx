import { ReactNode } from "react";
import styles from "./AntiResult.module.css";
import { classnames } from "../../utils/utils";

interface Props {
  children?: ReactNode | ReactNode[];
  className?: string;
}

export function AntiResultTitle(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.antiResultTitle, className)}>
      {children}
    </span>
  );
}

AntiResultTitle.displayName = "AntiResultTitle";
