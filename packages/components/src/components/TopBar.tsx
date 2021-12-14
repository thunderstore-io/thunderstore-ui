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

const baseLinkStyles = {
  fontFamily: "Raleway",
  fontSize: "16px",
  fontWeight: 900,
  lineHeight: "20px",
  _hover: { textDecoration: "underline solid white 2px" },
};

const linkStyles = {
  ...baseLinkStyles,
  fontWeight: 700,
  ml: "40px",
};

/**
 * Navigation bar shown on every page.
 *
 * TODO: doesn't support logging in or displaying content based on
 * user's authentication status.
 */
export const TopBar: React.FC = () => (
  <Flex align="center" h={200} pb={100}>
    <IndexLink {...baseLinkStyles} align="center" display="flex">
      <ThunderstoreLogo height="20px" mr="7px" width="20px" />
      Thunderstore
    </IndexLink>
    <Spacer />
    <Flex>
      <PackageUploadLink {...linkStyles}>Upload</PackageUploadLink>
      <CommunitiesLink {...linkStyles}>Browse</CommunitiesLink>
      <LoginMenu />
    </Flex>
  </Flex>
);

const LoginMenu = () => (
  <Menu>
    <MenuButton
      as={Button}
      backgroundColor="transparent"
      fontFamily="Raleway"
      fontWeight="700"
      fontSize="16px"
      h="20px"
      lineHeight="20px"
      ml="40px"
      p="0"
      rightIcon={<ChevronDown />}
      w="115px"
      _active={{ backgroundColor: "transparent" }}
      _focus={{ boxShadow: "none !important" }}
      _hover={{ backgroundColor: "transparent" }}
    >
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
  const highlight = { backgroundColor: "ts.lightBlue" };

  return (
    <MenuItem p="0" _active={highlight} _focus={highlight} _hover={highlight}>
      <AnonymousLink
        url={props.url}
        display="block"
        p="0.4rem 0.8rem"
        w="100%"
        _hover={{ textDecoration: "none" }}
      >
        <props.icon w="20px" h="20px" mr="0.6rem" />
        {props.label}
      </AnonymousLink>
    </MenuItem>
  );
};
