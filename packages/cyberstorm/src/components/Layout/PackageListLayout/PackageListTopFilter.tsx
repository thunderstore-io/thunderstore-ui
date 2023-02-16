import React from "react";
import styles from "./PackageListTopFilter.module.css";
import { Tag } from "../../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../Button/Button";

export interface PackageListTopFilterProps {}

/**
 * Cyberstorm PackageListTopFilter
 */
export const PackageListTopFilter: React.FC<PackageListTopFilterProps> = (
  props
) => {
  return (
    <div className={styles.root}>
      <input type="text" />
      <div className={styles.selectedTags}>
        <Tag
          label={"My search term"}
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
        <Button label="Clear all" />
      </div>
    </div>
  );
};

PackageListTopFilter.displayName = "PackageListLayout";
PackageListTopFilter.defaultProps = { title: "V Rising" };
