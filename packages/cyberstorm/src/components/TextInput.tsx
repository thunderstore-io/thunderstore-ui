import React, { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import styles from "./componentStyles/TextInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleX } from "@fortawesome/pro-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export interface TextInputProps {
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  leftIcon?: ReactNode;
  onLeftIconClick?: MouseEventHandler<HTMLButtonElement>;
  rightIcon?: ReactNode;
  onRightIconClick?: MouseEventHandler<HTMLButtonElement>;
  onClear?: MouseEventHandler<HTMLButtonElement>;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  textInputStyle?: "root__small";
}

export const TextInput: React.FC<PropsWithChildren<TextInputProps>> = ({
  onChange,
  leftIcon = <FontAwesomeIcon fixedWidth={true} icon={faMagnifyingGlass} />,
  onLeftIconClick,
  rightIcon,
  onRightIconClick,
  onClear,
  placeholder = "Search",
  value,
  disabled = false,
  textInputStyle,
}) => {
  return (
    /* TS is not aware of defaultProps of function components. */
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    <div className={`${styles.root} ${styles[textInputStyle!]}`}>
      <button
        type="submit"
        onClick={onLeftIconClick}
        className={styles.leftIcon}
        disabled={disabled}
      >
        {leftIcon}
      </button>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onRightIconClick}
        className={styles.rightIcon}
        disabled={disabled}
      >
        {rightIcon}
      </button>
      {onClear && value && (
        <button
          type="reset"
          onClick={onClear}
          className={styles.rootClear}
          disabled={disabled}
        >
          <FontAwesomeIcon fixedWidth={true} icon={faCircleX} />
        </button>
      )}
    </div>
  );
};
