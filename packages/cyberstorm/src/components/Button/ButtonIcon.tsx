import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonIconProps {
  children: ReactNode | ReactNode[];
}

export function ButtonIcon(props: ButtonIconProps) {
  const { children } = props;
  return <div className={styles.ButtonIcon}>{children}</div>;
}

ButtonIcon.displayName = "ButtonIcon";
