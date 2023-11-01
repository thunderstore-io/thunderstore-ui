import { MouseEventHandler } from "react";
import styles from "./PaginationButton.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface PaginationButtonProps {
  isSelected?: boolean;
  ariaCurrent?: boolean;
  ariaLabel?: string;
  label?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  colorScheme?: "default" | "inactive";
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
      className={classnames(styles.root, getStyle(colorScheme, isSelected))}
      onClick={onClick}
    >
      {leftIcon ? (
        <Icon inline wrapperClasses={styles.icon}>
          {leftIcon}
        </Icon>
      ) : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? (
        <Icon inline wrapperClasses={styles.icon}>
          {rightIcon}
        </Icon>
      ) : null}
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
      inactive: styles.button__inactive,
    }[scheme];
  }

  return {
    default: styles.button__default,
    inactive: styles.button__inactive,
  }[scheme];
};
