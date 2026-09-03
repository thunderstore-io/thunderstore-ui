import React from "react";

import type { SelectOption } from "../../utils/types";
import { SelectSearchItem } from "./SelectSearchItem";
import "./SelectSearchMenu.css";
import { getSelectSearchOptionId } from "./useSelectSearch";

const MENU_VIEWPORT_PADDING = 28;
const MENU_MIN_HEIGHT = 90;
const MENU_ANCHOR_GAP = 8;

function useViewportConstrainedMenuStyle(
  anchorRef: React.RefObject<HTMLElement | null>,
  deps: unknown[]
) {
  const [style, setStyle] = React.useState<React.CSSProperties>();

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const updateStyle = () => {
      const { bottom, left, width } = anchor.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const top = bottom + MENU_ANCHOR_GAP;

      setStyle({
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${Math.max(
          viewportHeight - top - MENU_VIEWPORT_PADDING,
          MENU_MIN_HEIGHT
        )}px`,
      });
    };

    updateStyle();

    window.addEventListener("resize", updateStyle);
    window.addEventListener("scroll", updateStyle, true);
    window.visualViewport?.addEventListener("resize", updateStyle);
    window.visualViewport?.addEventListener("scroll", updateStyle);

    return () => {
      window.removeEventListener("resize", updateStyle);
      window.removeEventListener("scroll", updateStyle, true);
      window.visualViewport?.removeEventListener("resize", updateStyle);
      window.visualViewport?.removeEventListener("scroll", updateStyle);
    };
  }, deps);

  return style;
}

function useShowMenuInTopLayer(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu?.showPopover) return;

    menu.showPopover();

    return () => {
      if (menu.isConnected) {
        menu.hidePopover();
      }
    };
  }, [ref]);
}

type SelectSearchMenuProps = {
  filteredOptions: SelectOption<string>[];
  menuId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  highlightedIndex: number;
  onOptionSelect: (option: SelectOption<string>) => void;
  onOptionHighlight: (index: number) => void;
  isOptionSelected?: (option: SelectOption<string>) => boolean;
};

export function SelectSearchMenu({
  filteredOptions,
  menuId,
  anchorRef,
  highlightedIndex,
  onOptionSelect,
  onOptionHighlight,
  isOptionSelected,
}: SelectSearchMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuStyle = useViewportConstrainedMenuStyle(anchorRef, [
    filteredOptions.length,
  ]);
  useShowMenuInTopLayer(menuRef);

  if (filteredOptions.length === 0) {
    return (
      <div
        id={menuId}
        ref={menuRef}
        className="select-search__menu select-search__no-options"
        role="status"
        style={menuStyle}
        popover="manual"
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
      popover="manual"
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
