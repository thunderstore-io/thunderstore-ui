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
import { fakeCategories, fakeData } from "placeholder/packageListing";
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
  const [sections, setSections] = useQueryToState("sections", queryToStrs);
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

  // TODO: should this be read from GET parameters as well?
  const [ordering, setOrdering] = useState<PackageOrdering>("last-updated");

  // TODO: Fetch actual data from backend.
  useEffect(() => {
    setPackages(
      packageCardsToProps(
        getFakeDataPackages(
          communityIdentifier,
          sections,
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
    sections,
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
                LinkProps: { community: communityIdentifier },
                label: communityName,
              },
              { label: "Packages" },
            ]}
          />

          <Spacer />

          <SectionOption
            section="mods"
            sections={sections}
            setSections={setSections}
          />
          <SectionOption
            section="modpacks"
            sections={sections}
            setSections={setSections}
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
    [],
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

type Sections = "mods" | "modpacks";

interface SectionOptionProps extends FlexProps {
  sections: string[];
  setSections: Dispatch<SetStateAction<string[]>>;
  section: Sections;
}

const SectionOption: FC<SectionOptionProps> = (props) => {
  const { section, sections, setSections, ...flexProps } = props;

  return (
    <Flex
      onClick={() => setSections([section])}
      align="center"
      bg={sections.includes(section) ? "#20294199" : "transparent"}
      cursor="pointer"
      fontWeight={700}
      h="50px"
      justify="center"
      p="15px"
      w="150px"
      {...flexProps}
    >
      <Text textTransform="capitalize">{section}</Text>
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
  sections: string[],
  query: string,
  _ordering: PackageOrdering,
  includedCategories: string[],
  excludedCategories: string[],
  nsfw: boolean,
  deprecated: boolean
): FakeData => {
  const packages = getFakeDataPackages(
    communityIdentifier,
    sections,
    query,
    _ordering,
    includedCategories,
    excludedCategories,
    nsfw,
    deprecated
  );

  return {
    bg_image_src: "https://api.lorem.space/image/game?w=2000&h=200",
    categories: fakeCategories,
    community_name: communityIdentifier,
    packages,
  };
};

/**
 * TODO: Packages should be fetched in batches with infinite scroll.
 * TODO: Ordering.
 */
const getFakeDataPackages = (
  communityIdentifier: string,
  _sections: string[], // eslint-disable-line @typescript-eslint/no-unused-vars
  query: string,
  _ordering: PackageOrdering, // eslint-disable-line @typescript-eslint/no-unused-vars
  includedCategories: string[],
  excludedCategories: string[],
  nsfw: boolean,
  deprecated: boolean
): BackendPackageCard[] => {
  let packages = fakeData.map((p) => ({
    ...p,
    community_name: communityIdentifier,
    community_identifier: communityIdentifier,
  }));

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
