import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Image,
  NewBreadCrumbs,
  NewBreadCrumbsItem,
  NewBreadCrumbsLink,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { faGamepad } from "@thunderstore/icons";

import catHeim from "../assets/catheim.png";

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
        <NewBreadCrumbsItem>Just Text</NewBreadCrumbsItem>
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

export const WithCommunityIcon: Story = {
  render: () => (
    <div style={{ width: "400px" }}>
      <NewBreadCrumbs>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          Communities
        </NewBreadCrumbsLink>
        <NewBreadCrumbsLink primitiveType="link" href="#">
          <Image
            src={catHeim}
            fallbackIcon={faGamepad}
            square
            alt=""
            rootClasses="breadcrumbs__community-icon"
          />
          Catheim
        </NewBreadCrumbsLink>
        <NewBreadCrumbsItem>Some Package</NewBreadCrumbsItem>
      </NewBreadCrumbs>
    </div>
  ),
};

export const Short: Story = {
  render: () => (
    <div style={{ width: "100px" }}>
      <NewBreadCrumbs>
        <NewBreadCrumbsItem>Just Text</NewBreadCrumbsItem>
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
