import { StoryFn, Meta } from "@storybook/react";
import { LinkButton, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "LinkButton",
  component: LinkButton,
} as Meta<typeof LinkButton>;

const defaultArgs = {};

const Template: StoryFn<typeof LinkButton> = (args) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: "0.5rem",
    }}
  >
    <div
      style={{
        width: "12rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <LinkButton {...args} primitiveType="link" href="https://example.com">
        default
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        tooltipText="tooltip text"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        tooltipDefault
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="primary"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        primary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="secondary"
        csModifiers={["ghost"]}
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        tertiary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="accent"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        accent
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="success"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        success
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="warning"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        warning
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="danger"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        danger
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="special"
        {...args}
        primitiveType="link"
        href="https://example.com"
      >
        specialGreen
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
    </div>
    <div
      style={{
        width: "12rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <LinkButton {...args} primitiveType="cyberstormLink" linkId="Communities">
        default
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        tooltipText="tooltip text"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        tooltipDefault
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="primary"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        primary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="secondary"
        csModifiers={["ghost"]}
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        tertiary
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="accent"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        accent
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="success"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        success
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="warning"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        warning
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="danger"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        danger
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
      <LinkButton
        csVariant="special"
        {...args}
        primitiveType="cyberstormLink"
        linkId="Communities"
      >
        specialGreen
        <NewIcon csMode={"inline"} noWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </NewIcon>
      </LinkButton>
    </div>
  </div>
);

const DefaultLinkButton = Template.bind({});
DefaultLinkButton.args = defaultArgs;

export { meta as default, DefaultLinkButton as LinkButtons };
