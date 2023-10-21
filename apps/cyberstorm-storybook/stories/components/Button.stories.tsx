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
    <Button.Root variant="default" {...args}>
      <Button.ButtonLabel>default</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="primary" {...args}>
      <Button.ButtonLabel>primary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="tertiary" {...args}>
      <Button.ButtonLabel>tertiary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="accent" {...args}>
      <Button.ButtonLabel>accent</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="install" color="cyber-green" {...args}>
      <Button.ButtonLabel>install</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="status" color="green" {...args}>
      <Button.ButtonLabel>success</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="status" color="red" {...args}>
      <Button.ButtonLabel>warning</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="alert" {...args}>
      <Button.ButtonLabel>danger</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="specialGreen" {...args}>
      <Button.ButtonLabel>specialGreen</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="specialPurple" {...args}>
      <Button.ButtonLabel>specialPurple</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="transparentDefault" {...args}>
      <Button.ButtonLabel>transparentDefault</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="transparentPrimary" {...args}>
      <Button.ButtonLabel>transparentPrimary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="transparentTertiary" {...args}>
      <Button.ButtonLabel>transparentTertiary</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="transparentAccent" {...args}>
      <Button.ButtonLabel>transparentAccent</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="transparentDanger" {...args}>
      <Button.ButtonLabel>transparentDanger</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="discord" {...args}>
      <Button.ButtonLabel>discord</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="github" {...args}>
      <Button.ButtonLabel>github</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
    <Button.Root variant="overwolf" {...args}>
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
