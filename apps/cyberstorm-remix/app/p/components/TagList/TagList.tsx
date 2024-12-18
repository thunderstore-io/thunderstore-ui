import { Heading, Tag } from "@thunderstore/cyberstorm";
import "../../packageListing.css";
import { PackageListingDetails } from "@thunderstore/dapper/types";
import { ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faWarning,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";

export default function TagList(props: { listing: PackageListingDetails }) {
  return (
    <>
      <div className="nimbus-packagelisting__sidebar__wrapper">
        <Heading
          csLevel="4"
          csSize="4"
          className="nimbus-packagelisting__sidebar__wrapper__title"
        >
          Categories
        </Heading>
        <div className="nimbus-packagelisting__sidebar__wrapper__categories_or_tags">
          {getPackageFlags(props.listing)}
        </div>
      </div>
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
