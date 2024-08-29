import { StoryFn, Meta } from "@storybook/react";
import {
  NewButton,
  NewDropDown,
  NewDropDownItem,
  NewIcon,
  NewLink,
  Tag,
} from "@thunderstore/cyberstorm";
import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faStar,
  faThumbtack,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "DropDown",
  component: NewDropDown,
} as Meta<typeof NewDropDown>;

const defaultArgs = {
  trigger: (
    <NewButton csVariant="default" csColor="red">
      Developers
      <NewIcon csVariant="default" csColor="cyber-green">
        <FontAwesomeIcon icon={faChevronDown} />
      </NewIcon>
    </NewButton>
  ),
};

const children: ReactElement = (
  <>
    <NewDropDownItem>
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faStar} />
      </NewIcon>
      New
    </NewDropDownItem>
    <NewDropDownItem>
      <NewLink
        primitiveType="link"
        csVariant="primary"
        csTextStyles={["fontSizeS", "fontWeightRegular"]}
        href="https://github.com/thunderstore-io"
      >
        Github
        <NewIcon csMode="inline" csVariant="default" csColor="red">
          <FontAwesomeIcon icon={faThumbtack} />
        </NewIcon>
      </NewLink>
    </NewDropDownItem>
    <NewDropDownItem>
      <NewButton csVariant="special" style={{ minWidth: "100%" }} key={3}>
        Nabbula
        <NewIcon
          csMode="inline"
          noWrapper
          csVariant="default"
          csColor="cyber-green"
        >
          <FontAwesomeIcon icon={faSkull} />
        </NewIcon>
      </NewButton>
    </NewDropDownItem>
  </>
);

const Template: StoryFn<typeof NewDropDown> = (args) => {
  const { children, ...restOfArgs } = args;

  return (
    <NewDropDown {...restOfArgs} csVariant="default" csColor="surface">
      {children}
    </NewDropDown>
  );
};

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  children: children,
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  children: children,
};

const TriggerColorDropDown = Template.bind({});
TriggerColorDropDown.args = {
  ...defaultArgs,
  children: children,
};

const TagTriggerDropDown = Template.bind({});
TagTriggerDropDown.args = {
  ...defaultArgs,
  children: children,
  trigger: <Tag label={"I'm a trigger"} />,
};

const MinimalDropDown = Template.bind({});
MinimalDropDown.args = defaultArgs;

const DefaultOpenDropDown = Template.bind({});
DefaultOpenDropDown.args = {
  ...defaultArgs,
  children: children,
  defaultOpen: true,
};

export {
  meta as default,
  ReferenceDropDown,
  MinimalDropDown,
  PrimaryDropDown,
  TagTriggerDropDown,
  DefaultOpenDropDown,
  TriggerColorDropDown,
};
