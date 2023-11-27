"use client";
import React from "react";
import styles from "./MultiSelectSearch.module.css";
import { classnames } from "../../utils/utils";
import { Button, Icon } from "../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircleXmark,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { isNode } from "../../utils/type_guards";

export type MultiSelectSearchOption = {
  label: string;
  value: string;
};
type Props = {
  options: MultiSelectSearchOption[];
  value: MultiSelectSearchOption[];
  onChange: (v: MultiSelectSearchOption[]) => void;
  onBlur: () => void;
  // TODO: Implement disabled state
  disabled?: boolean;
  placeholder?: string;
  color?: "red" | "green";
};

/**
 * Cyberstorm MultiSelectSearch component
 *  TODO: Better keyboard navigation
 */
export const MultiSelectSearch = React.forwardRef<HTMLInputElement, Props>(
  function MultiSelectSearch(props, ref) {
    const { options, value, onChange, onBlur, placeholder, color } = props;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const [isVisible, setIsVisible] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [filteredOptions, setFilteredOptions] = React.useState(options);

    function add(incomingOption: MultiSelectSearchOption) {
      if (!value.some((option) => option.value === incomingOption.value)) {
        onChange(
          [...value, incomingOption].sort((o1, o2) =>
            o1.value > o2.value ? 1 : o1.value < o2.value ? -1 : 0
          )
        );
      }
    }

    function remove(incomingOption: MultiSelectSearchOption) {
      onChange(value.filter((option) => option.value !== incomingOption.value));
    }

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

    React.useEffect(() => {
      const updatedOptions = options.filter(
        (option) =>
          !value.includes(option) &&
          option.label.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOptions(updatedOptions);
    }, [value, search, options, setFilteredOptions]);

    return (
      <div className={styles.root} ref={ref}>
        <div className={styles.selected}>
          {value.map((option) => {
            return (
              <Button.Root
                key={option.value}
                onClick={() => remove(option)}
                paddingSize="small"
                style={{ gap: "0.5rem" }}
              >
                <Button.ButtonLabel>{option.label}</Button.ButtonLabel>
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faXmark} />
                </Button.ButtonIcon>
              </Button.Root>
            );
          })}
        </div>
        <div
          className={styles.search}
          onFocus={(e) => {
            if (e.target === menuRef.current) {
              inputRef.current && inputRef.current.focus();
            }
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
            {filteredOptions.map((option) => {
              return (
                <MultiSelectItem
                  key={option.value}
                  onClick={(e) => {
                    add(option);
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

MultiSelectSearch.displayName = "MultiSelectSearch";

const MultiSelectItem = (props: {
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  option: MultiSelectSearchOption;
}) => {
  return (
    <div
      className={styles.multiSelectItemWrapper}
      onClick={props.onClick}
      onKeyDown={(e) => (e.code === "Enter" ? props.onClick(e) : null)}
      tabIndex={0}
      role="button"
    >
      {props.option.label}
    </div>
  );
};
