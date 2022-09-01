import { ReactNode, useRef, useState } from "react";
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

  function focusFirstOption() {
    if (optionsRef.current?.children[0]) {
      optionsRef.current.children[0].focus();
    }
  }

  function focusSearch() {
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }

  const searchKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") {
      setFocused(false);
    } else {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        if (e.currentTarget) {
          focusFirstOption();
        }
      }
    }
  };

  const listKeyDownHandler = (
    option: T,
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const target = e.currentTarget;
    if (e.code === "Escape" || e.code === "Backspace") {
      e.preventDefault();
      focusSearch();
    } else if (e.code === "Enter") {
      e.preventDefault();
      if (target.nextElementSibling) {
        target.nextElementSibling.focus();
      }
      onClickHandler(option);
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      if (target.nextElementSibling) {
        target.nextElementSibling.focus();
      }
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      if (target.previousElementSibling) {
        target.previousElementSibling.focus();
      } else {
        focusSearch();
      }
    }
  };

  const onClickHandler = (option: T) => {
    onSelect && onSelect(option);
  };

  const searchBoxRef = useRef(null);
  const optionsRef = useRef(null);

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
          />
        </div>
      </div>
      {isFocused && (
        <div className={styles.optionsAnchor}>
          <div className={styles.optionsBox} ref={optionsRef}>
            {options.map((option) => {
              return (
                <button
                  className={styles.optionButton}
                  key={keyExtractor(option)}
                  onKeyDown={(e) => listKeyDownHandler(option, e)}
                  onClick={(e) => onClickHandler(option, e.currentTarget)}
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
