import type { Meta, StoryObj } from "@storybook/react-vite";

import { LocalDateTime } from "@thunderstore/cyberstorm";

/**
 * Not in a composition. After mount the label follows the viewer's timezone,
 * so a Chromatic capture would not stay stable. Snapshots are off here too.
 */
const meta = {
  title: "Cyberstorm/LocalDateTime",
  component: LocalDateTime,
  tags: ["autodocs"],
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "The first paint is a fixed en-US UTC string. After mount it switches to the viewer's locale and timezone. This story is for browsing only. It is not in a composition, and Chromatic does not snapshot it.",
      },
    },
  },
  args: { time: "1970-01-01T00:00:00.000Z" },
} satisfies Meta<typeof LocalDateTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
