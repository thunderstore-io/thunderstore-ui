import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import styles from "./componentStyles/DropDown.module.css";
import { Button } from "./Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type DropDownProps = {
  label?: string;
  icon?: ReactNode;
  defaultOpen: boolean;
  dropDownData?: DataItem[];
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultValue?: number;
};

type DataItem = {
  label: string;
  value: number;
  reactElement?: ReactElement;
};

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { icon, colorScheme, defaultOpen, dropDownData, defaultValue } = props;

  let initialValue = dropDownData ? dropDownData[0] : null;
  if (defaultValue && dropDownData && dropDownData[defaultValue]) {
    initialValue = dropDownData[defaultValue];
  }
  const [value, setValue] = useState(initialValue);
  const dropDownItemElements = mapDropDownData(
    dropDownData,
    colorScheme,
    setValue
  );

  return (
    <div className={styles.root}>
      <DropdownMenu.Root defaultOpen={defaultOpen}>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button
              colorScheme={colorScheme}
              rightIcon={icon}
              label={value ? value.label : ""}
            />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={"start"}
            sideOffset={8}
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
          >
            <DropdownMenu.Group className={styles.group}>
              {dropDownItemElements}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

DropDown.defaultProps = {
  dropDownData: [],
  defaultOpen: false,
  colorScheme: "default",
  defaultValue: 0,
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"dropDownIcon"}
    />
  ),
};

const getContentStyle = (scheme: DropDownProps["colorScheme"] = "default") => {
  return {
    default: styles.content__default,
    defaultDark: styles.content__defaultDark,
    primary: styles.content__primary,
  }[scheme];
};

const mapDropDownData = (
  dropDownData: DataItem[] | undefined,
  colorScheme: "default" | "defaultDark" | "primary" | undefined,
  setValue: React.Dispatch<React.SetStateAction<DataItem | null>>
) => {
  return dropDownData
    ? dropDownData.map((dataItem, index) => {
        return (
          <DropdownMenu.Item
            onSelect={() => setValue(dataItem)}
            key={index}
            asChild
          >
            <div>
              {dataItem.reactElement
                ? React.cloneElement(dataItem.reactElement, {
                    colorScheme: colorScheme,
                  })
                : null}
            </div>
          </DropdownMenu.Item>
        );
      })
    : null;
};
