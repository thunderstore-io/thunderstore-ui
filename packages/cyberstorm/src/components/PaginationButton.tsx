import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/PaginationButton.module.css";

export interface PaginationButtonProps {
  isSelected?: boolean;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
  const { label, leftIcon, rightIcon, colorScheme, onClick, isSelected } =
    props;
  return (
    <button
      type="button"
      className={`${styles.root} ${getStyle(colorScheme, isSelected)}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </button>
  );
};

PaginationButton.defaultProps = { colorScheme: "default" };

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
