import { StoryFn, Meta } from "@storybook/react";
import { Toast, ToastProps } from "@thunderstore/cyberstorm";
import React from "react";
import { v4 as uuid } from "uuid";

const meta = {
  title: "Cyberstorm/Components/Toast",
  component: Toast,
} as Meta<typeof Toast>;

const defaultArgs: ToastProps = {
  id: uuid(),
  message: "-",
  variant: "info",
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
  message:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "info",
};

const DangerToast = Template.bind({});
DangerToast.args = {
  ...defaultArgs,
  message:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "danger",
};

const WarningToast = Template.bind({});
WarningToast.args = {
  ...defaultArgs,
  message:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "warning",
};

const SuccessToast = Template.bind({});
SuccessToast.args = {
  ...defaultArgs,
  message:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "success",
};

export {
  meta as default,
  MinimalToast,
  InfoToast,
  DangerToast,
  WarningToast,
  SuccessToast,
};
