import React from "react";

import type { SelectOption } from "../../utils/types";
import { classnames } from "../../utils/utils";
import "./SelectSearchItem.css";

type SelectSearchItemProps = {
  id: string;
  index: number;
  option: SelectOption<string>;
  isHighlighted: boolean;
  isSelected: boolean;
  onOptionSelect: (option: SelectOption<string>) => void;
  onOptionHighlight: (index: number) => void;
};

export function SelectSearchItem({
  id,
  index,
  option,
  isHighlighted,
  isSelected,
  onOptionSelect,
  onOptionHighlight,
}: SelectSearchItemProps) {
  const itemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isHighlighted) {
      itemRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isHighlighted]);

  const handleSelect = React.useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      onOptionSelect(option);
      event.stopPropagation();
    },
    [onOptionSelect, option]
  );

  const handleHighlight = React.useCallback(() => {
    onOptionHighlight(index);
  }, [index, onOptionHighlight]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleSelect(event);
    },
    [handleSelect]
  );

  return (
    <div
      id={id}
      ref={itemRef}
      className={classnames(
        "select-search__item",
        isHighlighted ? "select-search__item--highlighted" : null
      )}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleHighlight}
      onMouseDown={(e) => e.preventDefault()}
      role="option"
      tabIndex={-1}
      aria-selected={isSelected}
    >
      {option.label ?? option.value}
    </div>
  );
}
