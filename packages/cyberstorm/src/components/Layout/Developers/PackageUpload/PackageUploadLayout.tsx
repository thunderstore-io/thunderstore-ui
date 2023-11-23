"use client";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageUploadLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { UploadPackageForm } from "@thunderstore/cyberstorm-forms";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

/**
 * Cyberstorm PackageUpload Layout
 */

export function PackageUploadLayout() {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  // TODO: Somehow grab categories from all the selected communities and pass them on
  // const communities = usePromise(dapper.getCommunities, []);
  // const filters = usePromise(dapper.getCommunityFilters, [communityId])
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <PackageUploadLink>Package Upload</PackageUploadLink>
        </BreadCrumbs>
      }
      header={<Title text="Upload Package" />}
      mainContent={<UploadPackageForm teams={user.teams} />}
    />
  );
}

PackageUploadLayout.displayName = "PackageUploadLayout";
