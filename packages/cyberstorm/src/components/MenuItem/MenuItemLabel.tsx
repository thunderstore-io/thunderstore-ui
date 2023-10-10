import { ReactNode } from "react";
import styles from "./MenuItem.module.css";

export interface MenuItemLabelProps {
  children?: ReactNode | ReactNode[];
  fontSize?: "medium" | "small";
}

export function MenuItemLabel(props: MenuItemLabelProps) {
  const { children, fontSize = "medium" } = props;
  return (
    <span className={`${styles.menuItemLabel} ${getFontSize(fontSize)}`}>
      {children}
    </span>
  );
}

const getFontSize = (scheme: string) => {
  return {
    small: styles.menuItemLabel__fontSize__small,
    medium: styles.menuItemLabel__fontSize__medium,
  }[scheme];
};

MenuItemLabel.displayName = "MenuItemLabel";
