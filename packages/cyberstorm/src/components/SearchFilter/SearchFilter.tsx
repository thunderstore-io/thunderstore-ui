import React from "react";
import styles from "./Searchfilter.module.css";
import { Tag } from "../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import { TextInput } from "../TextInput/TextInput";

export interface SearchFilterProps {
  tags?: Array<string>;
}

/**
 * Cyberstorm SearchFilter
 */
export const SearchFilter: React.FC<SearchFilterProps> = (props) => {
  const { tags } = props;

  const tagList = tags?.map((tagLabel: string, index: number) => {
    return (
      <Tag
        key={index.toString()}
        label={tagLabel}
        isRemovable
        rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
      />
    );
  });

  return (
    <div className={styles.root}>
      <TextInput
        placeHolder="Search..."
        leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
      />
      <div className={styles.selectedTags}>
        {tagList}
        <Button
          size="small"
          colorScheme="transparentDefault"
          label="Clear all"
        />
      </div>
    </div>
  );
};

SearchFilter.displayName = "PackageListLayout";
SearchFilter.defaultProps = { tags: [] };