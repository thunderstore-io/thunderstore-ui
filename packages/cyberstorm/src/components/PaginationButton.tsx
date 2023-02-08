import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/PaginationButton.module.css";

export interface PaginationButtonProps {
  isSelected?: boolean;
  ariaCurrent?: boolean;
  ariaLabel?: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default";
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
  const {
    ariaCurrent,
    ariaLabel,
    label,
    leftIcon,
    rightIcon,
    colorScheme,
    onClick,
    isSelected,
  } = props;
  return (
    <button
      type="button"
      aria-current={ariaCurrent ? "page" : false}
      aria-label={ariaLabel ?? ariaLabel}
      className={`${styles.root} ${getStyle(colorScheme, isSelected)}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </button>
  );
};

PaginationButton.defaultProps = {
  colorScheme: "default",
  isSelected: false,
  ariaCurrent: false,
  ariaLabel: "",
  label: "",
  leftIcon: null,
  rightIcon: null,
};

const getStyle = (
  scheme: PaginationButtonProps["colorScheme"] = "default",
  isSelected = false
) => {
  if (isSelected) {
    return {
      default: styles.button__default_selected,
    }[scheme];
  }

  return {
    default: styles.button__default,
  }[scheme];
};
