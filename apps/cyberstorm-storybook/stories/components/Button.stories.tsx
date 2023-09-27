import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Button",
  component: Button,
} as Meta<typeof Button>;

const defaultArgs = {
  rightIcon: <FontAwesomeIcon fixedWidth icon={faChevronDown} />,
};

const Template: StoryFn<typeof Button> = (args) => (
  <div
    style={{
      width: "12rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <Button colorScheme="default" label="default" {...args} />
    <Button colorScheme="primary" label="primary" {...args} />
    <Button colorScheme="tertiary" label="tertiary" {...args} />
    <Button colorScheme="accent" label="accent" {...args} />
    <Button colorScheme="fancyAccent" label="fancyAccent" {...args} />
    <Button colorScheme="success" label="success" {...args} />
    <Button colorScheme="warning" label="warning" {...args} />
    <Button colorScheme="danger" label="danger" {...args} />
    <Button colorScheme="specialGreen" label="specialGreen" {...args} />
    <Button colorScheme="specialPurple" label="specialPurple" {...args} />
    <Button
      colorScheme="transparentDefault"
      label="transparentDefault"
      {...args}
    />
    <Button
      colorScheme="transparentPrimary"
      label="transparentPrimary"
      {...args}
    />
    <Button
      colorScheme="transparentTertiary"
      label="transparentTertiary"
      {...args}
    />
    <Button
      colorScheme="transparentAccent"
      label="transparentAccent"
      {...args}
    />
    <Button
      colorScheme="transparentDanger"
      label="transparentDanger"
      {...args}
    />
    <Button colorScheme="discord" label="discord" {...args} />
    <Button colorScheme="github" label="github" {...args} />
    <Button colorScheme="overwolf" label="overwolf" {...args} />
  </div>
);

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
