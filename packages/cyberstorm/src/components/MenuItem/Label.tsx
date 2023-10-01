import { ReactNode } from "react";
import styles from "./Label.module.css";

export interface LabelProps {
  children?: ReactNode | ReactNode[];
}

export function Label(props: LabelProps) {
  const { children } = props;
  return <span className={styles.root}>{children}</span>;
}

Label.displayName = "Label";
