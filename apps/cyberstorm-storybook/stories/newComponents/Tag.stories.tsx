import { StoryFn, Meta } from "@storybook/react";
import { NewIcon, NewTag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faXmark } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Tag",
  component: NewTag,
} as Meta<typeof NewTag>;

const Template: StoryFn<typeof NewTag> = (args) => (
  <div
    style={{
      display: "flex",
      gap: "0.25em",
      flexDirection: "column",
      width: "3rem",
    }}
  >
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="surface" hoverable />
      <NewTag {...args} csVariant="default" csColor="surface" hoverable dark />
      <NewTag {...args} csVariant="default" csColor="surface" />
      <NewTag {...args} csVariant="default" csColor="surface" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="surface-alpha" hoverable />
      <NewTag
        {...args}
        csVariant="default"
        csColor="surface-alpha"
        hoverable
        dark
      />
      <NewTag {...args} csVariant="default" csColor="surface-alpha" />
      <NewTag {...args} csVariant="default" csColor="surface-alpha" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="cyber-green" hoverable />
      <NewTag
        {...args}
        csVariant="default"
        csColor="cyber-green"
        hoverable
        dark
      />
      <NewTag {...args} csVariant="default" csColor="cyber-green" />
      <NewTag {...args} csVariant="default" csColor="cyber-green" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="green" hoverable />
      <NewTag {...args} csVariant="default" csColor="green" hoverable dark />
      <NewTag {...args} csVariant="default" csColor="green" />
      <NewTag {...args} csVariant="default" csColor="green" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="yellow" hoverable />
      <NewTag {...args} csVariant="default" csColor="yellow" hoverable dark />
      <NewTag {...args} csVariant="default" csColor="yellow" />
      <NewTag {...args} csVariant="default" csColor="yellow" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="blue" hoverable />
      <NewTag {...args} csVariant="default" csColor="blue" hoverable dark />
      <NewTag {...args} csVariant="default" csColor="blue" />
      <NewTag {...args} csVariant="default" csColor="blue" dark />
    </div>
    <div style={{ display: "flex", gap: "0.25em" }}>
      <NewTag {...args} csVariant="default" csColor="red" hoverable />
      <NewTag {...args} csVariant="default" csColor="red" hoverable dark />
      <NewTag {...args} csVariant="default" csColor="red" />
      <NewTag {...args} csVariant="default" csColor="red" dark />
    </div>
  </div>
);

const MinimalTag = Template.bind({});
MinimalTag.args = {};

const DefaultTag = Template.bind({});
DefaultTag.args = {
  children: (
    <>
      tag
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faXmark} />
      </NewIcon>
    </>
  ),
};

const IconOnlyTag = Template.bind({});
IconOnlyTag.args = {
  children: (
    <NewIcon csMode="inline" noWrapper>
      <FontAwesomeIcon icon={faTag} />
    </NewIcon>
  ),
};
const TextOnlyTag = Template.bind({});
TextOnlyTag.args = {
  children: <>tag</>,
};

const SmallTag = Template.bind({});
SmallTag.args = {
  children: (
    <>
      tag
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faXmark} />
      </NewIcon>
    </>
  ),
  csSize: "m",
};

const TinyTag = Template.bind({});
TinyTag.args = {
  children: (
    <>
      tag
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faXmark} />
      </NewIcon>
    </>
  ),
  csSize: "s",
};

export {
  meta as default,
  MinimalTag,
  DefaultTag,
  IconOnlyTag,
  TextOnlyTag,
  SmallTag,
  TinyTag,
};
