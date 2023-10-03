import styles from "./PackageTagList.module.css";
import { PackageCategory } from "@thunderstore/dapper/types";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-regular-svg-icons";
import { Tag } from "../../../Tag/Tag";
import { Icon } from "../../../Icon/Icon";

export interface PackageTagListProps {
  tags?: PackageCategory[];
}

export function PackageTagList(props: PackageTagListProps) {
  const { tags = [] } = props;

  const mappedPackageTagList = tags?.map((category, index) => {
    return (
      <Tag
        colorScheme="borderless_no_hover"
        key={index.toString()}
        label={category.name.toUpperCase()}
      />
    );
  });

  return (
    <>
      <WrapperCard
        title="Tags"
        content={<div className={styles.list}>{mappedPackageTagList}</div>}
        headerIcon={
          <Icon>
            <FontAwesomeIcon icon={faTag} />
          </Icon>
        }
      />
    </>
  );
}

PackageTagList.displayName = "PackageTagList";
