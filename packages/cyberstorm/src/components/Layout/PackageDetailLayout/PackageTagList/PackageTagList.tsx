import styles from "./PackageTagList.module.css";
import { Category } from "../../../../schema";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-regular-svg-icons";
import { Tag } from "../../../Tag/Tag";

export interface PackageTagListProps {
  tags?: Category[];
}

export function PackageTagList(props: PackageTagListProps) {
  const { tags = [] } = props;

  const mappedPackageTagList = tags?.map(
    (category: Category, index: number) => {
      return (
        <Tag
          colorScheme="borderless_no_hover"
          key={index.toString()}
          label={category.name.toUpperCase()}
        />
      );
    }
  );

  return (
    <>
      <WrapperCard
        title="Tags"
        content={<div className={styles.list}>{mappedPackageTagList}</div>}
        headerIcon={<FontAwesomeIcon icon={faTag} fixedWidth />}
      />
    </>
  );
}

PackageTagList.displayName = "PackageTagList";
