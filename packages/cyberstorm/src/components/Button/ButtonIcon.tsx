import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface Props {
  children: ReactNode | ReactNode[];
  iconSize?: "default" | "tslogo_install_button";
  iconColor?: "default" | "darker";
}

export function ButtonIcon(props: Props) {
  const { children, iconSize = "default", iconColor = "darker" } = props;
  return (
    <div
      className={styles.icon}
      data-icon-color={iconColor}
      data-icon-size={iconSize}
    >
      {children}
    </div>
  );
}

ButtonIcon.displayName = "ButtonIcon";
