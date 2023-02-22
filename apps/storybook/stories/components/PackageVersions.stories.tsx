import { PackageVersions } from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

export default { component: PackageVersions } as Meta;

const Template: StoryFn<typeof PackageVersions> = (args) => (
  <PackageVersions {...args} />
);

const Versions = Template.bind({});
const now = Date.now();
const day = 86400000;
const versionBase = { downloadUrl: "/", installUrl: "/" };
Versions.args = {
  packageName: "Risk of Rain 2",
  versions: [
    {
      ...versionBase,
      downloadCount: 123,
      uploaded: new Date(now - 2 * day).toISOString(),
      version: "2.0.15",
    },
    {
      ...versionBase,
      downloadCount: 4567,
      uploaded: new Date(now - 5 * day).toISOString(),
      version: "2.0.14",
    },
    {
      ...versionBase,
      downloadCount: 89012,
      uploaded: new Date(now - 15 * day).toISOString(),
      version: "2.0.13",
    },
    {
      ...versionBase,
      downloadCount: 345678,
      uploaded: new Date(now - 50 * day).toISOString(),
      version: "2.0.5",
    },
    {
      ...versionBase,
      downloadCount: 9012345,
      uploaded: new Date(now - 100 * day).toISOString(),
      version: "2.0.0",
    },
    {
      ...versionBase,
      downloadCount: 67890123,
      uploaded: new Date(now - 400 * day).toISOString(),
      version: "1.0.99",
    },
  ],
};

export { Versions as PackageVersions };
