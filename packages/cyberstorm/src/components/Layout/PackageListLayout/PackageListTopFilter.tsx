import React from "react";
import styles from "./PackageListTopFilter.module.css";
import { Tag } from "../../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../Button/Button";
import { TextInput } from "../../TextInput/TextInput";

export interface PackageListTopFilterProps {}

/**
 * Cyberstorm PackageListTopFilter
 */
export const PackageListTopFilter: React.FC<PackageListTopFilterProps> = (
  props
) => {
  return (
    <div className={styles.root}>
      <TextInput
        placeHolder="Search..."
        leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
      />
      <div className={styles.selectedTags}>
        <Tag
          label={'"My search term"'}
          isRemovable
          rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
        />
        <Tag
          label={"Skins"}
          isRemovable
          rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
        />
        <Tag
          label={"Tweaks"}
          isRemovable
          rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
        />
        <Tag
          label={"Tools"}
          isRemovable
          rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
        />
        <Button size="small" colorScheme="transparent" label="Clear all" />
      </div>
    </div>
  );
};

PackageListTopFilter.displayName = "PackageListLayout";
PackageListTopFilter.defaultProps = { title: "V Rising" };
