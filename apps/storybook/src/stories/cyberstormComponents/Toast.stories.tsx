import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  ToastSizesList,
  ToastVariantsList,
} from "@thunderstore/cyberstorm-theme";

// Note: The default export from Toast has .Provider and .Viewport attached
const meta = {
  title: "Cyberstorm/Toast",
  component: Toast.Toast,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: ToastVariantsList },
    csSize: { control: "select", options: ToastSizesList },
  },
  args: { children: "Hello toast!", id: "toast-1" },
  render: (args) => (
    <Toast.Provider toastDuration={30000}>
      <Toast.Toast {...args} />
    </Toast.Provider>
  ),
} satisfies Meta<typeof Toast.Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Variants: Story = {
  args: { id: "toast-variant" },
  render: (args) => {
    const toastVariants = ToastVariantsList.map((variant) => (
      <Toast.Toast key={variant} {...args} csVariant={variant}>
        Toast {variant}
      </Toast.Toast>
    ));
    return (
      <Toast.Provider toastDuration={30000}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {toastVariants}
        </div>
      </Toast.Provider>
    );
  },
};

export const Sizes: Story = {
  args: { id: "toast-size" },
  render: (args) => {
    const toastSizes = ToastSizesList.map((size) => (
      <Toast.Toast key={size} {...args} csSize={size}>
        Toast {size}
      </Toast.Toast>
    ));
    return (
      <Toast.Provider toastDuration={30000}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {toastSizes}
        </div>
      </Toast.Provider>
    );
  },
};
