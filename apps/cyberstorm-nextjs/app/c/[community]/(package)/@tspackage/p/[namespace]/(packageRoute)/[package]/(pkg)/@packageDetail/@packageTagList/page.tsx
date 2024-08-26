"use client";
import { Tag } from "@thunderstore/cyberstorm";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import styles from "./PackageTagList.module.css";
import { useDapper } from "@thunderstore/dapper";
import { PackageListingDetails } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";
import { ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import {
  faThumbtack,
  faWarning,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

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

function getPackageFlags(packageData: PackageListingDetails) {
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
        leftIcon={<FontAwesomeIcon icon={faBomb} />}
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
        leftIcon={<FontAwesomeIcon icon={faBomb} />}
      />
    );
  }
  return flagList;
}
