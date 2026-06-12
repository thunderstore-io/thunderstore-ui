import React from "react";

import type { SelectOption } from "../../utils/types";
import { useScrollMenuIntoScrollParent } from "./useScrollMenuIntoScrollParent";

function filterOptions(
  options: SelectOption<string>[],
  search: string,
  excludeValues?: string[]
): SelectOption<string>[] {
  const normalizedSearch = search.toLowerCase();

  return options.filter((option) => {
    const searchableValue = (option.label ?? option.value)
      ?.toString()
      .toLowerCase();

    return (
      searchableValue?.includes(normalizedSearch) &&
      (!excludeValues || !excludeValues.includes(option.value))
    );
  });
}

export function getSelectSearchOptionId(menuId: string, index: number): string {
  return `${menuId}-option-${index}`;
}

export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

type UseSelectSearchOptions = {
  options: SelectOption<string>[];
  excludeValues?: string[];
  disabled?: boolean;
  defaultOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  scrollMenuIntoView?: boolean;
  scrollContainerSelector?: string;
  onOptionSelect: (option: SelectOption<string>) => void;
};

type InputKeyDownContext = {
  disabled: boolean;
  isVisible: boolean;
  filteredOptionsLength: number;
  closeMenu: () => void;
  openMenu: () => void;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  commitHighlightedOption: () => boolean;
};

function getInitialHighlightedIndex(length: number, direction: 1 | -1): number {
  if (length === 0) return -1;

  return direction === 1 ? 0 : length - 1;
}

function stepHighlightedIndex(
  length: number,
  index: number,
  direction: 1 | -1
): number {
  if (length === 0) return -1;
  if (index < 0) return direction === 1 ? 0 : length - 1;

  return (index + direction + length) % length;
}

function handleInputKeyDownEvent(
  event: React.KeyboardEvent<HTMLInputElement>,
  {
    disabled,
    isVisible,
    filteredOptionsLength,
    closeMenu,
    openMenu,
    setHighlightedIndex,
    commitHighlightedOption,
  }: InputKeyDownContext
) {
  if (disabled) return;

  switch (event.key) {
    case "Escape":
      event.preventDefault();
      closeMenu();
      break;
    case "ArrowDown":
    case "ArrowUp": {
      const direction = event.key === "ArrowDown" ? 1 : -1;

      event.preventDefault();
      if (!isVisible) {
        openMenu();
        setHighlightedIndex(
          getInitialHighlightedIndex(filteredOptionsLength, direction)
        );
        break;
      }
      setHighlightedIndex((index) =>
        stepHighlightedIndex(filteredOptionsLength, index, direction)
      );
      break;
    }
    case "Enter":
      if (!isVisible) return;
      event.preventDefault();
      commitHighlightedOption();
      break;
    default:
      break;
  }
}

type BoundSelectionOptions = {
  onComplete: () => void;
  selectOption: (option: SelectOption<string>, onComplete: () => void) => void;
  commitHighlightedOption: (onComplete: () => void) => boolean;
  disabled: boolean;
  isVisible: boolean;
  filteredOptionsLength: number;
  closeMenu: () => void;
  openMenu: () => void;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
};

function useBoundSelection({
  onComplete,
  selectOption,
  commitHighlightedOption,
  disabled,
  isVisible,
  filteredOptionsLength,
  closeMenu,
  openMenu,
  setHighlightedIndex,
}: BoundSelectionOptions) {
  const handleOptionSelect = React.useCallback(
    (option: SelectOption<string>) => selectOption(option, onComplete),
    [onComplete, selectOption]
  );

  const commitHighlighted = React.useCallback(
    () => commitHighlightedOption(onComplete),
    [commitHighlightedOption, onComplete]
  );

  const handleInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleInputKeyDownEvent(event, {
        disabled,
        isVisible,
        filteredOptionsLength,
        closeMenu,
        openMenu,
        setHighlightedIndex,
        commitHighlightedOption: commitHighlighted,
      });
    },
    [
      closeMenu,
      commitHighlighted,
      disabled,
      filteredOptionsLength,
      isVisible,
      openMenu,
      setHighlightedIndex,
    ]
  );

  return { handleOptionSelect, handleInputKeyDown };
}

