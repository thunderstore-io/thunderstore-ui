import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { Modal, NewButton } from "@thunderstore/cyberstorm";
import {
  ModalSizesList,
  ModalVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: ModalVariantsList },
    csSize: { control: "select", options: ModalSizesList },
    onOpenChange: { action: "onOpenChange" },
    defaultOpen: { control: "boolean" },
    trigger: { control: false },
    disableTitle: { control: "boolean" },
    disableBody: { control: "boolean" },
    disableFooter: { control: "boolean" },
    disableExit: { control: "boolean" },
    disableDefaultSubComponents: { control: "boolean" },
    titleContent: { control: "text" },
    footerContent: { control: "text" },
    ariaDescribedby: { control: "text" },
  },
  args: {
    csVariant: ModalVariantsList[0],
    csSize: ModalSizesList[0],
    trigger: <NewButton>Open modal</NewButton>,
    disableTitle: false,
    disableBody: false,
    disableFooter: false,
    disableExit: false,
    disableDefaultSubComponents: false,
    titleContent: "Modal Title",
    footerContent: "Modal Footer",
    ariaDescribedby: "modal-description",
  },
  render: (args) => <Modal {...args} />,
  parameters: {
    chromatic: { delay: 300 },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: false },
};

export const DisabledTitleDefaultSubComponents: Story = {
  args: {
    disableTitle: true,
    defaultOpen: true,
  },
};
export const DisabledBodyDefaultSubComponents: Story = {
  args: {
    disableBody: true,
    defaultOpen: true,
  },
};
export const DisabledFooterDefaultSubComponents: Story = {
  args: {
    disableFooter: true,
    defaultOpen: true,
  },
};
export const DisabledExitDefaultSubComponents: Story = {
  args: {
    disableExit: true,
    defaultOpen: true,
  },
};
export const DisabledAllDefaultSubComponents: Story = {
  args: {
    disableDefaultSubComponents: true,
    defaultOpen: true,
  },
};

export const VariantDefault: Story = {
  render: () => {
    const size = "small";
    const variant = "default";
    return (
      <Modal
        key={`${size}-${variant}`}
        csVariant={variant}
        csSize={size}
        defaultOpen={true}
      >
        <Modal.Title>
          {size}-{variant}
        </Modal.Title>
        <Modal.Body>
          {size}-{variant}
        </Modal.Body>
        <Modal.Footer>
          {size}-{variant}
        </Modal.Footer>
      </Modal>
    );
  },
};

export const SizeSmall: Story = {
  render: () => {
    const size = "small";
    const variant = "default";
    return (
      <Modal
        key={`${size}-${variant}`}
        csVariant={variant}
        csSize={size}
        defaultOpen={true}
      >
        <Modal.Title>
          {size}-{variant}
        </Modal.Title>
        <Modal.Body>
          {size}-{variant}
        </Modal.Body>
        <Modal.Footer>
          {size}-{variant}
        </Modal.Footer>
      </Modal>
    );
  },
};

export const SizeMedium: Story = {
  render: () => {
    const size = "medium";
    const variant = "default";
    return (
      <Modal
        key={`${size}-${variant}`}
        csVariant={variant}
        csSize={size}
        defaultOpen={true}
      >
        <Modal.Title>
          {size}-{variant}
        </Modal.Title>
        <Modal.Body>
          {size}-{variant}
        </Modal.Body>
        <Modal.Footer>
          {size}-{variant}
        </Modal.Footer>
      </Modal>
    );
  },
};

export const ModalTitle: Story = {
  render: (args) => {
    return (
      <Modal {...args} defaultOpen={true}>
        <Modal.Title className="custom-modal-title">
          Custom Modal Title
        </Modal.Title>
      </Modal>
    );
  },
};

export const ModalBody: Story = {
  render: (args) => {
    return (
      <Modal {...args} defaultOpen={true}>
        <Modal.Body className="custom-modal-body">Custom Modal Body</Modal.Body>
      </Modal>
    );
  },
};

export const ModalFooter: Story = {
  render: (args) => {
    return (
      <Modal {...args} defaultOpen={true}>
        <Modal.Footer className="custom-modal-footer">
          Custom Modal Footer
        </Modal.Footer>
      </Modal>
    );
  },
};
