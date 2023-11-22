"use client";
import React from "react";
import styles from "./MultiSelectSearch.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { Button } from "../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircleXmark,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { useRef } from "react";
import { assertIsNode } from "../../utils/type_guards";

type Option = {
  label: string;
  value: string;
};
type Props = {
  options: Option[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  color?: "red" | "green";
};

/**
 * Cyberstorm MultiSelectSearch component
 *  TODO: Better keyboard navigation
 */
export const MultiSelectSearch = React.forwardRef<HTMLInputElement, Props>(
  function MultiSelectSearch(props, ref) {
    const { options, onChange, onBlur, placeholder, color } = props;
    const menuRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isVisible, setIsVisible] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [selected, setList] = React.useState<Option[]>([]);
    const [filteredOptions, setFilteredOptions] = React.useState(options);

    function add(incomingOption: Option) {
      if (!selected.some((option) => option.value === incomingOption.value)) {
        setList([...selected, incomingOption]);
      }
    }

    function remove(incomingOption: Option) {
      setList(
        selected.filter((option) => option.value !== incomingOption.value)
      );
    }

    // Helper function for preventing focusing on input, when clicking on a child.
    function handleParentClick(
      event: React.MouseEvent | React.KeyboardEvent,
      onClick: () => void
    ) {
      onClick();
      event.stopPropagation();
    }

    const closeOpenMenu = React.useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (
          menuRef.current &&
          isVisible &&
          !menuRef.current.contains(assertIsNode(e.target) ? e.target : null)
        ) {
          setIsVisible(false);
          onBlur();
        }
      },
      [setIsVisible, isVisible]
    );

    // Event listeners for closing menu when clicking or touching outside.
    React.useEffect(() => {
      document.addEventListener("mousedown", closeOpenMenu);
      document.addEventListener("touchstart", closeOpenMenu);
      return () => {
        document.removeEventListener("mousedown", closeOpenMenu);
        document.removeEventListener("touchstart", closeOpenMenu);
      };
    });

    React.useEffect(() => {
      onChange(selected);
      const updatedOptions = options.filter(
        (option) => !selected.includes(option) && option.label.includes(search)
      );
      setFilteredOptions(updatedOptions);
    }, [selected, search]);

    return (
      <div className={styles.root} ref={ref}>
        <div className={styles.selected}>
          {selected.map((option, key) => {
            return (
              <Button.Root
                key={key}
                onClick={() => remove(option)}
                colorScheme="default"
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
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          className={styles.search}
          onClick={(e) =>
            handleParentClick(e, () => {
              inputRef.current && inputRef.current.focus();
            })
          }
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
              onClick={(e) => handleParentClick(e, () => setList([]))}
              className={styles.removeAllButton}
            >
              <Icon inline>
                <FontAwesomeIcon icon={faCircleXmark} />
              </Icon>
            </button>
            <div className={styles.inputButtonDivider}></div>
            <button
              onClick={(e) =>
                handleParentClick(e, () => setIsVisible(!isVisible))
              }
              className={styles.openMenuButton}
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
            {filteredOptions.map((option, key) => {
              return (
                <MultiSelectItem
                  key={key}
                  onClick={(e) => handleParentClick(e, () => add(option))}
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
  key: number;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  option: Option;
  focus?: boolean;
}) => {
  return (
    <div
      className={classnames(
        styles.multiSelectItemWrapper,
        props.focus ? styles.highlighted : null
      )}
      onClick={(e) => props.onClick(e)}
      onKeyDown={(e) => (e.code === "Enter" ? props.onClick(e) : null)}
      tabIndex={0}
      role="button"
    >
      {props.option.label}
    </div>
  );
};
