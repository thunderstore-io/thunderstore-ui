import { StoryFn, Meta } from "@storybook/react";
import { Heading } from "@thunderstore/cyberstorm";
import React, { ReactNode } from "react";

const meta = {
  title: "Heading",
  component: Heading,
} as Meta<typeof Heading>;

const levels = ["1", "2", "3", "4"] as const;
const styleLevels = ["1", "2", "3", "4"] as const;

const Template: StoryFn<typeof Heading> = (args) => {
  const options: ReactNode[] = [];
  levels.map((level: "1" | "2" | "3" | "4") =>
    styleLevels.map((styleLevel) => {
      options.push(
        <Heading
          {...args}
          key={`${level}-${styleLevel}`}
          csLevel={level}
          csSize={styleLevel}
        >
          Test Heading
        </Heading>
      );
    })
  );
  return <>{options}</>;
};

const ReferenceHeading = Template.bind({});
ReferenceHeading.args = {};

const HeadingHeading = Template.bind({});
HeadingHeading.args = {
  mode: "heading",
};

const HeadingDisplay = Template.bind({});
HeadingDisplay.args = {
  mode: "display",
};

export { meta as default, ReferenceHeading, HeadingHeading, HeadingDisplay };
