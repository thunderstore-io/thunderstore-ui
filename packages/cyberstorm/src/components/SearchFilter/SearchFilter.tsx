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
export function SearchFilter(props: SearchFilterProps) {
  const { tags = [] } = props;

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
}

SearchFilter.displayName = "PackageListLayout";
