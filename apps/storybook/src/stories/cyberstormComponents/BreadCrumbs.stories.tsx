import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewBreadCrumbs, NewBreadCrumbsLink } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/BreadCrumbs",
  component: NewBreadCrumbs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NewBreadCrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <NewBreadCrumbs>
        <span>
          <span>Just Text</span>
        </span>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          Category
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          Item
        </NewBreadCrumbsLink>
      </NewBreadCrumbs>
    </div>
  ),
};

export const Short: Story = {
  render: () => (
    <div style={{ width: "100px" }}>
      <NewBreadCrumbs>
        <span>
          <span>Just Text</span>
        </span>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          Category
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          Item
        </NewBreadCrumbsLink>
      </NewBreadCrumbs>
    </div>
  ),
};
