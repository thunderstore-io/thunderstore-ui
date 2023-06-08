import styles from "./ManifestValidatorLayout.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { ManifestValidatorLink } from "../../../Links/Links";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";

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
          <ManifestValidatorLink>Manifest Validator</ManifestValidatorLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Manifest Validator" />}
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
