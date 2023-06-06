import { MouseEventHandler, ReactElement } from "react";
import styles from "./TabsButton.module.css";

export interface TabsButtonProps {
  isSelected?: boolean;
  ariaCurrent?: boolean;
  ariaLabel?: string;
  label?: string;
  icon?: ReactElement;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function TabsButton(props: TabsButtonProps) {
  const {
    ariaCurrent = false,
    ariaLabel = "",
    label = "",
    icon = null,
    onClick,
    isSelected = false,
  } = props;
  return (
    <button
      type="button"
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      className={`${styles.root} ${getStyle(isSelected)}`}
      onClick={onClick}
    >
      {icon}
      {label ? <div className={styles.label}>{label}</div> : null}
    </button>
  );
}

const getStyle = (isSelected = false) => {
  if (isSelected) {
    return styles.button__default_selected;
  }

  return styles.button__default;
};
