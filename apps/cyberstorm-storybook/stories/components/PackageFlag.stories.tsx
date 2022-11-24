import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageFlag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/PackageFlag",
  component: PackageFlag,
} as ComponentMeta<typeof PackageFlag>;

const defaultArgs = {
  label: "Categories",
  rightIcon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"buttonIcon"}
    />
  ),
};

const Template: ComponentStory<typeof PackageFlag> = (args) => (
  <PackageFlag {...args} />
);

const DefaultPackageFlag = Template.bind({});
DefaultPackageFlag.args = { ...defaultArgs, buttonStyle: "default" };

export { meta as default, DefaultPackageFlag };
