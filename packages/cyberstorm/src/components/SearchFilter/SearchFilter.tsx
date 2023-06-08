import styles from "./Searchfilter.module.css";
import { Tag } from "../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";

export interface SearchFilterProps {
  tags?: Array<string>;
}

/**
 * Cyberstorm SearchFilter
 */
export function SearchFilter(props: SearchFilterProps) {
  const { tags = [] } = props;

  const tagList = tags?.map((tagLabel: string, index: number) => {
    return (
      <Tag
        colorScheme="removable"
        key={index.toString()}
        label={tagLabel}
        rightIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
      />
    );
  });

  return (
    <>
      <div className={styles.selectedTags}>
        {tagList}
        <Button
          size="small"
          colorScheme="transparentDefault"
          label="Clear all"
        />
      </div>
    </>
  );
}

SearchFilter.displayName = "PackageListLayout";
