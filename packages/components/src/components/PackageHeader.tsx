import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spacer,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMediaQuery } from "@thunderstore/hooks";
import React from "react";

import { MaybeImage } from "./Internals";
import { AnonymousLink, CommunityPackagesLink, TeamLink } from "./Links";

interface TagData {
  id: string;
  label: string;
}

export interface PackageHeaderProps {
  communityName: string;
  description: string;
  imageSrc: string | null;
  packageName: string;
  renderFullWidth?: boolean;
  tags: TagData[];
  teamName: string;
  url: string;
}

/**
 * Display package's image and basic information.
 */
export const PackageHeader: React.FC<PackageHeaderProps> = (props) => {
  const {
    communityName,
    description,
    imageSrc,
    packageName,
    renderFullWidth,
    tags,
    teamName,
    url,
  } = props;

  // Above the breakpoint image and text content are shown side by side.
  // Below it the image is shown as full-width, whereas the image
  // placeholder is not rendered at all.
  const aboveBreakpoint = useMediaQuery("(min-width: 816px)");
  let packageImage: JSX.Element | null = null;

  if (aboveBreakpoint || imageSrc) {
    const height = aboveBreakpoint && !imageSrc ? "256px" : "auto";
    packageImage = (
      <Box flex="1 1 256px">
        <MaybeImage height={height} imageSrc={imageSrc} />
      </Box>
    );
  }

  return (
    <Flex
      bgColor="ts.blue"
      borderColor="ts.lightBlue"
      borderWidth={2}
      minHeight="261px"
      flexWrap="wrap"
    >
      {packageImage}

      <Flex
        direction="column"
        flex="1 1 515px"
        minH="206px"
        p="30px 30px 10px 30px"
      >
        <Heading fontSize="30px" fontWeight={900} lineHeight="35px">
          {packageName}
        </Heading>

        <Text color="ts.coolGray" fontWeight={700} m="5px 0 20px 0">
          by
          <TeamLink team={teamName} color="ts.babyBlue" pl="4px">
            {teamName}
          </TeamLink>
          <chakra.span
            fontSize="32px"
            lineHeight="10px"
            margin="0 11px"
            verticalAlign="sub"
          >
            ·
          </chakra.span>
          <AnonymousLink url={url}>{url}</AnonymousLink>
        </Text>

        <Text color="ts.babyBlue" mb="20px">
          {description}
        </Text>

        {aboveBreakpoint ? <Spacer /> : null}

        <TagListing {...{ communityName, renderFullWidth, tags }} />
      </Flex>
    </Flex>
  );
};

type TagsProps = Pick<
  PackageHeaderProps,
  "communityName" | "renderFullWidth" | "tags"
>;

const TagListing: React.FC<TagsProps> = (props) => {
  const { communityName, renderFullWidth, tags } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tag = (tag: TagData) => (
    <CommunityPackagesLink
      community={communityName}
      key={tag.id}
      queryParams={`included_categories=${tag.id}`}
    >
      <Tag size="lg">{tag.label}</Tag>
    </CommunityPackagesLink>
  );

  // List all tags if there's only a few of them, or if the component is
  // rendered taking the whole width of the screen, since this tells us
  // we're in a mode where the component can safely grow vertically.
  if (renderFullWidth || tags.length < 4) {
    return (
      <Box alignSelf="reverse" mt={renderFullWidth ? "0" : "20px"}>
        {tags.map((t) => tag(t))}
      </Box>
    );
  }

  const visible = tags.slice(0, 3);
  const hidden = tags.slice(3);

  // If there's plenty of tags and limited space, display mosts of them
  // in a modal window.
  return (
    <Box alignSelf="reverse" mt={renderFullWidth ? "0" : "20px"}>
      {visible.map((t) => tag(t))}
      <Button onClick={onOpen} variant="ts.auxiliary" h="32.8px">
        Show {hidden.length} more
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All categories</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{hidden.map((t) => tag(t))}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ts.auxiliary">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
