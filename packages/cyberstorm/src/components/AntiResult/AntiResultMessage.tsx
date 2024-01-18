import { PropsWithChildren } from "react";
import styles from "./AntiResult.module.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

export function AntiResultMessage(props: Props) {
  const { children, className } = props;
  return (
    <span className={classnames(styles.message, className)}>{children}</span>
  );
}

AntiResultMessage.displayName = "AntiResultMessage";
