import { StoryFn, Meta } from "@storybook/react";
import { Toast } from "@thunderstore/cyberstorm";
import React from "react";
import { v4 as uuid } from "uuid";

const meta = {
  title: "Cyberstorm/Components/Toast",
  component: Toast,
} as Meta<typeof Toast>;

const defaultArgs = {
  id: uuid(),
  message: "-",
  variant: "info" as const,
};

const Template: StoryFn<typeof Toast> = (args) => (
  <div style={{ width: "600px", height: "600px" }}>
    <Toast {...args} />
  </div>
);

const MinimalToast = Template.bind({});
MinimalToast.args = {
  ...defaultArgs,
};

const InfoToast = Template.bind({});
InfoToast.args = {
  ...defaultArgs,
  children:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  csVariant: "info",
};

const DangerToast = Template.bind({});
DangerToast.args = {
  ...defaultArgs,
  children:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  csVariant: "danger",
};

const WarningToast = Template.bind({});
WarningToast.args = {
  ...defaultArgs,
  children:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  csVariant: "warning",
};

const SuccessToast = Template.bind({});
SuccessToast.args = {
  ...defaultArgs,
  children:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  csVariant: "success",
};

export {
  meta as default,
  MinimalToast,
  InfoToast,
  DangerToast,
  WarningToast,
  SuccessToast,
};
