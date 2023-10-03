import { ReactNode } from "react";
import styles from "./MenuItem.module.css";

export interface MenuItemIconProps {
  children: ReactNode | ReactNode[];
}

export function MenuItemIcon(props: MenuItemIconProps) {
  const { children } = props;
  return <div className={styles.menuItemIcon}>{children}</div>;
}

MenuItemIcon.displayName = "MenuItemIcon";
