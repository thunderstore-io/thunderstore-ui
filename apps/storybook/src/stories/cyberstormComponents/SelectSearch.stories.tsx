import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  NewSelectSearchMultiple,
  type NewSelectSearchMultipleProps,
  NewSelectSearchSingle,
  type NewSelectSearchSingleProps,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  SelectSearchModifiersList,
  SelectSearchSizesList,
  SelectSearchVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/SelectSearch",
  component: NewSelectSearchSingle,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: SelectSearchVariantsList },
    csSize: { control: "select", options: SelectSearchSizesList },
    csModifiers: {
      control: "multi-select",
      options: SelectSearchModifiersList,
    },
    options: { control: "object" },
    value: { control: "object" },
  },
  args: {
    options: [
      { value: "1", label: "One" },
      { value: "2", label: "Two" },
      { value: "3", label: "Three" },
    ] as SelectOption<string>[],
    onChange: () => {},
    value: undefined,
    defaultOpen: true,
  },
} satisfies Meta<typeof NewSelectSearchSingle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {},
  render: (args) => <SingleComponent args={args} />,
};

function SingleComponent(props: { args: NewSelectSearchSingleProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string> | undefined>(undefined);
  const [val2, setVal2] = useState<SelectOption<string> | undefined>(
    args.options[1]
  );
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      <NewSelectSearchSingle {...args} value={val} onChange={setVal} />
      <NewSelectSearchSingle {...args} value={val2} onChange={setVal2} />
    </div>
  );
}

export const Multiple: Story = {
  args: {},
  render: (args) => (
    <MultipleComponent args={args as NewSelectSearchMultipleProps} />
  ),
};

function MultipleComponent(props: { args: NewSelectSearchMultipleProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string>[] | undefined>(undefined);
  const [val2, setVal2] = useState<SelectOption<string>[] | undefined>(
    args.options.slice(1)
  );
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      <NewSelectSearchMultiple {...args} value={val} onChange={setVal} />
      <NewSelectSearchMultiple {...args} value={val2} onChange={setVal2} />
    </div>
  );
}

export const Variants: Story = {
  args: {},
  render: (args) => <VariantsComponent args={args} />,
};

function VariantsComponent(props: { args: NewSelectSearchSingleProps }) {
  const { args } = props;
  const [val, setVal] = useState<{ value: string; label?: string } | undefined>(
    undefined
  );
  const variants = SelectSearchVariantsList.map((variant) => (
    <div
      key={variant}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>{variant}</span>
      <NewSelectSearchSingle
        {...args}
        csVariant={variant}
        value={val}
        onChange={setVal}
      />
    </div>
  ));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12rem" }}>
      {variants}
    </div>
  );
}

export const Sizes: Story = {
  args: {},
  render: (args) => (
    <SizesComponent args={args as NewSelectSearchMultipleProps} />
  ),
};

function SizesComponent(props: { args: NewSelectSearchMultipleProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string>[] | undefined>(undefined);
  const sizes = SelectSearchSizesList.map((size) => (
    <div
      key={size}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>{size}</span>
      <NewSelectSearchMultiple
        {...args}
        csSize={size}
        value={val}
        onChange={setVal}
      />
    </div>
  ));
  return <div style={{ display: "flex", gap: "12rem" }}>{sizes}</div>;
}

export const Modifiers: Story = {
  args: {},
  render: (args) => (
    <ModifiersComponent args={args as NewSelectSearchMultipleProps} />
  ),
};

function ModifiersComponent(props: { args: NewSelectSearchMultipleProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string>[] | undefined>(undefined);
  const modifiers = SelectSearchModifiersList.map((modifier) => (
    <div
      key={modifier}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>{modifier}</span>
      <NewSelectSearchMultiple
        {...args}
        csModifiers={[modifier]}
        value={val}
        onChange={setVal}
      />
    </div>
  ));
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      {modifiers}
    </div>
  );
}
