import { StoryFn, Meta } from "@storybook/react";
import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { colorsList } from "@thunderstore/cyberstorm/src/primitiveComponents/utils/utils";

const meta = {
  title: "Button",
  component: NewButton,
} as Meta<typeof NewButton>;

const defaultArgs = {};

const buttonVariants = [
  "default",
  "defaultPeek",
  "primary",
  "secondary",
  "tertiary",
  "minimal",
  "accent",
  "special",
] as const;
const buttonSizes = ["xs", "s", "m", "l"] as const;
const IconButtonVariants = [
  "default",
  "defaultPeek",
  "primary",
  "secondary",
  "tertiary",
  "tertiaryDimmed",
  "minimal",
] as const;
const IconButtonSizes = ["xs", "s", "m"] as const;

const Template: StoryFn<typeof NewButton> = () => {
  const Buttons = buttonSizes.map((size) => {
    const variantBlock = buttonVariants.map((variant) => {
      const colorBlock = colorsList.map((color) => {
        return (
          <NewButton
            key={`${size}-${variant}-${color}`}
            csVariant={variant}
            csSize={size}
            csColor={color}
          >
            {size}-{variant}-{color}
            <NewIcon csMode={"inline"} noWrapper>
              <FontAwesomeIcon icon={faChevronDown} />
            </NewIcon>
          </NewButton>
        );
      });
      return (
        <div
          key={`${size}-${variant}`}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
          }}
        >
          {colorBlock}
        </div>
      );
    });
    return (
      <div
        key={`${size}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {variantBlock}
      </div>
    );
  });

  const buttonOptions = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {Buttons}
    </div>
  );

  const IconButtons = IconButtonSizes.map((size) => {
    const variantBlock = IconButtonVariants.map((variant) => {
      const colorBlock = colorsList.map((color) => {
        return (
          <NewButton
            key={`${size}-${variant}-${color}`}
            csVariant={variant}
            csSize={size}
            csColor={color}
            icon={faChevronDown}
          />
        );
      });
      return (
        <div
          key={`${size}-${variant}`}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
          }}
        >
          {colorBlock}
        </div>
      );
    });
    return (
      <div
        key={`${size}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {variantBlock}
      </div>
    );
  });

  const iconButtonOptions = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {IconButtons}
    </div>
  );

  return (
    <div
      style={{
        width: "12rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {buttonOptions}
      {iconButtonOptions}
      <NewButton>
        default
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton tooltipText="tooltip text">
        tooltipDefault
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="primary">
        primary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="tertiary" csColor="surface">
        tertiary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="accent">
        accent
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="default" csColor="green">
        success
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="default" csColor="yellow">
        warning
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="default" csColor="red">
        danger
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton csVariant="special">
        specialGreen
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </NewButton>
      <NewButton icon={faChevronDown} csVariant="default" />
      <NewButton icon={faChevronDown} csVariant="defaultPeek" />
      <NewButton icon={faChevronDown} csVariant="primary" />
      <NewButton icon={faChevronDown} csVariant="secondary" />
      <NewButton icon={faChevronDown} csVariant="tertiary" />
      <NewButton icon={faChevronDown} csVariant="tertiaryDimmed" />
      <NewButton icon={faChevronDown} csVariant="minimal" />
    </div>
  );
};

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
