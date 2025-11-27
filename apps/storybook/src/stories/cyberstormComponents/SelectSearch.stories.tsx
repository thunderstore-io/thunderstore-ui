import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import {
  NewSelectSearch,
  type NewSelectSearchProps,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import { useState } from "react";
import {
  SelectSearchModifiersList,
  SelectSearchSizesList,
  SelectSearchVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/SelectSearch",
  component: NewSelectSearch,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: SelectSearchVariantsList },
    csSize: { control: "select", options: SelectSearchSizesList },
    csModifiers: {
      control: "multi-select",
      options: SelectSearchModifiersList,
    },
    multiple: { control: "boolean" },
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
    multiple: false,
    defaultOpen: true,
  },
} satisfies Meta<typeof NewSelectSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {},
  render: (args) => <SingleComponent args={args} />,
};

function SingleComponent(props: { args: NewSelectSearchProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string> | undefined>(undefined);
  const [val2, setVal2] = useState<SelectOption<string> | undefined>(
    args.options[1]
  );
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      <NewSelectSearch
        {...args}
        value={val}
        onChange={setVal}
        multiple={false}
      />
      <NewSelectSearch
        {...args}
        value={val2}
        onChange={setVal2}
        multiple={false}
      />
    </div>
  );
}

export const Multiple: Story = {
  args: {},
  render: (args) => <MultipleComponent args={args} />,
};

function MultipleComponent(props: { args: NewSelectSearchProps }) {
  const { args } = props;
  const [val, setVal] = useState<SelectOption<string>[] | undefined>(undefined);
  const [val2, setVal2] = useState<SelectOption<string>[] | undefined>(
    args.options.slice(1)
  );
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      <NewSelectSearch {...args} multiple value={val} onChange={setVal} />
      <NewSelectSearch {...args} multiple value={val2} onChange={setVal2} />
    </div>
  );
}

export const Variants: Story = {
  args: {},
  render: (args) => <VariantsComponent args={args} />,
};

function VariantsComponent(props: { args: NewSelectSearchProps }) {
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
      <NewSelectSearch
        {...args}
        csVariant={variant}
        multiple={false}
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
  render: (args) => <SizesComponent args={args} />,
};

function SizesComponent(props: { args: NewSelectSearchProps }) {
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
      <NewSelectSearch
        {...args}
        csSize={size}
        value={val}
        onChange={setVal}
        multiple={true}
      />
    </div>
  ));
  return <div style={{ display: "flex", gap: "12rem" }}>{sizes}</div>;
}

export const Modifiers: Story = {
  args: {},
  render: (args) => <ModifiersComponent args={args} />,
};

function ModifiersComponent(props: { args: NewSelectSearchProps }) {
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
      <NewSelectSearch
        {...args}
        csModifiers={[modifier]}
        value={val}
        onChange={setVal}
        multiple={true}
      />
    </div>
  ));
  return (
    <div style={{ display: "flex", gap: "12rem", flexDirection: "column" }}>
      {modifiers}
    </div>
  );
}
