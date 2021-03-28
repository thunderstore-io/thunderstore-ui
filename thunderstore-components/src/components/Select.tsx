import {
  Box,
  Collapse,
  Input,
  List,
  ListItem,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCombobox, useMultipleSelection } from "downshift";
import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps<T extends SelectOption = SelectOption> {
  options: T[];
  disabled?: boolean;
  onChange(option: T | null): void;
}

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
                bg={highlightedIndex === index ? highlightedBackground : "inherit"}
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
  options: T[];
  disabled?: boolean;
  onChange(options: T[]): void;
}

export const MultiSelect = <T extends SelectOption = SelectOption>({
  options,
  disabled = false,
  onChange,
}: MultiSelectProps<T>): JSX.Element => {
  const [searchInput, setSearchInput] = useState("");
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<T>({
    onSelectedItemsChange: (e) => {
      if (e.selectedItems) onChange(e.selectedItems);
      else onChange([]);
    },
  });

  const selectedItemsValues = selectedItems.map((option) => option.value);

  const highlightedBackground = useColorModeValue("blue.500", "blue.300");

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
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    selectedItem: null,
    items: filteredOptions,
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
      {/* Selected options */}
      {selectedItems.length > 0 && (
        <Stack spacing={1} isInline={true} wrap="wrap">
          {selectedItems.map((selectedItem, index) => (
            <Tag
              key={`selected-item-${index}`}
              size="md"
              borderRadius="full"
              variant="solid"
              mb={1}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                isDisabled={disabled}
                onClick={() => {
                  removeSelectedItem(selectedItem);
                }}
              />
            </Tag>
          ))}
        </Stack>
      )}
      {/* Input */}
      <Box {...getComboboxProps()}>
        <Input
          disabled={disabled}
          {...getInputProps(
            getDropdownProps({
              preventKeyAction: isOpen,
              onClick: isOpen ? () => undefined : openMenu,
              onFocus: isOpen ? () => undefined : openMenu,
            })
          )}
        />
      </Box>
      {/* Combobox */}
      <Collapse in={isOpen && filteredOptions.length > 0} animateOpacity={true}>
        <Box borderWidth="1px" borderRadius="md" mt={1}>
          <List {...getMenuProps()}>
            {filteredOptions.map((option, index) => (
              <ListItem
                key={`${option.value}${index}`}
                bg={highlightedIndex === index ? highlightedBackground : "inherit"}
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
