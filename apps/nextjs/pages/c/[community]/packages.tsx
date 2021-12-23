import { Flex, FlexProps, Spacer, Text } from "@chakra-ui/react";

import {
  BreadCrumbs,
  CommunityLink,
  PackageCard,
  PackageCardProps,
  PackageUploadLink,
} from "@thunderstore/components";
import { GetServerSideProps } from "next";
import { Dispatch, FC, SetStateAction, useState } from "react";

import { Background } from "../../../components/Background";
import { ContentWrapper } from "../../../components/Wrapper";

type Packages = Omit<PackageCardProps, "tagOnClick">[];

interface PageProps {
  community: string;
  coverImage: string;
  packages: Packages;
}

export default function CommunityPackages(props: PageProps): JSX.Element {
  const { community, coverImage, packages } = props;
  const [itemType, setItemType] = useState<ItemTypes>("mods");

  const tagOnClick = (tagId: number) => console.log(tagId);

  return (
    <>
      <Background url={coverImage} />
      <ContentWrapper>
        {/* HEADER SECTION */}
        <Flex align="center" h="100px">
          <BreadCrumbs
            parts={[
              {
                LinkComponent: CommunityLink,
                LinkProps: { community },
                label: community,
              },
              { label: "Packages" },
            ]}
          />

          <Spacer />

          <TypeOption
            selectedType={itemType}
            setType={setItemType}
            type="mods"
          />
          <TypeOption
            selectedType={itemType}
            setType={setItemType}
            type="modpacks"
            ml="25px"
          />
        </Flex>

        {/* TODO: SEARCH SECTION */}

        {/* PACKAGE LISTING */}
        <Flex
          justify="center"
          m="28px 0 60px 0"
          wrap="wrap"
          sx={{ columnGap: 20, rowGap: 20 }}
        >
          {packages.map((cardProps, i) => (
            <PackageCard
              key={`${cardProps.packageName}-${i}`}
              {...cardProps}
              tagOnClick={tagOnClick}
            />
          ))}

          {!packages.length && (
            <Text>
              {"There's no packages here yet."}
              <PackageUploadLink ml="4px" textDecoration="underline">
                Upload the first one?
              </PackageUploadLink>
            </Text>
          )}
        </Flex>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const community = context.params?.community;

  // TODO: validate the community exists in database.
  if (!community || Array.isArray(community)) {
    return { notFound: true };
  }

  return {
    props: {
      community,
      coverImage: "https://api.lorem.space/image/game?w=2000&h=200",
      packages: getFakeData(community, "mods"),
    },
  };
};

type ItemTypes = "mods" | "modpacks";

interface TypeSelectorProps extends FlexProps {
  selectedType: ItemTypes;
  setType: Dispatch<SetStateAction<ItemTypes>>;
  type: ItemTypes;
}

const TypeOption: FC<TypeSelectorProps> = (props) => {
  const { selectedType, setType, type, ...flexProps } = props;

  return (
    <Flex
      onClick={() => setType(type)}
      align="center"
      bg={type === selectedType ? "#20294199" : "transparent"}
      cursor="pointer"
      fontWeight={700}
      h="50px"
      justify="center"
      p="15px"
      w="150px"
      {...flexProps}
    >
      <Text textTransform="capitalize">{type}</Text>
    </Flex>
  );
};

/**
 * TODO: Packages should be fetched in batches with infinite scroll.
 * TODO: Packages can be mods or modpacks.
 * TODO: Data should also contain id-name-pairs for tags.
 * TODO: Clicking a tag should update included/excluded categories.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFakeData = (communityName: string, _itemType: ItemTypes): Packages => {
  return [
    ...Array(30)
      .fill(0)
      .map((_x, i) => ({
        communityName,
        description:
          "Adds item drop on killing the Shopkeeper, and several new items.",
        downloadCount: 40,
        imageSrc:
          i === 0 || i % 5
            ? "https://api.lorem.space/image/game?w=266&h=200"
            : null,
        lastUpdated: "2021-12-17T15:00:00Z",
        likeCount: 600,
        packageName: "NewtDrop",
        pinned: true,
        // tagOnClick,
        tags: [
          { id: 1, label: "Items" },
          { id: 2, label: "Tweaks" },
          { id: 3, label: "Mods" },
        ],
        teamName: "BoneCapTheTweet",
      })),
  ];
};
