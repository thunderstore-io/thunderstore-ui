import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PackageCategory,
  PackageListings,
  Section,
} from "@thunderstore/dapper/types";
import { useDeferredValue, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import { CategoryMenu } from "./FilterMenus/CategoryMenu";
import { OthersMenu } from "./FilterMenus/OthersMenu";
import { SectionMenu } from "./FilterMenus/SectionMenu";
import styles from "./PackageSearch.module.css";
import packageListStyles from "./PackageList.module.css";
import { CategorySelection } from "./types";
import { PackageCard, Pagination, TextInput } from "@thunderstore/cyberstorm";
import { useNavigation, useSearchParams } from "@remix-run/react";
import { StalenessIndicator } from "@thunderstore/cyberstorm/src/components/StalenessIndicator/StalenessIndicator";
import { PackageCount } from "./PackageCount";
import { PackageOrder, PackageOrderOptions } from "./PackageOrder";

const PER_PAGE = 20;

interface Props {
  listings: PackageListings;
  packageCategories: PackageCategory[];
  sections: Section[];
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const { listings, packageCategories: allCategories, sections } = props;
  const allSections = sections.sort((a, b) => a.priority - b.priority);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [searchValue, setSearchValue] = useState(
    searchParams.getAll("search").join(" ")
  );

  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );
  const [section, setSection] = useState(allSections[0]?.uuid ?? "");
  const [deprecated, setDeprecated] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(PackageOrderOptions.Updated);
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");
  const [updatedAfter, setUpdatedAfter] = useState("");
  const [updatedBefore, setUpdatedBefore] = useState("");

  const deferredCategories = useDeferredValue(categories);
  const deferredDeprecated = useDeferredValue(deprecated);
  const deferredNsfw = useDeferredValue(nsfw);
  const deferredSection = useDeferredValue(section);

  const deferredPage = useDeferredValue(page);
  const deferredOrder = useDeferredValue(order);

  const deferredIncludedCategories = deferredCategories
    .filter((c) => c.selection === "include")
    .map((c) => c.id);
  const deferredExcludedCategories = deferredCategories
    .filter((c) => c.selection === "exclude")
    .map((c) => c.id);

  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const deferredCreatedAfter = useDeferredValue(createdAfter);
  const deferredCreatedBefore = useDeferredValue(createdBefore);
  const deferredUpdatedAfter = useDeferredValue(updatedAfter);
  const deferredUpdatedBefore = useDeferredValue(updatedBefore);

  useEffect(() => {
    if (debouncedSearchValue === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", debouncedSearchValue);
    }

    if (deferredDeprecated === false) {
      searchParams.delete("deprecated");
    } else {
      searchParams.set("deprecated", "true");
    }

    if (deferredNsfw === false) {
      searchParams.delete("nsfw");
    } else {
      searchParams.set("nsfw", "true");
    }

    if (deferredSection === "") {
      searchParams.delete("section");
    } else {
      searchParams.set("section", deferredSection);
    }

    if (deferredIncludedCategories.length === 0) {
      searchParams.delete("includedCategories");
    } else {
      searchParams.set(
        "includedCategories",
        deferredIncludedCategories.join(",")
      );
    }

    if (deferredExcludedCategories.length === 0) {
      searchParams.delete("excludedCategories");
    } else {
      searchParams.set(
        "excludedCategories",
        deferredExcludedCategories.join(",")
      );
    }

    if (deferredPage === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", String(deferredPage));
    }

    if (deferredOrder === PackageOrderOptions.Updated) {
      searchParams.delete("order");
    } else {
      searchParams.set("order", deferredOrder);
    }

    if (deferredCreatedAfter === "") {
      searchParams.delete("created_after");
    } else {
      searchParams.set("created_after", deferredCreatedAfter);
    }

    if (deferredCreatedBefore === "") {
      searchParams.delete("created_before");
    } else {
      searchParams.set("created_before", deferredCreatedBefore);
    }

    if (deferredUpdatedAfter === "") {
      searchParams.delete("updated_after");
    } else {
      searchParams.set("updated_after", deferredUpdatedAfter);
    }

    if (deferredUpdatedBefore === "") {
      searchParams.delete("updated_before");
    } else {
      searchParams.set("updated_before", deferredUpdatedBefore);
    }

    setSearchParams(searchParams);
  }, [
    debouncedSearchValue,
    deferredDeprecated,
    deferredNsfw,
    deferredSection,
    deferredCategories,
    deferredPage,
    deferredOrder,
    deferredCreatedAfter,
    deferredCreatedBefore,
    deferredUpdatedAfter,
    deferredUpdatedBefore,
  ]);

  return (
    <div className={styles.root}>
      <TextInput
        placeholder="Filter Mods..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        leftIcon={<FontAwesomeIcon icon={faSearch} />}
      />

      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.dateFilterInputs}>
            <h2 className={styles.dateFilterHeader}>Updated</h2>
            <input
              type="date"
              className={styles.dateFilterInput}
              onChange={(e) => setUpdatedAfter(e.target.value)}
            />
            <input
              type="date"
              className={styles.dateFilterInput}
              onChange={(e) => setUpdatedBefore(e.target.value)}
            />
          </div>
          <div className={styles.dateFilterInputs}>
            <h2 className={styles.dateFilterHeader}>Created</h2>
            <input
              type="date"
              className={styles.dateFilterInput}
              onChange={(e) => setCreatedAfter(e.target.value)}
            />
            <input
              type="date"
              className={styles.dateFilterInput}
              onChange={(e) => setCreatedBefore(e.target.value)}
            />
          </div>
          <SectionMenu
            allSections={allSections}
            selected={section}
            setSelected={setSection}
          />

          <CategoryMenu categories={categories} setCategories={setCategories} />

          <OthersMenu
            deprecated={deprecated}
            setDeprecated={setDeprecated}
            nsfw={nsfw}
            setNsfw={setNsfw}
          />
        </div>

        <div className={styles.content}>
          <CategoryTagCloud
            categories={categories}
            setCategories={setCategories}
          />
          <div className={styles.root}>
            <div className={packageListStyles.top}>
              <StalenessIndicator
                isStale={navigation.state === "loading" ? true : false}
              >
                <PackageCount
                  page={page}
                  pageSize={PER_PAGE}
                  searchQuery={debouncedSearchValue}
                  totalCount={listings.count}
                />
              </StalenessIndicator>

              <PackageOrder order={order} setOrder={setOrder} />
            </div>

            <StalenessIndicator
              isStale={navigation.state === "loading" ? true : false}
              className={packageListStyles.packages}
            >
              {listings.results.map((p) => (
                <PackageCard key={`${p.namespace}-${p.name}`} package={p} />
              ))}
            </StalenessIndicator>
            <StalenessIndicator
              isStale={navigation.state === "loading" ? true : false}
            >
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                pageSize={PER_PAGE}
                siblingCount={2}
                totalCount={listings.count}
              />
            </StalenessIndicator>
          </div>
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";
