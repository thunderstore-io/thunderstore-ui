import { PackageRequirements } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageRequirements } as ComponentMeta<
  typeof PackageRequirements
>;

const Template: ComponentStory<typeof PackageRequirements> = (args) => (
  <PackageRequirements {...args} />
);

const Requirements = Template.bind({});
Requirements.args = {
  requirements: [
    {
      communityName: "bbepis",
      description:
        "Unified BepInEx all-in-one modding pack - plugin framework, detour library",
      imageSrc: "/img/decorative-128x128.jpg",
      packageName: "BepInExPack",
      preferredVersion: "5.4.9",
    },
    {
      communityName: "tristanmcpherson",
      description: "A modding API for Risk of Rain 2",
      imageSrc: null,
      packageName: "R2API",
      preferredVersion: "3.0.52",
    },
  ],
};

export { meta as default, Requirements as PackageRequirements };
