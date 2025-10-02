import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewIcon, Tabs } from "@thunderstore/cyberstorm";
import {
  TabsSizesList,
  TabsVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: TabsVariantsList },
    csSize: { control: "select", options: TabsSizesList },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: (args) => (
    <Tabs {...args}>
      <div className="tabs-item tabs-item--current" style={{ padding: 16 }}>
        Current
      </div>
      <div className="tabs-item" style={{ padding: 16 }}>
        Second
      </div>
      <div className="tabs-item" style={{ padding: 16 }}>
        Tab content goes here
      </div>
      <NewIcon
        csMode="inline"
        noWrapper
        rootClasses="tabs-item tabs-item--current"
      >
        <FontAwesomeIcon icon={faStar} />
      </NewIcon>
    </Tabs>
  ),
};
