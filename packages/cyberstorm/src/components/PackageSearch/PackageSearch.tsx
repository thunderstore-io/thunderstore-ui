"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageCategory, Section } from "@thunderstore/dapper/types";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import { CategoryMenu } from "./FilterMenus/CategoryMenu";
import { OthersMenu } from "./FilterMenus/OthersMenu";
import { SectionMenu } from "./FilterMenus/SectionMenu";
import styles from "./PackageSearch.module.css";
import { CategorySelection } from "./types";
import { Icon } from "../Icon/Icon";
import { PackageList } from "../PackageList/PackageList";
import { TextInput } from "../TextInput/TextInput";

interface Props {
  communityId?: string;
  packageCategories: PackageCategory[];
  sections: Section[];
  teamId?: string;
  userId?: string;
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const {
    communityId,
    packageCategories: allCategories,
    sections,
    teamId,
    userId,
  } = props;

  const allSections = sections.sort((a, b) => a.priority - b.priority);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );
  const [section, setSection] = useState(allSections[0]?.slug ?? "");
  const [deprecated, setDeprecated] = useState(false);
  const [nsfw, setNsfw] = useState(false);

  return (
    <div className={styles.root}>
      <TextInput
        placeHolder="Filter Mods..."
        value={searchValue}
        setValue={setSearchValue}
        leftIcon={
          <Icon>
            <FontAwesomeIcon icon={faSearch} />
          </Icon>
        }
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
            communityId={communityId}
            userId={userId}
            teamId={teamId}
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
