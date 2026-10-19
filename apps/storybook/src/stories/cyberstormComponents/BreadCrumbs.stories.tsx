import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Image,
  NewBreadCrumbs,
  NewBreadCrumbsItem,
} from "@thunderstore/cyberstorm";

import catHeim from "../assets/catheim.png";

const meta = {
  title: "Cyberstorm/BreadCrumbs",
  component: NewBreadCrumbs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof NewBreadCrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "300px" }}>
      <NewBreadCrumbs>
        <NewBreadCrumbsItem>Just Text</NewBreadCrumbsItem>
        <NewBreadCrumbsItem primitiveType="link" href="#">
          Category
        </NewBreadCrumbsItem>
        <NewBreadCrumbsItem primitiveType="link" href="#">
          Item
        </NewBreadCrumbsItem>
      </NewBreadCrumbs>
    </div>
  ),
};

export const WithCommunityIcon: Story = {
  render: () => (
    <div style={{ width: "400px" }}>
      <NewBreadCrumbs>
        <NewBreadCrumbsItem primitiveType="link" href="#">
          Communities
        </NewBreadCrumbsItem>
        <NewBreadCrumbsItem primitiveType="link" href="#">
          <Image
            src={catHeim}
            fallbackIcon={faGamepad}
            square
            alt=""
            rootClasses="breadcrumbs__community-icon"
          />
          Catheim
        </NewBreadCrumbsItem>
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
        <NewBreadCrumbsItem primitiveType="link" href="#">
          Category
        </NewBreadCrumbsItem>
        <NewBreadCrumbsItem primitiveType="link" href="#">
          Item
        </NewBreadCrumbsItem>
      </NewBreadCrumbs>
    </div>
  ),
};
