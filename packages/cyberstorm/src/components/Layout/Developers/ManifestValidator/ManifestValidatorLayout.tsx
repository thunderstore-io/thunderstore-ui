"use client";
import styles from "./ManifestValidatorLayout.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { TitleOnlyBreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";

const PAGE_TITLE = "Manifest Validator";

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
      breadCrumb={<TitleOnlyBreadCrumbs pageTitle={PAGE_TITLE} />}
      header={<PageHeader title={PAGE_TITLE} />}
      mainContent={
        <SettingItem
          title={PAGE_TITLE}
          description="Select a team to validate a package"
          content={valdatorContent}
        />
      }
    />
  );
}

ManifestValidatorLayout.displayName = "ManifestValidatorLayout";
