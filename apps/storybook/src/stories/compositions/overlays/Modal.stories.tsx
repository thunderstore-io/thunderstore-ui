import { Button } from "@cs/newComponents/Button/Button";
import { Modal } from "@cs/newComponents/Modal/Modal";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortalFrame, SideBySide, compositionParameters } from "../compare";

/**
 * Open modal. The closed trigger is in Compositions/Listings.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/Modal",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Open modal, portaled into this column. The closed trigger lives in Compositions/Listings. This story is separate because an open modal is position fixed and scroll-locks the document, which would shift both columns of a shared page canvas. Medium and small, plus a dialog with the title hidden and one with the close button hidden, are each open inside their own frame so they do not cover each other. The full dialog shows the title, body, footer, and close button.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenModal({
  size,
  title,
  children,
  disableTitle,
  disableExit,
}: {
  size: "medium" | "small";
  title: string;
  children: string;
  disableTitle?: boolean;
  disableExit?: boolean;
}) {
  return (
    <PortalFrame minHeight={240}>
      <Modal
        open
        csSize={size}
        trigger={<Button csVariant="secondary">{title}</Button>}
        titleContent={title}
        footerContent="Close"
        disableTitle={disableTitle}
        disableExit={disableExit}
      >
        {children}
      </Modal>
    </PortalFrame>
  );
}

function OpenModals() {
  return (
    <div className="cs-page">
      <div className="cs-compare__split">
        <OpenModal size="medium" title="Report package">
          This package breaks multiplayer.
        </OpenModal>
        <OpenModal size="small" title="Small">
          Small dialog.
        </OpenModal>
      </div>
      <div className="cs-compare__split">
        <OpenModal size="medium" title="No title" disableTitle>
          Body stays visible.
        </OpenModal>
        <OpenModal size="medium" title="No exit" disableExit>
          The close button is hidden.
        </OpenModal>
      </div>
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenModals />} />,
};
