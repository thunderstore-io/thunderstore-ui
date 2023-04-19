import styles from "./ManifestValidatorLayout.module.css";
import { Title } from "../../../Title/Title";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";

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
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"Developers"}>Developers</CommunityLink>
      </BreadCrumbs>
      <Title text="Manifest Validator" />
      <SettingItem
        title="Manifest Validator"
        description="Select a team to validate a package"
        content={valdatorContent}
      />
    </div>
  );
}

ManifestValidatorLayout.displayName = "ManifestValidatorLayout";
ManifestValidatorLayout.defaultProps = {};
