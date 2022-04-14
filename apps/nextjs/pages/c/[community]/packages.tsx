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
import { Dapper, useDapper } from "@thunderstore/dapper";
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
import { API_DOMAIN } from "utils/constants";
import * as urlQuery from "utils/urlQuery";

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
  const dapper = useDapper();

  useEffect(() => {
    (async () => {
      const page = 1; // TODO: implement and use pagination (infinite scroll).
      const response = await dapper.getCommunityPackageListing(
        communityIdentifier,
        ordering,
        page,
        query,
        sections,
        includedCategories,
        excludedCategories,
        deprecated,
        nsfw
      );

      setPackages(response.packages);
    })();
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

  if (!community || Array.isArray(community)) {
    return { notFound: true };
  }

  const dapper = new Dapper(API_DOMAIN);
  const pageProps = await dapper.getCommunityPackageListing(
    community,
    urlQuery.getString(context.query.ordering) ?? "last-updated",
    1, // Page number
    urlQuery.getString(context.query.q),
    urlQuery.getStringArray(context.query.sections),
    urlQuery.getStringArray(context.query.included_categories),
    urlQuery.getStringArray(context.query.excluded_categories),
    urlQuery.getBoolean(context.query.deprecated),
    urlQuery.getBoolean(context.query.nsfw)
  );

  return {
    props: {
      ...pageProps,
      communityIdentifier: community,
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
