import { ReactNode } from "react";
import styles from "./Button.module.css";
import classNames from "classnames";

export interface ButtonIconProps {
  children: ReactNode | ReactNode[];
  variant?: "default" | "dark" | "big_install";
}

export function ButtonIcon(props: ButtonIconProps) {
  const { children, variant } = props;
  return (
    <div
      className={classNames(
        styles.icon,
        variant === "default" || !variant ? null : getVariant(variant)
      )}
    >
      {children}
    </div>
  );
}

const getVariant = (scheme: string) => {
  return {
    darker: styles.ButtonIcon__IconColor__darker,
    big_install: styles.ButtonIcon__IconColor__default,
  }[scheme];
};

ButtonIcon.displayName = "ButtonIcon";
