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
        <MenuItem.MenuItemIcon key="1">
          <Icon>
            <FontAwesomeIcon icon={faArrowDownAZ} />
          </Icon>
        </MenuItem.MenuItemIcon>
      ),
      Label: <MenuItem.MenuItemLabel key="2">A-Z</MenuItem.MenuItemLabel>,
    },
  },
} as Meta;

const Template: StoryFn<typeof MenuItem> = () => (
  <div>
    <MenuItem.Root>
      <MenuItem.MenuItemIcon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.MenuItemIcon>
      <MenuItem.MenuItemLabel>A-Z</MenuItem.MenuItemLabel>
    </MenuItem.Root>
    <MenuItem.Root>
      <MenuItem.MenuItemLabel>A-Z</MenuItem.MenuItemLabel>
      <MenuItem.MenuItemIcon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.MenuItemIcon>
    </MenuItem.Root>
    <MenuItem.Root>
      <MenuItem.MenuItemIcon>
        <Icon>
          <FontAwesomeIcon icon={faArrowDownAZ} />
        </Icon>
      </MenuItem.MenuItemIcon>
      <MenuItem.MenuItemLabel>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel
        ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor
        fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis
        nibh commodo cursus. Nulla facilisi.
      </MenuItem.MenuItemLabel>
    </MenuItem.Root>
  </div>
);

const ReferenceMenuItem = Template.bind({});

export { ReferenceMenuItem };
