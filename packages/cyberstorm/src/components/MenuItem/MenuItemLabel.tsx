import { ReactNode } from "react";
import styles from "./MenuItem.module.css";

export interface MenuItemLabelProps {
  children?: ReactNode | ReactNode[];
}

export function MenuItemLabel(props: MenuItemLabelProps) {
  const { children } = props;
  return <span className={styles.menuItemLabel}>{children}</span>;
}

MenuItemLabel.displayName = "MenuItemLabel";
