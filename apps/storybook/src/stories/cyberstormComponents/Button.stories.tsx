import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewButton } from "@thunderstore/cyberstorm";
// import { fn } from 'storybook/test';
import "@thunderstore/cyberstorm-theme";
import {
  ButtonModifiersList,
  ButtonSizesList,
  ButtonVariantsList,
} from "@thunderstore/cyberstorm-theme";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Cyberstorm/Button",
  component: NewButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    primitiveType: {
      control: "select",
      options: ["button", "link", "cyberstormLink"],
    },
    csVariant: {
      control: "select",
      options: ButtonVariantsList,
    },
    csSize: {
      control: "select",
      options: ButtonSizesList,
    },
    csModifiers: { control: "multi-select", options: ButtonModifiersList },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    primitiveType: "button",
    children: <>Button</>,
  },
} satisfies Meta<typeof NewButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: () => {
    const size = "medium";
    return (
      <>
        {ButtonVariantsList.map((variant) => (
          <NewButton
            key={`${size}-${variant}`}
            csVariant={variant}
            csSize={size}
          >
            {size}-{variant}
          </NewButton>
        ))}
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const variant = "primary";
    return (
      <>
        {ButtonSizesList.map((size) => (
          <NewButton
            key={`${size}-${variant}`}
            csVariant={variant}
            csSize={size}
          >
            {size}-{variant}
          </NewButton>
        ))}
      </>
    );
  },
};

export const Primitives: Story = {
  render: () => {
    const variant = "primary";
    const size = "medium";
    return (
      <>
        <NewButton
          key={`${size}-${variant}-button`}
          csVariant={variant}
          csSize={size}
          primitiveType="button"
        >
          {size}-{variant}-button
        </NewButton>
        <NewButton
          key={`${size}-${variant}-link`}
          csVariant={variant}
          csSize={size}
          primitiveType="link"
          href="https://thunderstore.io"
        >
          {size}-{variant}-link
        </NewButton>
        <NewButton
          key={`${size}-${variant}-cyberstormLink`}
          csVariant={variant}
          csSize={size}
          primitiveType="cyberstormLink"
          linkId="Communities"
        >
          {size}-{variant}-cyberstormLink
        </NewButton>
      </>
    );
  },
};
