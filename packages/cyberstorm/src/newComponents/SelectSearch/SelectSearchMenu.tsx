import React from "react";

import type { SelectOption } from "../../utils/types";
import { SelectSearchItem } from "./SelectSearchItem";
import "./SelectSearchMenu.css";
import { getSelectSearchOptionId } from "./useSelectSearch";

const MENU_VIEWPORT_PADDING = 28;
const MENU_MIN_HEIGHT = 90;

function useViewportConstrainedMaxHeight(
  ref: React.RefObject<HTMLElement | null>,
  deps: unknown[]
) {
  const [maxHeight, setMaxHeight] = React.useState<number>();

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateMaxHeight = () => {
      const { top } = element.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;

      setMaxHeight(
        Math.max(viewportHeight - top - MENU_VIEWPORT_PADDING, MENU_MIN_HEIGHT)
      );
    };

    updateMaxHeight();

    window.addEventListener("resize", updateMaxHeight);
    window.addEventListener("scroll", updateMaxHeight, true);
    window.visualViewport?.addEventListener("resize", updateMaxHeight);
    window.visualViewport?.addEventListener("scroll", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
      window.removeEventListener("scroll", updateMaxHeight, true);
      window.visualViewport?.removeEventListener("resize", updateMaxHeight);
      window.visualViewport?.removeEventListener("scroll", updateMaxHeight);
    };
  }, deps);

  return maxHeight;
}

type SelectSearchMenuProps = {
  filteredOptions: SelectOption<string>[];
  menuId: string;
  highlightedIndex: number;
  onOptionSelect: (option: SelectOption<string>) => void;
  onOptionHighlight: (index: number) => void;
  isOptionSelected?: (option: SelectOption<string>) => boolean;
};

export function SelectSearchMenu({
  filteredOptions,
  menuId,
  highlightedIndex,
  onOptionSelect,
  onOptionHighlight,
  isOptionSelected,
}: SelectSearchMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const maxHeight = useViewportConstrainedMaxHeight(menuRef, [
    filteredOptions.length,
  ]);
  const menuStyle =
    maxHeight !== undefined ? { maxHeight: `${maxHeight}px` } : undefined;

  if (filteredOptions.length === 0) {
    return (
      <div
        id={menuId}
        ref={menuRef}
        className="select-search__menu select-search__no-options"
        role="status"
        style={menuStyle}
      >
        Nothing to choose from
      </div>
    );
  }

  return (
    <div
      id={menuId}
      ref={menuRef}
      className="select-search__menu"
      role="listbox"
      tabIndex={-1}
      style={menuStyle}
    >
      {filteredOptions.map((option, index) => (
        <SelectSearchItem
          key={option.value}
          id={getSelectSearchOptionId(menuId, index)}
          index={index}
          option={option}
          isHighlighted={index === highlightedIndex}
          isSelected={isOptionSelected?.(option) ?? false}
          onOptionSelect={onOptionSelect}
          onOptionHighlight={onOptionHighlight}
        />
      ))}
    </div>
  );
}
