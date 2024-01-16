import { ReactNode } from "react";
import styles from "./AntiResult.module.css";
import { classnames } from "../../utils/utils";

interface Props {
  children?: ReactNode | ReactNode[];
  className?: string;
}

export function AntiResultMessage(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.antiResultMessage, className)}>
      {children}
    </span>
  );
}

AntiResultMessage.displayName = "AntiResultMessage";
