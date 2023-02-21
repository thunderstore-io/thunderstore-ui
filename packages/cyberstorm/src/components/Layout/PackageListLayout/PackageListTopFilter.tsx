import React from "react";
import styles from "./PackageListTopFilter.module.css";
import { Tag } from "../../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../Button/Button";
import { TextInput } from "../../TextInput/TextInput";

export interface PackageListTopFilterProps {
  tags?: Array<string>;
}

/**
 * Cyberstorm PackageListTopFilter
 */
export const PackageListTopFilter: React.FC<PackageListTopFilterProps> = (
  props
) => {
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

PackageListTopFilter.displayName = "PackageListLayout";
PackageListTopFilter.defaultProps = { tags: [] };
