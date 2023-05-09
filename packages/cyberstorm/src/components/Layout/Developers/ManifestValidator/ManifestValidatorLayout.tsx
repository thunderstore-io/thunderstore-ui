import styles from "./ManifestValidatorLayout.module.css";
import { Title } from "../../../Title/Title";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { ManifestValidatorLink } from "../../../Links/Links";

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
