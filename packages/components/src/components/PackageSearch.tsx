import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { DebouncedEventHandler } from "@thunderstore/hooks";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { FilterIcon, SearchIcon } from "./Icons";
import { MultiSelect, SelectOption } from "./Select";
import { ToggleSwitch } from "./ToggleSwitch";

export type PackageOrdering = "downloaded" | "newest" | "rated" | "updated";

interface PackageSearchProps {
  /** Available options for excludedCategories and includedCategories props. */
  categories: SelectOption[];
  /** Should deprecated mod(packs) be included in results. */
  deprecated: boolean;
  /** Categories currently selected to be included in results. */
  excludedCategories: string[];
  /** Categories currently selected to be excluded from results. */
  includedCategories: string[];
  /** Should Not Safe For Work mod(packs) be included in results. */
  nsfw: boolean;
  /** Attribute to sort the packages by. */
  ordering: PackageOrdering;
  /** Free text search to filter the results. */
  query: string;
  /** State setter for `deprecated` prop. */
  setDeprecated: Dispatch<SetStateAction<boolean>>;
  /** State setter for `excludedCategories` prop. */
  setExcludedCategories: Dispatch<SetStateAction<string[]>>;
  /** State setter for `includedCategories` prop. */
  setIncludedCategories: Dispatch<SetStateAction<string[]>>;
  /** State setter for `nsfw` prop. */
  setNsfw: Dispatch<SetStateAction<boolean>>;
  /** State setter for `ordering` prop. */
  setOrdering: Dispatch<SetStateAction<PackageOrdering>>;
  /**
   * State setter for `query` prop.
   *
   * To avoid filtering results on each keypress, this should use the
   * debounced setter provided by useDebouncedInput hook from
   * @thunderstore/hooks.
   **/
  setQueryDebounced: DebouncedEventHandler;
}

/**
 * Component for filtering and ordering PackageCards in list views.
 */
export const PackageSearch: React.FC<PackageSearchProps> = (props) => {
  const {
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
  } = props;
  const [showFilters, setShowFilters] = useState(false);

  // Show extra filters initially if any of them are active to avoid
  // confusion when the filters are activated by the URL used to enter
  // the page.
  useEffect(() => {
    setShowFilters(
      deprecated ||
        excludedCategories.length > 0 ||
        includedCategories.length > 0 ||
        nsfw
    );
  }, []);

  return (
    <>
      <Flex align="center" h="64px" p="10px 0">
        <Flex
          as="form"
          method="get"
          name="community-packages-form"
          align="center"
          bgColor="ts.darkBlue"
          borderRadius={3}
          h="44px"
          minW="250px"
          mr="10px"
          w="600px"
          sx={{ columnGap: 5, rowGap: 5 }}
        >
          <Input
            autoComplete="off"
            defaultValue={query}
            name="q"
            onChange={setQueryDebounced}
            placeholder="Search for a mod here…"
            type="text"
            bg="transparent"
            border="none"
            color="ts.white"
            flex="1 1 auto"
          />

          <Box h="24px" bgColor="ts.lightBlue" flex="0 0 2px" />

          <Button
            onClick={() => setShowFilters((old) => !old)}
            title={showFilters ? "Hide filters" : "Show filters"}
            bg={showFilters ? "ts.lightBlue" : "ts.darkBlue"}
            borderRadius="3px"
            flex="0 0 46px"
            h="34px"
            _hover={{}}
          >
            <FilterIcon color={"ts.babyBlue"} />
          </Button>

          <Button
            title="Search"
            type="submit"
            bg={showFilters ? "ts.orange" : "ts.lightBlue"}
            borderRadius="3px"
            flex="0 0 76px"
            h="34px"
            mr="5px"
            _hover={{}}
          >
            <SearchIcon color={showFilters ? "ts.black" : "ts.babyBlue"} />
          </Button>
        </Flex>

        <Spacer />

        <OrderingButtons selected={ordering} setOrdering={setOrdering} />
      </Flex>

      <Flex
        display={showFilters ? "flex" : "none"}
        flexWrap="wrap"
        sx={{ columnGap: 10 }}
      >
        <Box flex="0 1 600px">
          <FormLabel htmlFor="package-search-inc-cats" variant="ts">
            Included Categories
          </FormLabel>
          <MultiSelect
            inputId="package-search-inc-cats"
            onChange={(selected) => {
              setIncludedCategories(selected.map((s) => s.value));
            }}
            options={categories}
            selectedOptions={categories.filter((c) =>
              includedCategories.includes(c.value)
            )}
          />

          <FormLabel htmlFor="package-search-exc-cats" variant="ts">
            Excluded Categories
          </FormLabel>
          <MultiSelect
            inputId="package-search-exc-cats"
            onChange={(selected) => {
              setExcludedCategories(selected.map((s) => s.value));
            }}
            options={categories}
            selectedOptions={categories.filter((c) =>
              excludedCategories.includes(c.value)
            )}
          />
        </Box>

        <Box flex="1 1 auto">
          <FormLabel onClick={() => setNsfw((x) => !x)} variant="ts">
            Show NSFW
          </FormLabel>
          <ToggleSwitch value={nsfw} setValue={setNsfw} />

          <FormLabel onClick={() => setDeprecated((x) => !x)} variant="ts">
            Show Deprecated
          </FormLabel>
          <ToggleSwitch value={deprecated} setValue={setDeprecated} />
        </Box>
      </Flex>
    </>
  );
};

interface OrderingButtonsProps {
  selected: PackageOrdering;
  setOrdering: Dispatch<SetStateAction<PackageOrdering>>;
}

/**
 * Buttons for sorting the search results.
 */
const OrderingButtons: React.FC<OrderingButtonsProps> = (props) => {
  const { selected, setOrdering } = props;
  const buttons: [string, PackageOrdering][] = [
    ["Last Updated", "updated"],
    ["Newest", "newest"],
    ["Most Downloaded", "downloaded"],
    ["Top Rated", "rated"],
  ];

  return (
    <Flex>
      {buttons.map(([label, ordering]) => (
        <Flex
          key={ordering}
          onClick={() => setOrdering(ordering)}
          align="center"
          bg={ordering === selected ? "ts.lightBlue" : "transparent"}
          color={ordering === selected ? "ts.white" : "#ffffffb3"}
          cursor="pointer"
          fontSize={14}
          fontWeight={600}
          h="44px"
          justify="center"
          ml="10px"
          p="10px 12px"
          _hover={{ color: "ts.white" }}
        >
          <Text textAlign="center">{label}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
