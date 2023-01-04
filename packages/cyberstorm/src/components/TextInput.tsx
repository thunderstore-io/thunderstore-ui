import React, { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import styles from "./componentStyles/TextInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleX } from "@fortawesome/pro-regular-svg-icons";

export interface TextInputProps {
  disabled?: boolean;
  leftIcon?: ReactNode;
  onClear?: MouseEventHandler<HTMLButtonElement>;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onLeftIconClick?: MouseEventHandler<HTMLButtonElement>;
  onRightIconClick?: MouseEventHandler<HTMLButtonElement>;
  placeholder?: string;
  rightIcon?: ReactNode;
  size?: "default" | "small";
  value: string;
}

const getStyle = (scheme: TextInputProps["size"] = "default") => {
  return {
    default: "",
    small: styles.small,
  }[scheme];
};

export const TextInput: React.FC<PropsWithChildren<TextInputProps>> = ({
  disabled = false,
  leftIcon,
  onClear,
  onChange,
  onLeftIconClick,
  onRightIconClick,
  placeholder = "Search",
  rightIcon,
  size,
  value,
}) => {
  return (
    /* TS is not aware of defaultProps of function components. */
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    <div className={`${styles.root} ${getStyle(size)}`}>
      {leftIcon && (
        <button
          className={styles.inputIcon}
          disabled={disabled}
          onClick={onLeftIconClick}
          type="button"
        >
          {leftIcon}
        </button>
      )}
      <input
        className={styles.textInput}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {onClear && value && (
        <button
          className={styles.rootClear}
          disabled={disabled}
          type="reset"
          onClick={onClear}
        >
          <FontAwesomeIcon fixedWidth icon={faCircleX} />
        </button>
      )}
      {rightIcon && (
        <button
          className={styles.inputIcon}
          disabled={disabled}
          type="button"
          onClick={onRightIconClick}
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};
