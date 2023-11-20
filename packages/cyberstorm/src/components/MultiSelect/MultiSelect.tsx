"use client";
import styles from "./MultiSelect.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../..";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Option = {
  label: string;
  value: string;
};
type Props = {
  options: Option[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  onBlur: () => void;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  color?: "red" | "green";
};

export const MultiSelect = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { options, onChange, onBlur, placeholder, color } = props;

    const [list, setList] = React.useState<Option[]>([]);

    function add(incomingOption: Option) {
      if (!list.some((option) => option.value === incomingOption.value)) {
        setList([...list, incomingOption]);
      }
    }

    function remove(incomingOption: Option) {
      setList(list.filter((option) => option.value !== incomingOption.value));
    }

    React.useEffect(() => {
      onChange(list);
    }, [list]);

    const dropDownContent = options.map((option, key) => {
      return (
        <Button.Root
          key={key}
          onClick={() => add(option)}
          colorScheme="transparentDefault"
        >
          <Button.ButtonLabel>{option.label}</Button.ButtonLabel>
        </Button.Root>
      );
    });

    return (
      <div ref={ref} onBlur={onBlur}>
        <DropDown
          trigger={
            <div className={styles.selectBox} data-color={color}>
              {list.length === 0 ? placeholder : null}
              {list.map((item, key) => (
                <Button.Root
                  key={key}
                  onClick={() => remove(item)}
                  colorScheme={"default"}
                  paddingSize="small"
                  style={{ gap: "0.5rem" }}
                >
                  <Button.ButtonLabel>{item.label}</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faXmark} className={styles.icon} />
                  </Button.ButtonIcon>
                </Button.Root>
              ))}
            </div>
          }
          content={dropDownContent}
        />
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
