import styles from "./StalenessIndicator.module.css";
import { ReactNode } from "react";
import { classnames } from "../../utils/utils";
import { NewIcon } from "../..";
import { ThunderstoreLogo } from "../../svg/svg";

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
    <div style={{ position: "relative" }}>
      {isStale ? (
        <NewIcon wrapperClasses={styles.loader}>
          <ThunderstoreLogo />
        </NewIcon>
      ) : undefined}
      <div className={classnames(isStale ? styles.root : null, className)}>
        {children}
      </div>
    </div>
  );
}

StalenessIndicator.displayName = "StalenessIndicator";
