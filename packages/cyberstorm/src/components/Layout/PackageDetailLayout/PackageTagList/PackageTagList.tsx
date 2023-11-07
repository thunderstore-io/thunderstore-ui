import styles from "./PackageTagList.module.css";
import { Package } from "@thunderstore/dapper/types";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-regular-svg-icons";
import { Tag } from "../../../Tag/Tag";
import {
  faThumbtack,
  faWarning,
  faLips,
  faSparkles,
} from "@fortawesome/pro-solid-svg-icons";
import { ReactNode } from "react";

export interface PackageTagListProps {
  packageData: Package;
}

export function PackageTagList(props: PackageTagListProps) {
  const { packageData } = props;

  return (
    <>
      <WrapperCard
        title="Tags"
        content={
          <div className={styles.list}>{getPackageFlags(packageData)}</div>
        }
        headerIcon={<FontAwesomeIcon icon={faTag} />}
      />
    </>
  );
}

PackageTagList.displayName = "PackageTagList";

function getPackageFlags(packageData: Package) {
  const updateTimeDelta = Math.round(
    (Date.now() - Date.parse(packageData.last_updated)) / 86400000
  );
  const isNew = updateTimeDelta < 3;
  if (
    !packageData.is_pinned &&
    !packageData.is_nsfw &&
    !packageData.is_deprecated &&
    !isNew
  ) {
    return null;
  }
  const flagList: ReactNode[] = [];
  if (packageData.is_pinned) {
    flagList.push(
      <Tag
        key="flag_pinned"
        label="Pinned"
        colorScheme="blue"
        size="mediumPlus"
        leftIcon={<FontAwesomeIcon icon={faThumbtack} />}
      />
    );
  }
  if (packageData.is_deprecated) {
    flagList.push(
      <Tag
        key="flag_deprecated"
        label="Deprecated"
        colorScheme="yellow"
        size="mediumPlus"
        leftIcon={<FontAwesomeIcon icon={faWarning} />}
      />
    );
  }
  if (packageData.is_nsfw) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="NSFW"
        colorScheme="pink"
        size="mediumPlus"
        leftIcon={<FontAwesomeIcon icon={faLips} />}
      />
    );
  }
  if (isNew) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="New"
        colorScheme="green"
        size="mediumPlus"
        leftIcon={<FontAwesomeIcon icon={faSparkles} />}
      />
    );
  }
  return flagList;
}
