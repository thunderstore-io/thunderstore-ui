import styles from "./Button.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface ButtonIconProps {
  children: JSX.Element | JSX.Element[];
  iconSize?: "default" | "big";
  iconColor?: "default" | "darker";
  iconClasses?: string;
}

export function ButtonIcon(props: ButtonIconProps) {
  const {
    children,
    iconSize = "default",
    iconColor = "default",
    iconClasses,
  } = props;
  return (
    <Icon
      wrapperClasses={classnames(
        getIconSize(iconSize),
        getIconColor(iconColor)
      )}
      iconClasses={iconClasses}
    >
      {children}
    </Icon>
  );
}

const getIconSize = (scheme: string) => {
  return {
    default: styles.ButtonIcon__IconSize__default,
    big: styles.ButtonIcon__IconSize__big,
  }[scheme];
};

const getIconColor = (scheme: string) => {
  return {
    default: styles.ButtonIcon__IconColor__default,
    darker: styles.ButtonIcon__IconColor__darker,
  }[scheme];
};

ButtonIcon.displayName = "ButtonIcon";
