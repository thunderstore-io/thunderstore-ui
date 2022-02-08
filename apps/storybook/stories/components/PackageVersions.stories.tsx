import { PackageVersions } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageVersions } as ComponentMeta<
  typeof PackageVersions
>;

const Template: ComponentStory<typeof PackageVersions> = (args) => (
  <PackageVersions {...args} />
);

const Versions = Template.bind({});
const now = Date.now();
const day = 86400000;
Versions.args = {
  versions: [
    {
      downloadCount: 123,
      uploaded: new Date(now - 2 * day).toISOString(),
      version: "2.0.15",
    },
    {
      downloadCount: 4567,
      uploaded: new Date(now - 5 * day).toISOString(),
      version: "2.0.14",
    },
    {
      downloadCount: 89012,
      uploaded: new Date(now - 15 * day).toISOString(),
      version: "2.0.13",
    },
    {
      downloadCount: 345678,
      uploaded: new Date(now - 50 * day).toISOString(),
      version: "2.0.5",
    },
    {
      downloadCount: 9012345,
      uploaded: new Date(now - 100 * day).toISOString(),
      version: "2.0.0",
    },
    {
      downloadCount: 67890123,
      uploaded: new Date(now - 400 * day).toISOString(),
      version: "1.0.99",
    },
  ],
};

export { meta as default, Versions as PackageVersions };
