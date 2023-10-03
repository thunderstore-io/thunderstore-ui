import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonIconProps {
  children: ReactNode | ReactNode[];
  iconSize?: "default" | "tslogo_install_button";
}

export function ButtonIcon(props: ButtonIconProps) {
  const { children, iconSize = "default" } = props;
  return <div className={`${getIconSize(iconSize)}`}>{children}</div>;
}

const getIconSize = (scheme: string) => {
  return {
    default: styles.ButtonIcon__IconSize__default,
    tslogo_install_button: styles.ButtonIcon__IconSize__tslogo_install_button,
  }[scheme];
};

ButtonIcon.displayName = "ButtonIcon";
