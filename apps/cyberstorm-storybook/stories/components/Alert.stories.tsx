import { StoryFn, Meta } from "@storybook/react";
import { Alert, AlertProps } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/Alert",
  component: Alert,
} as Meta;

const defaultArgs: AlertProps = {
  label: "-",
  colorScheme: "info",
};

const Template: StoryFn<typeof Alert> = (args) => <Alert {...args} />;

const MinimalAlert = Template.bind({});
MinimalAlert.args = {
  ...defaultArgs,
};

const InfoAlert = Template.bind({});
InfoAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "info",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const DangerAlert = Template.bind({});
DangerAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "danger",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const WarningAlert = Template.bind({});
WarningAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "warning",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const SuccessAlert = Template.bind({});
SuccessAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "success",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

export { MinimalAlert, InfoAlert, DangerAlert, WarningAlert, SuccessAlert };
