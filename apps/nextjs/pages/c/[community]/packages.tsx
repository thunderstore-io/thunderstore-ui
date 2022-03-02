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
import { Category, categoriesToSelectOptions } from "utils/transforms/category";
import {
  BackendPackageCard,
  packageCardsToProps,
} from "utils/transforms/packageCard";

interface PageProps {
  categories: SelectOption[];
  communityName: string;
  communityIdentifier: string;
  coverImage: string;
  packages: PackageCardProps[];
}

export default function CommunityPackages(props: PageProps): JSX.Element {
  const { categories, communityName, communityIdentifier, coverImage } = props;
  const [packages, setPackages] = useState<PackageCardProps[]>(props.packages);

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
  const [ordering, setOrdering] = useState<PackageOrdering>("last-updated");

  // TODO: Fetch actual data from backend.
  useEffect(() => {
    setPackages(
      packageCardsToProps(
        getFakeDataPackages(
          communityIdentifier,
          itemType,
          query,
          ordering,
          includedCategories,
          excludedCategories,
          nsfw,
          deprecated
        )
      )
    );
  }, [
    communityIdentifier,
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
  const categoryOnClick = (tagId: string) => {
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
                LinkProps: { communityIdentifier },
                label: communityName,
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
          columnGap="20px"
          justify="center"
          m="28px 0 60px 0"
          rowGap="20px"
          wrap="wrap"
        >
          {packages.map((cardProps) => (
            <PackageCard
              key={`${cardProps.communityIdentifier}-${cardProps.packageName}`}
              categoryOnClick={categoryOnClick}
              {...cardProps}
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

  const data = getFakeData(
    community,
    "mods",
    "",
    "last-updated",
    [],
    [],
    false,
    false
  );

  return {
    props: {
      categories: categoriesToSelectOptions(data.categories),
      communityName: data.community_name,
      communityIdentifier: community,
      coverImage: data.bg_image_src,
      packages: packageCardsToProps(data.packages),
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

interface FakeData {
  categories: Category[];
  community_name: string;
  bg_image_src: string;
  packages: BackendPackageCard[];
}

const getFakeData = (
  communityIdentifier: string,
  _itemType: ItemTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
  query: string,
  _ordering: PackageOrdering, // eslint-disable-line @typescript-eslint/no-unused-vars
  includedCategories: string[],
  excludedCategories: string[],
  nsfw: boolean,
  deprecated: boolean
): FakeData => {
  const packages = getFakeDataPackages(
    communityIdentifier,
    _itemType,
    query,
    _ordering,
    includedCategories,
    excludedCategories,
    nsfw,
    deprecated
  );

  return {
    bg_image_src: "https://api.lorem.space/image/game?w=2000&h=200",
    categories: getFakeCategories(),
    community_name: communityIdentifier,
    packages,
  };
};

/**
 * TODO: Packages should be fetched in batches with infinite scroll.
 * TODO: Packages can be mods or modpacks.
 * TODO: Ordering.
 */
const getFakeDataPackages = (
  communityIdentifier: string,
  _itemType: ItemTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
  query: string,
  _ordering: PackageOrdering, // eslint-disable-line @typescript-eslint/no-unused-vars
  includedCategories: string[],
  excludedCategories: string[],
  nsfw: boolean,
  deprecated: boolean
): BackendPackageCard[] => {
  let packages = [
    ...Array(30)
      .fill(0)
      .map((_x, i) => ({
        categories:
          i % 4 === 0
            ? [
                { slug: "items", name: "Items" },
                { slug: "tweaks", name: "Tweaks" },
                { slug: "mods", name: "Mods" },
              ]
            : i % 4 === 1
            ? [
                { slug: "items", name: "Items" },
                { slug: "tweaks", name: "Tweaks" },
              ]
            : i % 4 === 2
            ? [{ slug: "items", name: "Items" }]
            : [],
        community_name: communityIdentifier,
        community_identifier: communityIdentifier,
        description:
          "Adds item drop on killing the Shopkeeper, and several new items.",
        download_count: 40,
        image_src:
          i === 0 || i % 5
            ? "https://api.lorem.space/image/game?w=266&h=200"
            : null,
        is_deprecated: i !== 0 && i % 8 === 0,
        is_nsfw: i !== 0 && i % 6 === 0,
        is_pinned: i < 3,
        last_updated: "2021-12-17T15:00:00Z",
        rating_score: 600,
        package_name: "NewtDrop",
        team_name: "BoneCapTheTweet",
      })),
  ];

  if (query !== "") {
    const q = query.toLowerCase();
    packages = packages.filter((p) => p.description.toLowerCase().includes(q));
  }

  if (includedCategories.length) {
    packages = packages.filter((p) => {
      const packageCategories = p.categories.map((c) => c.slug);
      return includedCategories.every((slug) =>
        packageCategories.includes(slug)
      );
    });
  }

  if (excludedCategories.length) {
    packages = packages.filter((p) => {
      const packageCategories = p.categories.map((c) => c.slug);
      return !excludedCategories.some((slug) =>
        packageCategories.includes(slug)
      );
    });
  }

  if (!nsfw) {
    packages = packages.filter((p) => !p.is_nsfw);
  }

  if (!deprecated) {
    packages = packages.filter((p) => !p.is_deprecated);
  }

  return packages;
};

/**
 * TODO: Categories should be fetched from the backend, either with the
 * same request as the first batch of packages, or in a separate request.
 */
const getFakeCategories = () => [
  { slug: "items", name: "Items" },
  { slug: "tweaks", name: "Tweaks" },
  { slug: "mods", name: "Mods" },
  { slug: "tools", name: "Tools" },
  { slug: "maps", name: "Maps" },
  { slug: "skins", name: "Skins" },
  { slug: "audio", name: "Audio" },
  { slug: "player-characters", name: "Player Characters" },
  { slug: "client-side", name: "Client-side" },
  { slug: "server-side", name: "Server-side" },
  { slug: "language", name: "Language" },
];
