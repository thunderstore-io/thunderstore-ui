import React from "react";
import "./SelectSearch.css";
import type { SelectOption } from "@thunderstore/cyberstorm-utils";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { Tag as NewTag } from "@thunderstore/cyberstorm-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  type SelectSearchVariants,
  type SelectSearchSizes,
  type SelectSearchModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

export type SelectSearchProps =
  | {
      multiple?: false;
      options: SelectOption[];
      value?: SelectOption;
      onChange: (v: SelectOption | undefined) => void;
      disabled?: boolean;
      placeholder?: string;
      csVariant?: SelectSearchVariants;
      csSize?: SelectSearchSizes;
      csModifiers?: SelectSearchModifiers[];
      defaultOpen?: boolean;
    }
  | {
      multiple: true;
      options: SelectOption[];
      value?: SelectOption[];
      onChange: (v: SelectOption[] | undefined) => void;
      disabled?: boolean;
      placeholder?: string;
      csVariant?: SelectSearchVariants;
      csSize?: SelectSearchSizes;
      csModifiers?: SelectSearchModifiers[];
      defaultOpen?: boolean;
    };

/**
 * Cyberstorm SelectSearch component
 *
 * A searchable dropdown component that supports both single and multiple selection modes.
 * Features:
 * - Search filtering of options
 * - Single and multiple selection modes
 * - Clear selection functionality
 * - Keyboard navigation (TODO)
 * - Click outside to close
 * - Customizable through theme variables
 *
 * @example
 * // Single selection
 * <SelectSearch
 *   options={[{ value: "1", label: "Option 1" }]}
 *   onChange={(val) => console.log(val)}
 * />
 *
 * // Multiple selection
 * <SelectSearch
 *   multiple
 *   options={[{ value: "1", label: "Option 1" }]}
 *   onChange={(val) => console.log(val)}
 * />
 */
export const SelectSearch = React.forwardRef<
  HTMLInputElement,
  SelectSearchProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(function SelectSearch(props, _forwardedRef) {
  const {
    options,
    value,
    onChange,
    placeholder,
    multiple = false,
    csVariant = "default",
    csSize = "medium",
    csModifiers,
    disabled = false,
    defaultOpen = false,
  } = props;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(defaultOpen);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isVisible &&
        !disabled
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, disabled]);

  const handleOptionSelect = (option: SelectOption) => {
    if (disabled) return;

    if (!multiple) {
      (onChange as (v: SelectOption | undefined) => void)(option);
      setIsVisible(false);
      return;
    }

    const currentValues = Array.isArray(value) ? value : [];
    const isSelected = currentValues.some((v) => v.value === option.value);

    if (isSelected) {
      (onChange as (v: SelectOption[] | undefined) => void)(
        currentValues.filter((v) => v.value !== option.value)
      );
    } else {
      (onChange as (v: SelectOption[] | undefined) => void)([
        ...currentValues,
        option,
      ]);
    }
    // Keep focus on input after selection
    inputRef.current?.focus();
  };

  const removeOption = (optionToRemove: SelectOption) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      (onChange as (v: SelectOption[] | undefined) => void)(
        currentValues.filter((v) => v.value !== optionToRemove.value)
      );
    } else {
      (onChange as (v: SelectOption | undefined) => void)(undefined);
    }
  };

  const selectedValue = multiple
    ? Array.isArray(value)
      ? value
      : []
    : (value as SelectOption | undefined);

  return (
    <div
      className={classnames(
        "select-search",
        ...componentClasses(
          "select-search",
          multiple ? "multiple" : csVariant,
          csSize,
          csModifiers
        ),
        disabled ? "select-search--variant--disabled" : null
      )}
      ref={containerRef}
    >
      <div className="select-search__search">
        <div className="select-search__selected-and-input-container">
          <div className="select-search__selected-and-input">
            {selectedValue && (
              <div className="select-search__selected">
                {multiple ? (
                  (selectedValue as SelectOption[]).map(
                    (option: SelectOption) => (
                      <NewTag
                        key={option.value}
                        onClick={() => !disabled && removeOption(option)}
                        rootClasses="select-search__selected-button"
                        csVariant="primary"
                        csSize="small"
                        csMode="button"
                        disabled={disabled}
                      >
                        {option.label}
                        <NewIcon csMode="inline" noWrapper>
                          <FontAwesomeIcon icon={faXmark} />
                        </NewIcon>
                      </NewTag>
                    )
                  )
                ) : (
                  <NewTag
                    onClick={() => {
                      if (disabled) return;
                      removeOption(selectedValue as SelectOption);
                    }}
                    rootClasses="select-search__selected-button"
                    csVariant="primary"
                    csSize="small"
                    csMode="button"
                    disabled={disabled}
                  >
                    {(selectedValue as SelectOption).label}
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faXmark} />
                    </NewIcon>
                  </NewTag>
                )}
              </div>
            )}
            <input
              className={classnames(
                "select-search__input",
                disabled ? "select-search__input--disabled" : null
              )}
              value={search}
              onFocus={() => !disabled && setIsVisible(true)}
              onChange={(e) => !disabled && setSearch(e.currentTarget.value)}
              ref={inputRef}
              placeholder={selectedValue ? undefined : placeholder}
              disabled={disabled}
            />
          </div>
          <button
            onClick={(e) => {
              if (disabled) return;
              setSearch("");
              onChange(undefined);
              e.stopPropagation();
            }}
            className="select-search__clear-search"
            disabled={disabled}
          >
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faCircleXmark} />
            </NewIcon>
          </button>
          <div className="select-search__divider"></div>
          <button
            className="select-search__show-menu-button"
            onClick={() => !disabled && setIsVisible(!isVisible)}
            disabled={disabled}
          >
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faCaretDown} />
            </NewIcon>
          </button>
        </div>
        <div
          className={classnames(
            "select-search__menu",
            isVisible ? "select-search__menu--visible" : null
          )}
        >
          {options.filter(
            (option) =>
              option.label?.toLowerCase().includes(search.toLowerCase()) &&
              (!Array.isArray(selectedValue) ||
                !(selectedValue as SelectOption[]).some(
                  (v) => v.value === option.value
                ))
          ).length > 0 ? (
            options
              .filter(
                (option) =>
                  option.label?.toLowerCase().includes(search.toLowerCase()) &&
                  (!Array.isArray(selectedValue) ||
                    !(selectedValue as SelectOption[]).some(
                      (v) => v.value === option.value
                    ))
              )
              .map((option) => {
                return (
                  <SelectItem
                    key={option.value}
                    onClick={(e) => {
                      handleOptionSelect(option);
                      e.stopPropagation();
                    }}
                    option={option}
                  />
                );
              })
          ) : (
            <div className="select-search__no-options">
              Nothing to choose from
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SelectSearch.displayName = "SelectSearch";

const SelectItem = (props: {
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
  option: SelectOption;
}) => {
  return (
    <div
      className="select-search__item"
      onClick={props.onClick}
      onKeyDown={(e) => (e.code === "Enter" ? props.onClick(e) : null)}
      tabIndex={0}
      role="button"
    >
      {props.option.label}
    </div>
  );
};
