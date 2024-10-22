import { StoryFn, Meta } from "@storybook/react";
import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  ButtonModifiersList,
  ButtonSizesList,
  ButtonVariantsList,
  IconButtonModifiersList,
  IconButtonSizesList,
  IconButtonVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Button",
  component: NewButton,
} as Meta<typeof NewButton>;

const defaultArgs = {};

const Template: StoryFn<typeof NewButton> = () => {
  const Buttons = ButtonSizesList.map((size) => {
    const variantBlock = ButtonVariantsList.map((variant) => {
      const modifierBlock = ButtonModifiersList.map((modifier) => {
        return (
          <NewButton
            key={`${size}-${variant}-${modifier}`}
            csVariant={variant}
            csSize={size}
            csModifiers={[modifier]}
          >
            {size}-{variant}-{modifier}
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
          <NewButton
            key={`${size}-${variant}-noModifier`}
            csVariant={variant}
            csSize={size}
          >
            {size}-{variant}-noModifier
            <NewIcon csMode={"inline"} noWrapper>
              <FontAwesomeIcon icon={faChevronDown} />
            </NewIcon>
          </NewButton>
          {modifierBlock}
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

  const IconButtons = IconButtonSizesList.map((size) => {
    const variantBlock = IconButtonVariantsList.map((variant) => {
      const modifierBlock = IconButtonModifiersList.map((modifier) => {
        return (
          <NewButton
            key={`${size}-${variant}-${modifier}`}
            csVariant={variant}
            csSize={size}
            csModifiers={[modifier]}
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
          <NewButton
            key={`${size}-${variant}-noModifier`}
            csVariant={variant}
            csSize={size}
            icon={faChevronDown}
          />
          {modifierBlock}
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
    </div>
  );
};

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
