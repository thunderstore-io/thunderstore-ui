import { ReactNode } from "react";
import styles from "./Icon.module.css";

export interface IconProps {
  children: ReactNode | ReactNode[];
}

export function Icon(props: IconProps) {
  const { children } = props;
  return <div className={styles.root}>{children}</div>;
}

Icon.displayName = "Icon";
