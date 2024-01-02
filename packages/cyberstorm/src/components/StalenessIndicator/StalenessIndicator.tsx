import styles from "./StalenessIndicator.module.css";
import { ReactNode } from "react";
import { classnames } from "../../utils/utils";

interface Props {
  children: ReactNode;
  className?: string;
  isStale: boolean;
}

/**
 * Component for indicating if childrens content is stale
 * @param className String of additional classes to be added to the indicator element
 * @param isStale Boolean for controlling if the indicator elements root class is used
 * @returns Wraps the children in a div with stale indicators styles
 */
export function StalenessIndicator(props: Props) {
  const { children, className, isStale = false } = props;
  return (
    <div className={classnames(isStale ? styles.root : null, className)}>
      {children}
    </div>
  );
}

StalenessIndicator.displayName = "StalenessIndicator";
