import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommunityNotifications } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

const meta = {
  title: "Cyberstorm/CommunityNotifications",
  component: CommunityNotifications,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    notifications: [
      {
        type: "critical",
        content:
          "Scheduled maintenance is ongoing. See the [status page](https://status.thunderstore.io) for updates.",
      },
      {
        type: "warning",
        content:
          "Some packages are being re-indexed and may be temporarily missing from the list.",
      },
      {
        type: "info",
        content:
          "New to modding? Browse [all communities](/communities/) to discover more games.",
      },
    ],
  },
} satisfies Meta<typeof CommunityNotifications>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const SingleInfo: Story = {
  args: {
    notifications: [
      {
        type: "info",
        content: "Welcome to the community! Have a look around.",
      },
    ],
  },
};

export const AllSeverities: Story = {
  args: {
    notifications: [
      { type: "critical", content: "Critical: something needs attention." },
      { type: "warning", content: "Warning: proceed with caution." },
      { type: "info", content: "Info: just so you know." },
    ],
  },
};

// Internal targets (/...) render as client-side links; external http(s) targets
// open in a new tab. Unsupported targets are left as plain text.
export const WithLinks: Story = {
  args: {
    notifications: [
      {
        type: "info",
        content:
          "Read the [wiki](https://wiki.thunderstore.io) or jump to [all communities](/communities/).",
      },
      {
        type: "warning",
        content:
          "Unsupported link targets stay as text: [do not click](javascript:alert(1)).",
      },
    ],
  },
};

// The component renders nothing when there are no notifications.
export const Empty: Story = {
  args: { notifications: [] },
};
