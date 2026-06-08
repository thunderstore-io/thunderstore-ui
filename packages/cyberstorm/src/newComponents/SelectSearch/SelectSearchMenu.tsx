import type { SelectOption } from "../../utils/types";
import { SelectSearchItem } from "./SelectSearchItem";
import "./SelectSearchMenu.css";
import { getSelectSearchOptionId } from "./useSelectSearch";

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
  if (filteredOptions.length === 0) {
    return (
      <div
        id={menuId}
        className="select-search__menu select-search__no-options"
        role="status"
      >
        Nothing to choose from
      </div>
    );
  }

  return (
    <div
      id={menuId}
      className="select-search__menu"
      role="listbox"
      tabIndex={-1}
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
