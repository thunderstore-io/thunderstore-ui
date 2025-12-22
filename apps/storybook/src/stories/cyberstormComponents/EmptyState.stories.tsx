import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

const meta = {
  title: "Cyberstorm/EmptyState",
  component: EmptyState.Root,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof EmptyState.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <EmptyState.Root>
      <EmptyState.Icon>
        <FontAwesomeIcon icon={faSearch} />
      </EmptyState.Icon>
      <EmptyState.Title>No results</EmptyState.Title>
      <EmptyState.Message>Try adjusting your filters.</EmptyState.Message>
    </EmptyState.Root>
  ),
};
