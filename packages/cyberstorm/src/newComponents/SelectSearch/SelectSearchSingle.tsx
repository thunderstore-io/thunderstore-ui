import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import type { SelectOption } from "../../utils/types";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./SelectSearch.css";
import { SelectSearchMenu } from "./SelectSearchMenu";
import "./SelectSearchSingle.css";
import type { SelectSearchSingleProps } from "./types";
import {
  getSelectSearchOptionId,
  mergeRefs,
  useSelectSearch,
} from "./useSelectSearch";

function getInputValue(
  search: string,
  isVisible: boolean,
  value: SelectOption<string> | undefined
): string {
  if (isVisible) return search;

  return value ? value.label ?? value.value : "";
}

/**
 * Cyberstorm SelectSearch component for single selection.
 */
export const SelectSearchSingle = React.forwardRef<
  HTMLInputElement,
  SelectSearchSingleProps
>(function SelectSearchSingle(props, forwardedRef) {
  const {
    options,
    value,
    onChange,
    placeholder,
    csModifiers,
    disabled = false,
    defaultOpen = false,
    onMenuOpenChange,
    scrollMenuIntoView,
    scrollContainerSelector,
  } = props;

  const isOptionSelected = React.useCallback(
    (option: SelectOption<string>) => value?.value === option.value,
    [value?.value]
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
    handleSingleInputKeyDown,
    handleSingleOptionSelect,
    handleFieldPointerDown,
  } = useSelectSearch({
    options,
    disabled,
    defaultOpen,
    onMenuOpenChange,
    scrollMenuIntoView,
    scrollContainerSelector,
    onOptionSelect: onChange,
  });

  const inputValue = getInputValue(search, isVisible, value);

  return (
    <div
      className={classnames(
        "select-search",
        "select-search--single",
        ...componentClasses("select-search", undefined, undefined, csModifiers),
        disabled ? "select-search--variant--disabled" : null
      )}
      ref={containerRef}
      onPointerDown={handleFieldPointerDown}
    >
      <div className="select-search__search">
        <div className="select-search__selected-and-input-container">
          <div className="select-search__selected-and-input">
            <input
              className="select-search__input"
              value={inputValue}
              onFocus={openMenu}
              onChange={(e) => !disabled && setSearch(e.currentTarget.value)}
              onKeyDown={handleSingleInputKeyDown}
              ref={mergeRefs(inputRef, forwardedRef)}
              placeholder={value ? undefined : placeholder}
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
            onOptionSelect={handleSingleOptionSelect}
            onOptionHighlight={highlightOption}
            isOptionSelected={isOptionSelected}
          />
        ) : null}
      </div>
    </div>
  );
});

SelectSearchSingle.displayName = "SelectSearchSingle";
