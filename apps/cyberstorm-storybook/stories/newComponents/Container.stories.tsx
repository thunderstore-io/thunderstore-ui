import { StoryFn, Meta } from "@storybook/react";
import { Container, NewIcon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Container",
  component: Container,
} as Meta<typeof Container>;

const Template: StoryFn<typeof Container> = () => (
  <Container
    style={{ width: "100px", height: "100px" }}
    csColor="cyber-green"
    csVariant="default"
    csTextStyles={["fontSizeL", "fontFamilyHubot", "fontWeightBold"]}
  >
    <NewIcon>
      <FontAwesomeIcon icon={faSearch} />
    </NewIcon>
    Test Style System Check
  </Container>
);

const ReferenceContainer = Template.bind({});
ReferenceContainer.args = {};

export { meta as default, ReferenceContainer };
