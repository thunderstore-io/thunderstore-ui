"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PackageCategory,
  PackageListingType,
  Section,
} from "@thunderstore/dapper/types";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import { CategoryMenu } from "./FilterMenus/CategoryMenu";
import { OthersMenu } from "./FilterMenus/OthersMenu";
import { SectionMenu } from "./FilterMenus/SectionMenu";
import styles from "./PackageSearch.module.css";
import { CategorySelection } from "./types";
import { PackageList } from "../PackageList/PackageList";
import { TextInput } from "../TextInput/TextInput";

interface Props {
  listingType: PackageListingType;
  packageCategories: PackageCategory[];
  sections: Section[];
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const { listingType, packageCategories: allCategories, sections } = props;
  const allSections = sections.sort((a, b) => a.priority - b.priority);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );
  const [section, setSection] = useState(allSections[0]?.uuid ?? "");
  const [deprecated, setDeprecated] = useState(false);
  const [nsfw, setNsfw] = useState(false);

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

          <PackageList
            listingType={listingType}
            searchQuery={debouncedSearchValue}
            categories={categories}
            section={section}
            deprecated={deprecated}
            nsfw={nsfw}
          />
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";
