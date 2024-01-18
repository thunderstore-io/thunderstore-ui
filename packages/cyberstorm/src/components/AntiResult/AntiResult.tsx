import { PropsWithChildren } from "react";
import styles from "./AntiResult.module.css";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  className?: string;
}

/**
 * Ease of use component set for adding helpful content in
 * place where content is missing
 */
export function AntiResult(props: Props) {
  const { children, className } = props;

  return <div className={classnames(styles.root, className)}>{children}</div>;
}

AntiResult.displayName = "AntiResult";

export { AntiResult as Root };
