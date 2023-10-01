import { StoryFn, Meta } from "@storybook/react";
import { Button, Icon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Button",
  component: Button.Root,
} as Meta<typeof Button.Root>;

const defaultArgs = {};

const Template: StoryFn<typeof Button> = (args) => (
  <div
    style={{
      width: "12rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <Button.Root colorScheme="default" {...args}>
      <Button.Label>default</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="primary" {...args}>
      <Button.Label>primary</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="tertiary" {...args}>
      <Button.Label>tertiary</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="accent" {...args}>
      <Button.Label>accent</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="fancyAccent" {...args}>
      <Button.Label>fancyAccent</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="success" {...args}>
      <Button.Label>success</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="warning" {...args}>
      <Button.Label>warning</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="danger" {...args}>
      <Button.Label>danger</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="specialGreen" {...args}>
      <Button.Label>specialGreen</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="specialPurple" {...args}>
      <Button.Label>specialPurple</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="transparentDefault" {...args}>
      <Button.Label>transparentDefault</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="transparentPrimary" {...args}>
      <Button.Label>transparentPrimary</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="transparentTertiary" {...args}>
      <Button.Label>transparentTertiary</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="transparentAccent" {...args}>
      <Button.Label>transparentAccent</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="transparentDanger" {...args}>
      <Button.Label>transparentDanger</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="discord" {...args}>
      <Button.Label>discord</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="github" {...args}>
      <Button.Label>github</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
    <Button.Root colorScheme="overwolf" {...args}>
      <Button.Label>overwolf</Button.Label>
      <Button.Icon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.Icon>
    </Button.Root>
  </div>
);

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
