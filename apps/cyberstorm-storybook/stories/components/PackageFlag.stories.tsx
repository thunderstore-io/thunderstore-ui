import { StoryFn, Meta } from "@storybook/react";
import { PackageFlag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/PackageFlag",
  component: PackageFlag,
} as Meta;

const defaultArgs = {
  label: "-",
};

const Template: StoryFn<typeof PackageFlag> = (args) => (
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

export { DefaultPackageFlag };
