import { StoryFn, Meta } from "@storybook/react";
import { NewTag, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  TagModifiersList,
  TagSizesList,
  TagVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Tag",
  component: NewTag,
} as Meta<typeof NewTag>;

const defaultArgs = {};

const Template: StoryFn<typeof NewTag> = () => {
  const tags = TagSizesList.map((size) => {
    const variantBlock = TagVariantsList.map((variant) => {
      const modifierBlock = TagModifiersList.map((modifier) => {
        if (modifier == "dark") {
          return (
            <>
              <NewTag
                key={`${size}-${variant}-${modifier}`}
                csVariant={variant}
                csSize={size}
                csModifiers={[modifier]}
              >
                {size}-{variant}-{modifier}
                <NewIcon csMode={"inline"} noWrapper>
                  <FontAwesomeIcon icon={faChevronDown} />
                </NewIcon>
              </NewTag>
              <NewTag
                key={`${size}-${variant}-${modifier}-hoverable`}
                csVariant={variant}
                csSize={size}
                csModifiers={[modifier, "hoverable"]}
              >
                {size}-{variant}-{modifier}-hoverable
                <NewIcon csMode={"inline"} noWrapper>
                  <FontAwesomeIcon icon={faChevronDown} />
                </NewIcon>
              </NewTag>
            </>
          );
        }

        return (
          <NewTag
            key={`${size}-${variant}-${modifier}`}
            csVariant={variant}
            csSize={size}
            csModifiers={[modifier]}
          >
            {size}-{variant}-{modifier}
            <NewIcon csMode={"inline"} noWrapper>
              <FontAwesomeIcon icon={faChevronDown} />
            </NewIcon>
          </NewTag>
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
          <NewTag
            key={`${size}-${variant}-noModifier`}
            csVariant={variant}
            csSize={size}
          >
            {size}-{variant}-noModifier
            <NewIcon csMode={"inline"} noWrapper>
              <FontAwesomeIcon icon={faChevronDown} />
            </NewIcon>
          </NewTag>
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

  const tagOptions = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {tags}
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
      {tagOptions}
    </div>
  );
};

const DefaultTag = Template.bind({});
DefaultTag.args = defaultArgs;

export { meta as default, DefaultTag as Tags };
