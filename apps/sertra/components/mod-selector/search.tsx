import { ReactNode, useRef, useState } from "react";
import { ModPackage } from "../../api/models";
import styles from "./search.module.css";

interface SearchBoxProps<T> {
  placeholder?: string;
  renderOption: (option: T) => ReactNode;
  keyExtractor: (option: T) => string | number;
  options: T[];
  onSelect?: (option: T) => void;
}

export const SearchBox = <T,>({
  placeholder,
  renderOption,
  keyExtractor,
  options,
  onSelect,
}: SearchBoxProps<T>) => {
  const [isFocused, setFocused] = useState<boolean>(false);

  const [filteredOptions, setfilteredOptions] = useState(options);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const results = options.filter((option) => {
      if (option.ownerName.toLowerCase().includes(e.target.value.toLowerCase()))
        return option;
      if (
        option.packageName.toLowerCase().includes(e.target.value.toLowerCase())
      )
        return option;
    });
    setfilteredOptions(results);
  };

  function focusFirstOption() {
    optionRef.current?.focus();
  }

  function focusSearch() {
    searchBoxRef.current?.focus();
  }

  const searchKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") {
      setFocused(false);
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      focusFirstOption();
    }
  };

  type FocusableElement = Element & { focus?: () => void };

  const listKeyDownHandler = (
    option: T,
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const target = e.currentTarget;
    if (e.code === "Escape" || e.code === "Backspace") {
      e.preventDefault();
      focusSearch();
    } else if (e.code === "Enter") {
      const nes = target.nextElementSibling as FocusableElement;
      if (typeof nes?.focus === "function") {
        e.preventDefault();
        nes?.focus();
        onClickHandler(option);
      }
    } else if (e.code === "ArrowDown") {
      const nes = target.nextElementSibling as FocusableElement;
      if (typeof nes?.focus === "function") {
        e.preventDefault();
        nes?.focus();
      }
    } else if (e.code === "ArrowUp") {
      const pes = target.previousElementSibling as FocusableElement;
      if (typeof pes?.focus === "function") {
        e.preventDefault();
        pes ? pes.focus() : focusSearch();
      }
    }
  };

  const onClickHandler = (option: T) => {
    onSelect && onSelect(option);
  };

  const searchBoxRef = useRef<HTMLInputElement>(null);
  const optionRef = useRef<HTMLButtonElement>(null);

  const usedOptions = filteredOptions.length === 0 ? options : filteredOptions;

  return (
    <div
      className={styles.searchField}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <div className={styles.searchBox}>
        <div className={styles.searchIcon}>🔍</div>
        <div className={styles.searchInputArea}>
          <input
            ref={searchBoxRef}
            onKeyDown={searchKeyDownHandler}
            className={styles.searchInput}
            type={"text"}
            placeholder={placeholder}
            onChange={handleChange}
          />
        </div>
      </div>
      {isFocused && (
        <div className={styles.optionsAnchor}>
          <div className={styles.optionsBox}>
            {usedOptions.map((option, i) => {
              return (
                <button
                  ref={i === 0 ? optionRef : null}
                  className={styles.optionButton}
                  key={keyExtractor(option)}
                  onKeyDown={(e) => listKeyDownHandler(option, e)}
                  onClick={() => onClickHandler(option)}
                >
                  {renderOption(option)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
