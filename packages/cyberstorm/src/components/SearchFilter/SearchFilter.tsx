import styles from "./Searchfilter.module.css";
import { Tag } from "../Tag/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as Button from "../Button/";
import { Icon } from "../Icon/Icon";

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
        rightIcon={
          <Icon>
            <FontAwesomeIcon icon={faXmark} />
          </Icon>
        }
      />
    );
  });

  return (
    <>
      <div className={styles.selectedTags}>
        {tagList}
        <Button.Root paddingSize="small" colorScheme="transparentDefault">
          <Button.ButtonLabel fontSize="small">Clear all</Button.ButtonLabel>
        </Button.Root>
      </div>
    </>
  );
}

SearchFilter.displayName = "SearchFilter";
