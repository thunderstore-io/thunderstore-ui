"use client";
import styles from "./SearchSelect.module.css";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "../Icon/Icon";

type Option = {
  label: string;
  value: string;
};
type Props = {
  options: Option[];
};

const UnOverridableDiv: React.FC<JSX.IntrinsicElements["div"]> = (props) => {
  const { style: _, ...rest } = props;
  return <div className={styles.selectValueWrapper} {...rest} />;
};

type AdsProps = {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
} & { children: React.ReactNode };

const Chip: React.FC<AdsProps> = (props) => {
  const { children, onDelete } = props;

  return (
    <div className={styles.removeButtonWrapper}>
      {children}
      <button className={styles.removeButton} type="button" onClick={onDelete}>
        ✖️
      </button>
    </div>
  );
};

export const SearchSelect: React.FC<Props> = (props) => {
  const { options } = props;
  const [selected, setSelected] = React.useState<string[]>([]);
  const selectedItems = options.filter((o) => selected.includes(o.value));

  function addToList(v: string) {
    if (!(v in selected)) {
      setSelected([...selected, v]);
    }
  }

  function removeFromList(v: string) {
    setSelected(
      selected.filter((lv) => {
        lv !== v;
      })
    );
  }

  return (
    <Select.Root onValueChange={addToList}>
      <div className={styles.selectValueWrapper}>
        <Select.Value asChild>
          <UnOverridableDiv className={styles.comboBoxChipWrapper}>
            {selectedItems.map((item) => (
              <Chip
                key={item.value}
                onDelete={() => removeFromList(item.value)}
              >
                {item.label}
              </Chip>
            ))}
          </UnOverridableDiv>
        </Select.Value>
        <Select.Trigger>
          <Select.Icon>
            <Icon>
              <FontAwesomeIcon icon={faCaretDown} />
            </Icon>
          </Select.Icon>
        </Select.Trigger>
      </div>
      <Select.Portal>
        <Select.Content className={styles.selectContent}>
          <Select.Viewport>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
