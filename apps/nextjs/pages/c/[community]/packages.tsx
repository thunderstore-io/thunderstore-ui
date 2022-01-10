import { Flex, FlexProps, Spacer, Text } from "@chakra-ui/react";
import {
  BreadCrumbs,
  CommunityLink,
  PackageCard,
  PackageCardProps,
  PackageOrdering,
  PackageSearch,
  PackageUploadLink,
  SelectOption,
} from "@thunderstore/components";
import { useDebouncedInput } from "@thunderstore/hooks";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { Background } from "components/Background";
import { ContentWrapper } from "components/Wrapper";
import {
  queryToBool,
  queryToStr,
  queryToStrs,
  useQueryToState,
} from "hooks/useQueryToState";

type Packages = Omit<PackageCardProps, "tagOnClick">[];

interface PageProps {
  categories: SelectOption[];
  community: string;
  coverImage: string;
  packages: Packages;
}

export default function CommunityPackages(props: PageProps): JSX.Element {
  const { categories, community, coverImage } = props;
  const [packages, setPackages] = useState(props.packages);

  // Read initial filter values from GET parameters and store them in state.
  const [deprecated, setDeprecated] = useQueryToState<boolean>(
    "deprecated",
    queryToBool
  );
  const [excludedCategories, setExcludedCategories] = useQueryToState(
    "excluded_categories",
    queryToStrs
  );
  const [includedCategories, setIncludedCategories] = useQueryToState(
    "included_categories",
    queryToStrs
  );
  const [nsfw, setNsfw] = useQueryToState<boolean>("nsfw", queryToBool);

  // The query parameter can't use useQueryToState due to being debounced.
  const { query: routeQuery } = useRouter();
  const [query, setQueryDebounced, setQueryNow] = useDebouncedInput("");

  useEffect(() => {
    setQueryNow(queryToStr(routeQuery.q));
  }, [queryToStr, routeQuery.q, setQueryNow]);

  useEffect(() => {
    return () => setQueryDebounced.cancel();
  }, []);

  // TODO: should these be read from GET parameters as well?
  const [itemType, setItemType] = useState<ItemTypes>("mods");
  const [ordering, setOrdering] = useState<PackageOrdering>("updated");

  // TODO: Fetch actual data from backend.
  useEffect(() => {
    setPackages(
      getFakeData(
        community,
        itemType,
        query,
        ordering,
        includedCategories,
        excludedCategories,
        nsfw,
        deprecated
      )
    );
  }, [
    community,
    deprecated,
    excludedCategories,
    includedCategories,
    itemType,
    nsfw,
    ordering,
    query,
    setPackages,
  ]);

  // TODO: Currently clicking a tag on package card first sets it into
  // included categories, second click moves it to excluded categories.
  // The idea was that third click would remove it from exluded
  // categories, but since no card containing the tag will be visible if
  // the category is excluded, that won't work...
  const tagOnClick = (tagId: string) => {
    if (includedCategories.includes(tagId)) {
      setIncludedCategories(
        includedCategories.filter((catId) => catId !== tagId)
      );
      if (!excludedCategories.includes(tagId)) {
        setExcludedCategories([...excludedCategories, tagId]);
      }
    } else {
      setIncludedCategories([...includedCategories, tagId]);
    }
  };

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

        {/* SEARCH SECTION */}
        <PackageSearch
          {...{
            categories,
            deprecated,
            excludedCategories,
            includedCategories,
            nsfw,
            ordering,
            query,
            setDeprecated,
            setExcludedCategories,
            setIncludedCategories,
            setNsfw,
            setOrdering,
            setQueryDebounced,
          }}
        />

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
      categories: getFakeCategories(),
      community,
      coverImage: "https://api.lorem.space/image/game?w=2000&h=200",
      packages: getFakeData(
        community,
        "mods",
        "",
        "updated",
        [],
        [],
        false,
        false
      ),
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
 * TODO: Ordering.
 */
const getFakeData = (
  communityName: string,
  _itemType: ItemTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
  query: string,
  _ordering: PackageOrdering, // eslint-disable-line @typescript-eslint/no-unused-vars
  includedCategories: string[],
  excludedCategories: string[],
  nsfw: boolean,
  deprecated: boolean
): Packages => {
  let packages = [
    ...Array(30)
      .fill(0)
      .map((_x, i) => ({
        communityName,
        deprecated: i !== 0 && i % 8 === 0,
        description:
          "Adds item drop on killing the Shopkeeper, and several new items.",
        downloadCount: 40,
        imageSrc:
          i === 0 || i % 5
            ? "https://api.lorem.space/image/game?w=266&h=200"
            : null,
        lastUpdated: "2021-12-17T15:00:00Z",
        likeCount: 600,
        nsfw: i !== 0 && i % 6 === 0,
        packageName: "NewtDrop",
        pinned: i < 3,
        tags:
          i % 4 === 0
            ? [
                { id: "1", label: "Items" },
                { id: "2", label: "Tweaks" },
                { id: "3", label: "Mods" },
              ]
            : i % 4 === 1
            ? [
                { id: "1", label: "Items" },
                { id: "2", label: "Tweaks" },
              ]
            : i % 4 === 2
            ? [{ id: "1", label: "Items" }]
            : [],
        teamName: "BoneCapTheTweet",
      })),
  ];

  if (query !== "") {
    const q = query.toLowerCase();
    packages = packages.filter((p) => p.description.toLowerCase().includes(q));
  }

  if (includedCategories.length) {
    packages = packages.filter((p) => {
      const packageCategories = p.tags.map((tag) => tag.id.toString());
      return includedCategories.every((id) => packageCategories.includes(id));
    });
  }

  if (excludedCategories.length) {
    packages = packages.filter((p) => {
      const packageCategories = p.tags.map((tag) => tag.id.toString());
      return !excludedCategories.some((id) => packageCategories.includes(id));
    });
  }

  if (!nsfw) {
    packages = packages.filter((p) => !p.nsfw);
  }

  if (!deprecated) {
    packages = packages.filter((p) => !p.deprecated);
  }

  return packages;
};

/**
 * TODO: Categories should be fetched from the backend, either with the
 * same request as the first batch of packages, or in a separate request.
 */
const getFakeCategories = (): SelectOption[] => [
  { value: "1", label: "Items" },
  { value: "2", label: "Tweaks" },
  { value: "3", label: "Mods" },
  { value: "4", label: "Tools" },
  { value: "5", label: "Maps" },
  { value: "6", label: "Skins" },
  { value: "7", label: "Audio" },
  { value: "8", label: "Player Characters" },
  { value: "9", label: "Client-side" },
  { value: "10", label: "Server-side" },
  { value: "11", label: "Language" },
];
