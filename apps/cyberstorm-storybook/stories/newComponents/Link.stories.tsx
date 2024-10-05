import { StoryFn, Meta } from "@storybook/react";
import { NewLink } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Link",
  component: NewLink,
} as Meta<typeof NewLink>;

const defaultArgs = {};

const Template: StoryFn<typeof NewLink> = (args) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <NewLink {...args} primitiveType="link" href="https://example.com">
      Test Link
    </NewLink>
    <NewLink {...args} primitiveType="cyberstormLink" linkId="Communities">
      Test Link
    </NewLink>
    <NewLink
      {...args}
      primitiveType="link"
      href="https://example.com"
      csVariant="default"
      csColor="cyber-green"
    >
      Test Link
    </NewLink>
    <NewLink
      {...args}
      primitiveType="cyberstormLink"
      linkId="Communities"
      csVariant="default"
      csColor="cyber-green"
    >
      Test Link
    </NewLink>
  </div>
);

const ReferenceLink = Template.bind({});
ReferenceLink.args = defaultArgs;

export { meta as default, ReferenceLink };
