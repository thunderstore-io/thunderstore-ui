import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonIconProps {
  children: ReactNode | ReactNode[];
  iconSize?: "default" | "tslogo_install_button";
  iconColor?: "default" | "darker";
}

export function ButtonIcon(props: ButtonIconProps) {
  const { children, iconSize = "default", iconColor = "darker" } = props;
  return (
    <div className={`${getIconSize(iconSize)} ${getIconColor(iconColor)}`}>
      {children}
    </div>
  );
}

const getIconSize = (scheme: string) => {
  return {
    default: styles.ButtonIcon__IconSize__default,
    tslogo_install_button: styles.ButtonIcon__IconSize__tslogo_install_button,
  }[scheme];
};

const getIconColor = (scheme: string) => {
  return {
    default: styles.ButtonIcon__IconColor__default,
    darker: styles.ButtonIcon__IconColor__darker,
  }[scheme];
};

ButtonIcon.displayName = "ButtonIcon";
