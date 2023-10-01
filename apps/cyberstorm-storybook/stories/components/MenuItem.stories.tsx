import { StoryFn, Meta } from "@storybook/react";
import { Icon, MenuItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/MenuItem",
  component: MenuItem.Root,
  children: {
    options: ["Label", "Icon"],
    mapping: {
      Icon: (
        <MenuItem.Icon key="1">
          <Icon>
            <FontAwesomeIcon icon={faArrowDownAZ} />
          </Icon>
        </MenuItem.Icon>
      ),
      Label: <MenuItem.Label key="2">A-Z</MenuItem.Label>,
    },
  },
} as Meta;

const Template: StoryFn<typeof MenuItem> = () => (
  <div>
    <MenuItem.Root>
      <MenuItem.Icon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.Icon>
      <MenuItem.Label>A-Z</MenuItem.Label>
    </MenuItem.Root>
    <MenuItem.Root>
      <MenuItem.Label>A-Z</MenuItem.Label>
      <MenuItem.Icon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.Icon>
    </MenuItem.Root>
    <MenuItem.Root>
      <MenuItem.Icon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.Icon>
      <MenuItem.Label>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel
        ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor
        fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis
        nibh commodo cursus. Nulla facilisi.
      </MenuItem.Label>
    </MenuItem.Root>
  </div>
);

const ReferenceMenuItem = Template.bind({});

export { ReferenceMenuItem };
