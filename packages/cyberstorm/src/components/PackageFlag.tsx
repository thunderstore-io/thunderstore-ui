import React, { ReactNode, useRef } from "react";
import styles from "./componentStyles/PackageFlag.module.css";

export interface PackageFlagProps {
  label?: string;
  icon?: ReactNode;
}

export const PackageFlag: React.FC<PackageFlagProps> = React.forwardRef<
  HTMLDivElement,
  PackageFlagProps
>((props, forwardedRef) => {
  const { label, icon, ...rest } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div {...rest} ref={ref} className={styles.root}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
});

PackageFlag.displayName = "PackageFlag";
