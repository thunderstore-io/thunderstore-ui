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

import {
  ChevronDown,
  DiscordLogo,
  GitHubLogo,
  ThunderstoreLogo,
} from "./Icons";
import {
  AnonymousLink,
  CommunitiesLink,
  IndexLink,
  PackageUploadLink,
} from "./Links";

/**
 * Navigation bar shown on every page.
 *
 * TODO: doesn't support logging in or displaying content based on
 * user's authentication status.
 */
export const TopBar: React.FC = () => (
  <Flex align="center" h={100}>
    <IndexLink variant="ts.topBarIndex" align="center" display="flex">
      <ThunderstoreLogo height="20px" mr="7px" width="20px" />
      Thunderstore
    </IndexLink>
    <Spacer />
    <Flex>
      <PackageUploadLink variant="ts.topBar">Upload</PackageUploadLink>
      <CommunitiesLink variant="ts.topBar">Browse</CommunitiesLink>
      <LoginMenu />
    </Flex>
  </Flex>
);

const LoginMenu = () => (
  <Menu variant="ts.topBar">
    <MenuButton as={Button} rightIcon={<ChevronDown />} variant="ts.topBarMenu">
      Login with…
    </MenuButton>

    <MenuList
      backgroundColor="ts.darkBlue"
      border="none"
      borderRadius="0"
      minW="115px"
      p="0"
    >
      {/* TODO: proper URLs for MenuLink components */}
      <MenuLink icon={DiscordLogo} label="Discord" url="/" />
      <MenuLink icon={GitHubLogo} label="GitHub" url="/" />
    </MenuList>
  </Menu>
);

interface MenuLinkProps {
  icon: React.FC<IconProps>;
  label: string;
  url: string;
}

const MenuLink: React.FC<MenuLinkProps> = (props) => {
  return (
    <MenuItem>
      <AnonymousLink url={props.url} variant="ts.topBarMenu">
        <props.icon w="20px" h="20px" mr="0.6rem" />
        {props.label}
      </AnonymousLink>
    </MenuItem>
  );
};
