import { StoryFn, Meta } from "@storybook/react";
import { Button, Icon } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Button",
  component: Button.Root,
} as Meta<typeof Button.Root>;

const defaultArgs = {
  tooltipText: "tooltip text",
};

const Template: StoryFn<typeof Button.Root> = (args) => (
  <div
    style={{
      width: "12rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <Button.Root colorScheme="default" {...args}>
      <Button.ButtonLabel>default</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="primary" {...args}>
      <Button.ButtonLabel>primary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="tertiary" {...args}>
      <Button.ButtonLabel>tertiary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="accent" {...args}>
      <Button.ButtonLabel>accent</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="fancyAccent" {...args}>
      <Button.ButtonLabel>fancyAccent</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="success" {...args}>
      <Button.ButtonLabel>success</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="warning" {...args}>
      <Button.ButtonLabel>warning</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="danger" {...args}>
      <Button.ButtonLabel>danger</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="specialGreen" {...args}>
      <Button.ButtonLabel>specialGreen</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="specialPurple" {...args}>
      <Button.ButtonLabel>specialPurple</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="transparentDefault" {...args}>
      <Button.ButtonLabel>transparentDefault</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="transparentPrimary" {...args}>
      <Button.ButtonLabel>transparentPrimary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="transparentTertiary" {...args}>
      <Button.ButtonLabel>transparentTertiary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="transparentAccent" {...args}>
      <Button.ButtonLabel>transparentAccent</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="transparentDanger" {...args}>
      <Button.ButtonLabel>transparentDanger</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="discord" {...args}>
      <Button.ButtonLabel>discord</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="github" {...args}>
      <Button.ButtonLabel>github</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root colorScheme="overwolf" {...args}>
      <Button.ButtonLabel>overwolf</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
  </div>
);

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

export { meta as default, DefaultButton as Buttons };
