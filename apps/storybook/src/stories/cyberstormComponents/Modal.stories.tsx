import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { Modal, NewButton, type ModalProps } from "@thunderstore/cyberstorm";
import {
  ModalSizesList,
  ModalVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";
import { useEffect } from "react";

const meta = {
  title: "Cyberstorm/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: ModalVariantsList },
    csSize: { control: "select", options: ModalSizesList },
  },
  args: {
    csVariant: ModalVariantsList[0],
    csSize: ModalSizesList[0],
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    popoverId: "modal-1",
    trigger: (
      <NewButton popoverTarget="modal-1" popoverTargetAction="show">
        Open modal
      </NewButton>
    ),
  },
  render: (args) => <DefaultComponent args={args} />,
};

function DefaultComponent(props: { args: ModalProps }) {
  const { args } = props;
  useEffect(() => {
    const modalElement = document.getElementById(args.popoverId);
    if (!modalElement) return;
    modalElement.showPopover();
  }, [args.popoverId]);
  return (
    <Modal id={args.popoverId} {...args}>
      <div style={{ padding: 16 }}>Modal content</div>
    </Modal>
  );
}

export const SmallSize: Story = {
  args: {
    popoverId: "modal-2",
    trigger: (
      <NewButton popoverTarget="modal-2" popoverTargetAction="show">
        Open modal
      </NewButton>
    ),
    csSize: ModalSizesList[1],
  },
  render: (args) => <SmallSizeComponent args={args} />,
};

function SmallSizeComponent(props: { args: ModalProps }) {
  const { args } = props;
  useEffect(() => {
    const modalElement = document.getElementById(args.popoverId);
    if (!modalElement) return;
    modalElement.showPopover();
  }, [args.popoverId]);
  return (
    <Modal id={args.popoverId} {...args}>
      <div style={{ padding: 16 }}>Modal content</div>
    </Modal>
  );
}
