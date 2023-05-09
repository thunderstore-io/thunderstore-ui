import {
  Button,
  Flex,
  IconProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";

import { ChevronDown, ThunderstoreLogo } from "./Icons";
import { IndexLink } from "./Links";

/**
 * Navigation bar shown on every page.
 */

interface TopBarProps {
  children?: React.ReactNode;
}

export function TopBar(props: TopBarProps) {
  const { children } = props;
  return (
    <Flex align="center" h={100} justify="space-between">
      <IndexLink variant="ts.topBarIndex" align="center" display="flex">
        <ThunderstoreLogo height="20px" mr="7px" width="20px" />
        Thunderstore
      </IndexLink>
      <Flex>{children}</Flex>
    </Flex>
  );
}

interface TopBarMenu {
  label: string;
  children?: React.ReactNode;
}

export function TopBarMenu(props: TopBarMenu) {
  return (
    <Menu variant="ts.topBar">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDown />}
        variant="ts.topBarMenu"
      >
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
}

interface MenuButtonProps {
  icon: React.FC<IconProps>;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TopBarMenuButton(props: MenuButtonProps) {
  return (
    <MenuItem onClick={props.onClick}>
      <props.icon w="20px" h="20px" mr="0.6rem" />
      {props.label}
    </MenuItem>
  );
}