export function useSelectSearch({
  options,
  excludeValues,
  disabled = false,
  defaultOpen = false,
  onMenuOpenChange,
  scrollMenuIntoView = true,
  scrollContainerSelector,
  onOptionSelect,
}: UseSelectSearchOptions) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(defaultOpen);
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const menuId = React.useId();

  const filteredOptions = React.useMemo(
    () => filterOptions(options, search, excludeValues),
    [options, search, excludeValues]
  );

  const closeMenu = React.useCallback(() => {
    setSearch("");
    setIsVisible(false);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isVisible &&
        !disabled
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu, isVisible, disabled]);

  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  React.useEffect(() => {
    if (!isVisible) {
      setHighlightedIndex(-1);
    }
  }, [isVisible]);

  React.useEffect(() => {
    onMenuOpenChange?.(isVisible);
  }, [isVisible, onMenuOpenChange]);

  useScrollMenuIntoScrollParent({
    containerRef,
    isVisible,
    enabled: scrollMenuIntoView,
    scrollContainerSelector,
  });

  const openMenu = React.useCallback(() => {
    if (!disabled) {
      setIsVisible(true);
    }
  }, [disabled]);

  const toggleMenu = React.useCallback(() => {
    if (disabled) return;
    if (isVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [closeMenu, disabled, isVisible, openMenu]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && container.contains(nextTarget)) {
        return;
      }

      requestAnimationFrame(() => {
        if (!container.contains(document.activeElement)) {
          closeMenu();
        }
      });
    };

    container.addEventListener("focusout", handleFocusOut);
    return () => {
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, [closeMenu]);

  const completeSingleOptionSelect = React.useCallback(() => {
    closeMenu();
    inputRef.current?.blur();
  }, [closeMenu]);

  const completeMultipleOptionSelect = React.useCallback(() => {
    setSearch("");
    inputRef.current?.focus();
  }, []);

  const selectOption = React.useCallback(
    (option: SelectOption<string>, onComplete: () => void) => {
      if (disabled) return;
      onOptionSelect(option);
      onComplete();
    },
    [disabled, onOptionSelect]
  );

  const commitHighlightedOption = React.useCallback(
    (onComplete: () => void) => {
      const option = filteredOptions[highlightedIndex];
      if (!option) return false;

      selectOption(option, onComplete);
      return true;
    },
    [filteredOptions, highlightedIndex, selectOption]
  );

  const boundSelectionOptions = React.useMemo(
    () => ({
      selectOption,
      commitHighlightedOption,
      disabled,
      isVisible,
      filteredOptionsLength: filteredOptions.length,
      closeMenu,
      openMenu,
      setHighlightedIndex,
    }),
    [
      closeMenu,
      commitHighlightedOption,
      disabled,
      filteredOptions.length,
      isVisible,
      openMenu,
      selectOption,
    ]
  );

  const {
    handleOptionSelect: handleSingleOptionSelect,
    handleInputKeyDown: handleSingleInputKeyDown,
  } = useBoundSelection({
    onComplete: completeSingleOptionSelect,
    ...boundSelectionOptions,
  });

  const {
    handleOptionSelect: handleMultipleOptionSelect,
    handleInputKeyDown: handleMultipleInputKeyDown,
  } = useBoundSelection({
    onComplete: completeMultipleOptionSelect,
    ...boundSelectionOptions,
  });

  const highlightOption = React.useCallback((index: number) => {
    setHighlightedIndex(index);
  }, []);

  const handleFieldPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;

      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      if (target.closest(".select-search__menu")) return;

      if (!target.closest("input")) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    },
    [disabled]
  );

  return {
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
    handleMultipleInputKeyDown,
    handleSingleOptionSelect,
    handleMultipleOptionSelect,
    handleFieldPointerDown,
  };
}
