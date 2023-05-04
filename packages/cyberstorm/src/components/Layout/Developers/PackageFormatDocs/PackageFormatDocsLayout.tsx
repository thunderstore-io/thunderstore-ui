import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm PackageFormatDocs Layout
 */
export function PackageFormatDocsLayout() {
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunityLink community={"Developers"}>Developers</CommunityLink>
        </BreadCrumbs>
      }
      header={<Title text="Package Format Docs" />}
    />
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";
PackageFormatDocsLayout.defaultProps = {};
