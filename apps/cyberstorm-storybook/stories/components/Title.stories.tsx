import { StoryFn, Meta } from "@storybook/react";
import { Title } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Title",
  component: Title,
} as Meta<typeof Title>;

const defaultArgs = {
  text: "This is a title",
};

const Template: StoryFn<typeof Title> = (args) => <Title {...args} />;

const ReferenceTitle = Template.bind({});
ReferenceTitle.args = defaultArgs;

const LongTitle = Template.bind({});
LongTitle.args = {
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n" +
    "Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. \n" +
    "Vestibulum sapien.",
};

const EmptyTitle = Template.bind({});
EmptyTitle.args = { text: "" };

export { meta as default, ReferenceTitle, LongTitle, EmptyTitle };
