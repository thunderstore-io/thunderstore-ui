import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageFlag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/PackageFlag",
  component: PackageFlag,
} as ComponentMeta<typeof PackageFlag>;

const defaultArgs = {
  label: "-",
};

const Template: ComponentStory<typeof PackageFlag> = (args) => (
  <div style={{ display: "flex" }}>
    <PackageFlag {...args} />
  </div>
);

const DefaultPackageFlag = Template.bind({});
DefaultPackageFlag.args = {
  ...defaultArgs,
  label: "Pinned",
  icon: <FontAwesomeIcon fixedWidth icon={faThumbTack} />,
};

export { meta as default, DefaultPackageFlag };
