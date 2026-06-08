import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import type { SelectOption } from "../../utils/types";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import { Tag as NewTag } from "../Tag/Tag";
import "./SelectSearch.css";
import { SelectSearchMenu } from "./SelectSearchMenu";
import "./SelectSearchMultiple.css";
import type { SelectSearchMultipleProps } from "./types";
import {
  getSelectSearchOptionId,
  mergeRefs,
  useSelectSearch,
} from "./useSelectSearch";

/**
 * Cyberstorm SelectSearch component for multiple selection.
 */
export const SelectSearchMultiple = React.forwardRef<
  HTMLInputElement,
  SelectSearchMultipleProps
>(function SelectSearchMultiple(props, forwardedRef) {
  const {
    options,
    value,
    onChange,
    placeholder,
    csModifiers,
    disabled = false,
    defaultOpen = false,
  } = props;

  const selectedValues = Array.isArray(value) ? value : [];
  const excludeValues = React.useMemo(
    () => selectedValues.map((option) => option.value),
    [selectedValues]
  );

  const handleOptionSelect = React.useCallback(
    (option: SelectOption<string>) => {
      const isSelected = selectedValues.some((v) => v.value === option.value);

      if (isSelected) {
        const newSelected = selectedValues.filter(
          (v) => v.value !== option.value
        );
        onChange(newSelected.length > 0 ? newSelected : undefined);
      } else {
        onChange([...selectedValues, option]);
      }
    },
    [onChange, selectedValues]
  );

  const {
    containerRef,
    inputRef,
    menuId,
    isVisible,
    search,
    setSearch,
    highlightedIndex,
    filteredOptions,
    openMenu,
    toggleMenu,
    highlightOption,
    handleMultipleInputKeyDown,
    handleMultipleOptionSelect,
    handleFieldPointerDown,
  } = useSelectSearch({
    options,
    excludeValues,
    disabled,
    defaultOpen,
    onOptionSelect: handleOptionSelect,
  });

  const removeOption = React.useCallback(
    (optionToRemove: SelectOption<string>) => {
      const newSelected = selectedValues.filter(
        (v) => v.value !== optionToRemove.value
      );
      onChange(newSelected.length > 0 ? newSelected : undefined);
    },
    [onChange, selectedValues]
  );

  const handleClear = React.useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;
      setSearch("");
      onChange(undefined);
      event.stopPropagation();
    },
    [disabled, onChange, setSearch]
  );

  const hasSelection = selectedValues.length > 0;

  const isOptionSelected = React.useCallback(
    (option: SelectOption<string>) =>
      selectedValues.some((selected) => selected.value === option.value),
    [selectedValues]
  );

  return (
    <div
      className={classnames(
        "select-search",
        "select-search--multiple",
        ...componentClasses("select-search", undefined, undefined, csModifiers),
        disabled ? "select-search--variant--disabled" : null
      )}
      ref={containerRef}
      onPointerDown={handleFieldPointerDown}
    >
      <div className="select-search__search">
        <div className="select-search__selected-and-input-container">
          <div className="select-search__selected-and-input">
            {hasSelection ? (
              <SelectSearchSelected
                values={selectedValues}
                disabled={disabled}
                onRemove={removeOption}
              />
            ) : null}
            <input
              className="select-search__input"
              value={isVisible ? search : ""}
              onFocus={openMenu}
              onChange={(e) => !disabled && setSearch(e.currentTarget.value)}
              onKeyDown={handleMultipleInputKeyDown}
              ref={mergeRefs(inputRef, forwardedRef)}
              placeholder={hasSelection ? undefined : placeholder}
              disabled={disabled}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isVisible}
              aria-controls={isVisible ? menuId : undefined}
              aria-autocomplete="list"
              tabIndex={disabled ? -1 : 0}
              aria-activedescendant={
                isVisible && highlightedIndex >= 0
                  ? getSelectSearchOptionId(menuId, highlightedIndex)
                  : undefined
              }
            />
          </div>
          <div className="select-search__chrome">
            {hasSelection ? (
              <>
                <Actionable
                  primitiveType="button"
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={handleClear}
                  rootClasses="select-search__clear-search"
                  disabled={disabled}
                  tooltipText="Clear"
                  aria-label="Clear selection"
                >
                  <NewIcon noWrapper csMode="inline">
                    <FontAwesomeIcon icon={faXmark} />
                  </NewIcon>
                </Actionable>
                <div className="select-search__divider" aria-hidden="true" />
              </>
            ) : null}
            <Actionable
              primitiveType="button"
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
              }}
              onClick={toggleMenu}
              rootClasses="select-search__show-menu-button"
              disabled={disabled}
              tooltipText="Toggle options"
              aria-label="Toggle options"
              aria-expanded={isVisible}
            >
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faCaretDown} />
              </NewIcon>
            </Actionable>
          </div>
        </div>
        {isVisible ? (
          <SelectSearchMenu
            filteredOptions={filteredOptions}
            menuId={menuId}
            highlightedIndex={highlightedIndex}
            onOptionSelect={handleMultipleOptionSelect}
            onOptionHighlight={highlightOption}
            isOptionSelected={isOptionSelected}
          />
        ) : null}
      </div>
    </div>
  );
});

SelectSearchMultiple.displayName = "SelectSearchMultiple";

type SelectSearchSelectedProps = {
  values: SelectOption<string>[];
  disabled?: boolean;
  onRemove: (option: SelectOption<string>) => void;
};

function SelectSearchSelected({
  values,
  disabled = false,
  onRemove,
}: SelectSearchSelectedProps) {
  if (values.length === 0) return null;

  return (
    <div className="select-search__selected">
      {values.map((option) => (
        <NewTag
          key={option.value}
          onClick={() => !disabled && onRemove(option)}
          rootClasses="select-search__selected-button"
          csVariant="primary"
          csSize="small"
          csMode="button"
          disabled={disabled}
        >
          <span>{option.label ?? option.value}</span>
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faXmark} />
          </NewIcon>
        </NewTag>
      ))}
    </div>
  );
}
