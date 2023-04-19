import styles from "./PackageFormatDocsLayout.module.css";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";

/**
 * Cyberstorm PackageFormatDocs Layout
 */
export function PackageFormatDocsLayout() {
  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"Developers"}>Developers</CommunityLink>
      </BreadCrumbs>
      <Title text="Package Format Docs" />
    </div>
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";
PackageFormatDocsLayout.defaultProps = {};
