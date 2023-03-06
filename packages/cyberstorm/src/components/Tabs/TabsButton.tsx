import React, { MouseEventHandler } from "react";
import styles from "./TabsButton.module.css";

export interface TabsButtonProps {
  isSelected?: boolean;
  ariaCurrent?: boolean;
  ariaLabel?: string;
  label?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const TabsButton: React.FC<TabsButtonProps> = (props) => {
  const { ariaCurrent, ariaLabel, label, onClick, isSelected } = props;
  return (
    <button
      type="button"
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      className={`${styles.root} ${getStyle(isSelected)}`}
      onClick={onClick}
    >
      {label ? <div className={styles.label}>{label}</div> : null}
    </button>
  );
};

TabsButton.defaultProps = {
  isSelected: false,
  ariaCurrent: false,
  ariaLabel: "",
  label: "",
};

const getStyle = (isSelected = false) => {
  if (isSelected) {
    return styles.button__default_selected;
  }

  return styles.button__default;
};
