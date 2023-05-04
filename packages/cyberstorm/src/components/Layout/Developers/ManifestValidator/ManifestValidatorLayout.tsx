import styles from "./ManifestValidatorLayout.module.css";
import { Title } from "../../../Title/Title";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm ManifestValidator Layout
 */
export function ManifestValidatorLayout() {
  const valdatorContent = (
    <div className={styles.content}>
      <TextInput />
      <TextInput />
    </div>
  );

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunityLink community={"Developers"}>Developers</CommunityLink>
        </BreadCrumbs>
      }
      header={<Title text="Manifest Validator" />}
      mainContent={
        <SettingItem
          title="Manifest Validator"
          description="Select a team to validate a package"
          content={valdatorContent}
        />
      }
    />
  );
}

ManifestValidatorLayout.displayName = "ManifestValidatorLayout";
ManifestValidatorLayout.defaultProps = {};
