"use client";
import React from "react";
import styles from "./SelectSearch.module.css";
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

export type SelectSearchOption = string;

type Props = {
  options: SelectSearchOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: string | undefined) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  color?: "red" | "green";
};

/**
 * Cyberstorm SelectSearch component
 *  TODO: Better keyboard navigation
 */
export const SelectSearch = React.forwardRef<HTMLInputElement, Props>(
  function SelectSearch(props, ref) {
    const { options, onChange, onBlur, placeholder, color } = props;
    const menuRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isVisible, setIsVisible] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState<string | undefined>(
      undefined
    );

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
    }, [selected, search]);

    return (
      <div className={styles.root} ref={ref}>
        <div className={styles.selected}>
          {selected ? (
            <Button.Root
              onClick={() => setSelected(undefined)}
              colorScheme="default"
              paddingSize="small"
              style={{ gap: "0.5rem" }}
            >
              <Button.ButtonLabel>{selected}</Button.ButtonLabel>
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faXmark} />
              </Button.ButtonIcon>
            </Button.Root>
          ) : null}
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
              onClick={(e) => handleParentClick(e, () => setSearch(""))}
              className={styles.clearSearch}
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
            {options.map((option, key) => {
              return (
                <SelectItem
                  key={key}
                  onClick={(e) =>
                    handleParentClick(e, () => setSelected(option))
                  }
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
  key: number;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  option: SelectSearchOption;
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
      {props.option}
    </div>
  );
};
