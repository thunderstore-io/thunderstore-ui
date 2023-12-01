"use client";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageUploadLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { UploadPackageForm } from "@thunderstore/cyberstorm-forms";

/**
 * Cyberstorm PackageUpload Layout
 */

export function PackageUploadLayout() {
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <PackageUploadLink>Package Upload</PackageUploadLink>
        </BreadCrumbs>
      }
      header={<Title text="Upload Package" />}
      mainContent={<UploadPackageForm />}
    />
  );
}

PackageUploadLayout.displayName = "PackageUploadLayout";
