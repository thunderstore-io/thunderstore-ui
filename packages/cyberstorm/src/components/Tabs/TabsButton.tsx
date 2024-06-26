import { MouseEventHandler, ReactElement } from "react";
import styles from "./TabsButton.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface TabsButtonProps {
  isSelected?: boolean;
  ariaCurrent?: boolean;
  ariaLabel?: string;
  label?: string;
  icon?: ReactElement | undefined;
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
      className={classnames(styles.root, getStyle(isSelected))}
      onClick={onClick}
    >
      {icon ? (
        <Icon inline wrapperClasses={styles.icon}>
          {icon}
        </Icon>
      ) : null}
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
