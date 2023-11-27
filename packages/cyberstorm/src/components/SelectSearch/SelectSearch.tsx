"use client";
import React from "react";
import styles from "./SelectSearch.module.css";
import { classnames } from "../../utils/utils";
import { Button, Icon } from "../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircleXmark,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { isNode } from "../../utils/type_guards";

type Props = {
  options: string[];
  value?: string;
  onChange: (v: string | undefined) => void;
  onBlur: () => void;
  // TODO: Implement disabled state
  disabled?: boolean;
  placeholder?: string;
  color?: "red" | "green";
};

/**
 * Cyberstorm SelectSearch component
 *  TODO: Better keyboard navigation
 */
export const SelectSearch = React.forwardRef<HTMLInputElement, Props>(
  function SelectSearch(props, ref) {
    const { options, value, onChange, onBlur, placeholder, color } = props;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const [isVisible, setIsVisible] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const hideMenu = React.useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (
          menuRef.current &&
          isVisible &&
          !menuRef.current.contains(isNode(e.target) ? e.target : null)
        ) {
          setIsVisible(false);
          onBlur();
        }
      },
      [setIsVisible, isVisible, onBlur, menuRef]
    );

    // Event listeners for closing menu when clicking or touching outside.
    React.useEffect(() => {
      document.addEventListener("mousedown", hideMenu);
      document.addEventListener("touchstart", hideMenu);
      return () => {
        document.removeEventListener("mousedown", hideMenu);
        document.removeEventListener("touchstart", hideMenu);
      };
    });

    return (
      <div className={styles.root} ref={ref}>
        <div className={styles.selected}>
          {value ? (
            <Button.Root
              onClick={() => onChange(undefined)}
              paddingSize="small"
              style={{ gap: "0.5rem" }}
            >
              <Button.ButtonLabel>{value}</Button.ButtonLabel>
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faXmark} />
              </Button.ButtonIcon>
            </Button.Root>
          ) : null}
        </div>
        <div
          className={styles.search}
          onFocus={(e) => {
            inputRef.current && inputRef.current.focus();
            e.stopPropagation();
          }}
          role="button"
          tabIndex={0}
          ref={menuRef}
        >
          <div className={styles.inputContainer} data-color={color}>
            <input
              className={styles.input}
              value={search}
              data-color={color}
              onFocus={() => setIsVisible(true)}
              onChange={(e) => setSearch(e.currentTarget.value)}
              ref={inputRef}
              placeholder={placeholder}
            />
            <button
              onClick={(e) => {
                setSearch("");
                e.stopPropagation();
              }}
              className={styles.clearSearch}
            >
              <Icon inline>
                <FontAwesomeIcon icon={faCircleXmark} />
              </Icon>
            </button>
            <div className={styles.inputButtonDivider}></div>
            <button
              onClick={(e) => {
                setIsVisible(!isVisible);
                e.stopPropagation();
              }}
              className={styles.showMenuButton}
            >
              <Icon inline>
                <FontAwesomeIcon icon={faCaretDown} />
              </Icon>
            </button>
          </div>
          <div
            className={classnames(
              styles.menu,
              isVisible ? styles.visible : null
            )}
          >
            {options
              .filter((option) =>
                option.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => {
                return (
                  <SelectItem
                    key={option}
                    onClick={(e) => {
                      onChange(option);
                      e.stopPropagation();
                    }}
                    option={option}
                  />
                );
              })}
          </div>
        </div>
      </div>
    );
  }
);

SelectSearch.displayName = "SelectSearch";

const SelectItem = (props: {
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  option: string;
}) => {
  return (
    <div
      className={styles.multiSelectItemWrapper}
      onClick={props.onClick}
      onKeyDown={(e) => (e.code === "Enter" ? props.onClick(e) : null)}
      tabIndex={0}
      role="button"
    >
      {props.option}
    </div>
  );
};
