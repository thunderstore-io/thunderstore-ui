"use client";

import styles from "./PackageEditForm.module.css";
import { packageEditCategories } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  packageEditFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormMultiSelectSearch,
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { Alert, MultiSelectSearchOption, Tag } from "@thunderstore/cyberstorm";
import { ReactNode } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// TODO: Separate deprecation action from this form
// when we move away from the modal
// Package deprecation is done for the package, while other edits
// are for the package listing
export function PackageEditForm(props: {
  dialogOnChange?: (v: boolean) => void;
  options: MultiSelectSearchOption[];
  community: string;
  namespace: string;
  package: string;
  current_categories: { slug: string; name: string }[];
  isDeprecated: boolean;
  deprecationButton: ReactNode;
  packageDataUpdateTrigger: () => Promise<void>;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Changes saved!",
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        props.packageDataUpdateTrigger();
        onSubmitSuccess();
      }}
      onSubmitError={onSubmitError}
      schema={packageEditFormSchema}
      meta={{
        community: props.community,
        namespace: props.namespace,
        package: props.package,
        current_categories: props.current_categories.map((cat) => cat.slug),
      }}
      endpoint={packageEditCategories}
      formProps={{ className: styles.root }}
    >
      <div className={styles.dialog}>
        <div className={styles.main}>
          <div>
            <Alert
              icon={<FontAwesomeIcon icon={faCircleExclamation} />}
              content={
                "Changes might take several minutes to show publicly! Info shown below is always up to date."
              }
              variant="info"
            />
          </div>
          <div>
            <div className={styles.statusSection}>
              <div className={styles.title}>Package status</div>
              <div className={styles.statusTag}>
                <Tag
                  size="medium"
                  label={props.isDeprecated ? "DEPRECATED" : "ACTIVE"}
                  colorScheme={props.isDeprecated ? "yellow" : "success"}
                />
              </div>
            </div>
          </div>
          <div className={styles.categoriesSelect}>
            <div className={styles.title}>Edit categories</div>
            <div className={styles.title}>Current categories</div>
            {renderCurrentCategories(props.current_categories)}
            <div className={styles.title}>New categories</div>
            <FormMultiSelectSearch
              schema={packageEditFormSchema}
              name={"new_categories"}
              placeholder={"Select categories"}
              options={props.options}
              fieldFormFormatParser={(v: MultiSelectSearchOption[]) =>
                v.map((x) => x.value)
              }
            />
          </div>
        </div>
        <div className={styles.footer}>
          <FormSubmitButton text="Save changes" />
          {props.deprecationButton}
        </div>
      </div>
    </ApiForm>
  );
}

PackageEditForm.displayName = "PackageEditForm";

function renderCurrentCategories(
  categories: { name: string; slug: string }[]
): ReactNode {
  return (
    <div className={styles.currentCategories}>
      {categories.map((cat) => {
        return (
          <Tag
            colorScheme="borderless_no_hover"
            size="mediumPlus"
            key={cat.slug}
            label={cat.name.toUpperCase()}
          />
        );
      })}
    </div>
  );
}
