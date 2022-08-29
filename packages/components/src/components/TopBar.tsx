import {
  Button,
  Flex,
  IconProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import React from "react";

import { ChevronDown, ThunderstoreLogo } from "./Icons";
import { IndexLink } from "./Links";

/**
 * Navigation bar shown on every page.
 */
export const TopBar: React.FC = (props) => (
  <Flex align="center" h={100}>
    <IndexLink variant="ts.topBarIndex" align="center" display="flex">
      <ThunderstoreLogo height="20px" mr="7px" width="20px" />
      Thunderstore
    </IndexLink>
    <Spacer />
    <Flex>{props.children}</Flex>
  </Flex>
);

interface TopBarMenu {
  label: string;
}

export const TopBarMenu: React.FC<TopBarMenu> = (props) => (
  <Menu variant="ts.topBar">
    <MenuButton as={Button} rightIcon={<ChevronDown />} variant="ts.topBarMenu">
      {props.label}
    </MenuButton>

    <MenuList
      backgroundColor="ts.darkBlue"
      border="none"
      borderRadius="0"
      minW="115px"
      p="0"
    >
      {props.children}
    </MenuList>
  </Menu>
);

interface MenuButtonProps {
  icon: React.FC<IconProps>;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TopBarMenuButton: React.FC<MenuButtonProps> = (props) => {
  return (
    <MenuItem onClick={props.onClick}>
      <props.icon w="20px" h="20px" mr="0.6rem" />
      {props.label}
    </MenuItem>
  );
};
