import { StoryFn, Meta } from "@storybook/react";
import { Alert, AlertProps } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Alert",
  component: Alert,
} as Meta<typeof Alert>;

const defaultArgs: AlertProps = {
  content: "-",
  variant: "info",
};

const Template: StoryFn<typeof Alert> = (args) => (
  <div style={{ width: "500px" }}>
    <Alert {...args} />
  </div>
);

const MinimalAlert = Template.bind({});
MinimalAlert.args = {
  ...defaultArgs,
};

const InfoAlert = Template.bind({});
InfoAlert.args = {
  ...defaultArgs,
  content:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "info",
  icon: <FontAwesomeIcon icon={faCircleExclamation} />,
};

const DangerAlert = Template.bind({});
DangerAlert.args = {
  ...defaultArgs,
  content:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "danger",
  icon: <FontAwesomeIcon icon={faBomb} />,
};

const WarningAlert = Template.bind({});
WarningAlert.args = {
  ...defaultArgs,
  content:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "warning",
  icon: <FontAwesomeIcon icon={faTriangleExclamation} />,
};

const SuccessAlert = Template.bind({});
SuccessAlert.args = {
  ...defaultArgs,
  content:
    "Lorem ipsum dolor sit amet, lollero pollero long ass text right here ellipsis just kidding it’s not that long.",
  variant: "success",
  icon: <FontAwesomeIcon icon={faCircleCheck} />,
};

export {
  meta as default,
  MinimalAlert,
  InfoAlert,
  DangerAlert,
  WarningAlert,
  SuccessAlert,
};
