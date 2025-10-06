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
    open: { control: "boolean" },
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
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const DisabledTitleDefaultSubComponents: Story = {
  args: {
    disableTitle: true,
    open: true,
  },
};
export const DisabledBodyDefaultSubComponents: Story = {
  args: {
    disableBody: true,
    open: true,
  },
};
export const DisabledFooterDefaultSubComponents: Story = {
  args: {
    disableFooter: true,
    open: true,
  },
};
export const DisabledExitDefaultSubComponents: Story = {
  args: {
    disableExit: true,
    open: true,
  },
};
export const DisabledAllDefaultSubComponents: Story = {
  args: {
    disableDefaultSubComponents: true,
    open: true,
  },
};

export const Variants: Story = {
  render: () => {
    const size = "small";
    return (
      <>
        {ModalVariantsList.map((variant) => (
          <Modal
            key={`${size}-${variant}`}
            csVariant={variant}
            csSize={size}
            open={true}
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
        ))}
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const variant = "default";
    return (
      <>
        {ModalSizesList.map((size) => (
          <Modal
            key={`${size}-${variant}`}
            csVariant={variant}
            csSize={size}
            open={true}
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
        ))}
      </>
    );
  },
};

export const ModalTitle: Story = {
  render: (args) => {
    return (
      <Modal {...args} open={true}>
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
      <Modal {...args} open={true}>
        <Modal.Body className="custom-modal-body">Custom Modal Body</Modal.Body>
      </Modal>
    );
  },
};

export const ModalFooter: Story = {
  render: (args) => {
    return (
      <Modal {...args} open={true}>
        <Modal.Footer className="custom-modal-footer">
          Custom Modal Footer
        </Modal.Footer>
      </Modal>
    );
  },
};
