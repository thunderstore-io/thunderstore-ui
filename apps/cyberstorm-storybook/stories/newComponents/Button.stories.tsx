import { StoryFn, Meta } from "@storybook/react";
import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Button",
  component: NewButton,
} as Meta<typeof NewButton>;

const defaultArgs = {};

const Template: StoryFn<typeof NewButton> = (args) => (
  <div
    style={{
      width: "12rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <NewButton {...args}>
      default
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton tooltipText="tooltip text" {...args}>
      tooltipDefault
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="primary" {...args}>
      primary
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="tertiary" csColor="surface" {...args}>
      tertiary
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="accent" {...args}>
      accent
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="default" csColor="green" {...args}>
      success
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="default" csColor="yellow" {...args}>
      warning
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="default" csColor="red" {...args}>
      danger
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
    <NewButton csVariant="special" {...args}>
      specialGreen
      <NewIcon csMode={"inline"} noWrapper>
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
  </div>
);

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
