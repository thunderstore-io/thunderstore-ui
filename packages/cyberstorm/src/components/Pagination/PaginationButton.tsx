import { MouseEventHandler, ReactNode } from "react";
import styles from "./PaginationButton.module.css";

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

export function PaginationButton(props: PaginationButtonProps) {
  const {
    ariaCurrent = false,
    ariaLabel = "",
    label = "",
    leftIcon = null,
    rightIcon = null,
    colorScheme = "default",
    onClick,
    isSelected = false,
  } = props;
  return (
    <button
      type="button"
      aria-current={ariaCurrent ? "page" : undefined}
      aria-label={ariaLabel}
      className={`${styles.root} ${getStyle(colorScheme, isSelected)}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </button>
  );
}

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
