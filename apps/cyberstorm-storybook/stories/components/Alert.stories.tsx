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
  colorScheme: "blue",
};

const Template: StoryFn<typeof Alert> = (args) => <Alert {...args} />;

const MinimalAlert = Template.bind({});
MinimalAlert.args = {
  ...defaultArgs,
};

const BlueAlert = Template.bind({});
BlueAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "blue",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const GreenAlert = Template.bind({});
GreenAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "green",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const YellowAlert = Template.bind({});
YellowAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "yellow",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const RedAlert = Template.bind({});
RedAlert.args = {
  ...defaultArgs,
  label:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  colorScheme: "red",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

export { MinimalAlert, BlueAlert, GreenAlert, YellowAlert, RedAlert };
