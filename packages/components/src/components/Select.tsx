import {
  Box,
  Collapse,
  ComponentMultiStyleConfig,
  Flex,
  Input,
  List,
  ListItem,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionStateChange,
} from "downshift";
import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "./Icons";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps<T extends SelectOption = SelectOption> {
  options: T[];
  disabled?: boolean;
  onChange(option: T | null): void;
}

/**
 * Select element that supports filtering options by text search.
 */
export const Select = <T extends SelectOption = SelectOption>({
  options,
  disabled = false,
  onChange,
}: SelectProps<T>): JSX.Element => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const lastSelectedLabel = useRef<string | null>(null);

  const highlightedBackground = useColorModeValue("blue.500", "blue.300");

  const filterOptions = (inputValue: string) => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().startsWith(inputValue.toLowerCase())
      )
    );
  };

  const {
    isOpen,
    openMenu,
    closeMenu,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: filteredOptions,
    itemToString: (option) => option?.label || "",
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem);
        lastSelectedLabel.current = selectedItem?.label || null;
      }
    },
    onInputValueChange: ({ inputValue }) => {
      filterOptions(inputValue || "");
      if (lastSelectedLabel.current !== inputValue) onChange(null);
    },
  });

  useEffect(() => {
    disabled && closeMenu();
  }, [disabled]);

  return (
    <>
      {/* Input */}
      <Box {...getComboboxProps()}>
        <Input
          placeholder="Search..."
          disabled={disabled}
          {...getInputProps({
            onClick: isOpen ? () => undefined : openMenu,
            onFocus: isOpen ? () => undefined : openMenu,
          })}
        />
      </Box>
      {/* Combobox */}
      <Collapse in={isOpen && filteredOptions.length > 0} animateOpacity={true}>
        <Box borderWidth="1px" borderRadius="md" mt={1}>
          <List {...getMenuProps()}>
            {filteredOptions.map((option, index) => (
              <ListItem
                key={`${option.value}${index}`}
                bg={
                  highlightedIndex === index ? highlightedBackground : "inherit"
                }
                px={2}
                py={1}
                {...getItemProps({ item: option, index })}
              >
                {option.label}
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </>
  );
};

export interface MultiSelectProps<T extends SelectOption = SelectOption> {
  disabled?: boolean;
  inputId?: string;
  onChange(options: T[]): void;
  /** All options available for selecting. */
  options: T[];
  /**
   * Currently selected options.
   *
   * Omit the property to let MultiSelect handle the state internally.
   */
  selectedOptions?: T[];
  /** Chakra-UI's component size variant identifier. */
  size?: string;
}

/**
 * Multiselect element that supports filtering options by text search.
 *
 * Selected options are shown as tags above the select component.
 */
export const MultiSelect = <T extends SelectOption = SelectOption>({
  disabled = false,
  inputId,
  onChange,
  options,
  selectedOptions,
  size,
}: MultiSelectProps<T>): JSX.Element => {
  const [searchInput, setSearchInput] = useState("");
  const styles = useMultiStyleConfig("MultiSelect", { size });
  const usesInternalState = selectedOptions === undefined;
  const onSelectedItemsChange = (changes: UseMultipleSelectionStateChange<T>) =>
    onChange(changes.selectedItems ?? []);

  const multipleSelectionHookProps = usesInternalState
    ? { onSelectedItemsChange }
    : { onSelectedItemsChange, selectedItems: selectedOptions };

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<T>(multipleSelectionHookProps);

  const selectedItemsValues = selectedItems.map((option) => option.value);

  const filteredOptions = options.filter((option) => {
    return (
      selectedItemsValues.indexOf(option.value) < 0 &&
      option.label.toLowerCase().startsWith(searchInput.toLowerCase())
    );
  });

  const {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    selectedItem: null,
    inputId,
    items: filteredOptions,
    itemToString: (option) => option?.label || "",
    stateReducer: (_, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true,
          };
      }
      return changes;
    },
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setSearchInput(inputValue || "");
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setSearchInput("");
            addSelectedItem(selectedItem);
          }
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    disabled && closeMenu();
  }, [disabled]);

  return (
    <>
      {/* Container */}
      <Flex {...getComboboxProps()} __css={styles.container}>
        {/* Selected options */}
        <Flex flex="0 1 auto" flexWrap="wrap">
          {selectedItems.map((selectedItem, index) => (
            <Tag
              key={`selected-item-${index}`}
              title={selectedItem.label}
              variant="multiselect"
              {...getSelectedItemProps({ selectedItem, index })}
            >
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                isDisabled={disabled}
                onClick={() => {
                  if (usesInternalState) {
                    removeSelectedItem(selectedItem);
                  } else {
                    onChange(
                      selectedItems.filter(
                        (item) => item.value !== selectedItem.value
                      )
                    );
                  }
                }}
              />
            </Tag>
          ))}
        </Flex>

        <Flex alignItems="center" flex="1 1 auto" mb="5px">
          <Input
            disabled={disabled}
            id={inputId ?? ""}
            placeholder="Search..."
            {...getInputProps(
              getDropdownProps({
                preventKeyAction: isOpen,
                onClick: isOpen ? () => undefined : openMenu,
                onFocus: isOpen ? () => undefined : openMenu,
              })
            )}
            border="none"
            height="34px"
          />

          <ChevronDown
            onClick={toggleMenu}
            boxSize="12px"
            cursor="pointer"
            flex="0 0 42px"
          />
        </Flex>
      </Flex>

      {/* Combobox i.e. dropdown */}
      <Collapse
        animateOpacity={false}
        in={isOpen && filteredOptions.length > 0}
      >
        <Box __css={styles.dropdown}>
          <List {...getMenuProps()}>
            {filteredOptions.map((option, index) => (
              <ListItem
                key={`${option.value}${index}`}
                bg={highlightedIndex === index ? "ts.lightBlue" : "inherit"}
                color={highlightedIndex === index ? "ts.babyBlue" : "inherit"}
                px={2}
                py={1}
                {...getItemProps({ item: option, index })}
              >
                {option.label}
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </>
  );
};

export const MultiSelectStyles: ComponentMultiStyleConfig = {
  baseStyle: {
    container: {
      alignItems: "center",
      bgColor: "ts.darkBlue",
      borderRadius: 3,
      color: "ts.white",
      display: "flex",
      flexWrap: "wrap",
      minHeight: "44px",
      padding: "5px 0 0 5px",
      position: "relative",
    },
    dropdown: {
      bgColor: "ts.darkBlue",
      color: "ts.white",
      cursor: "pointer",
      maxHeight: "272px", // 10x list item height
      overflowY: "auto",
      position: "absolute",
      width: "calc(100% - 40px);", // 40px = content area padding
      zIndex: 1,
    },
  },
  defaultProps: {
    size: "md",
  },
  sizes: {
    md: {
      container: {
        maxWidth: "600px",
        minWidth: "300px",
      },
      dropdown: {
        maxWidth: "600px",
        minWidth: "300px",
      },
    },
    full: {
      container: { width: "100%" },
    },
  },
  parts: ["container", "dropdown"],
};
