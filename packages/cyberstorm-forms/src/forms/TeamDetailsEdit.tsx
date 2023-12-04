"use client";

import styles from "./TeamDetailsEdit.module.css";
import { teamDetailsEdit } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamDetailsEditFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { SettingItem } from "@thunderstore/cyberstorm/src/components/SettingItem/SettingItem";

export function TeamDetailsEdit({ teamName }: { teamName: string }) {
  const toaster = useFormToaster({
    successMessage: "Changes saved",
  });

  const dapper = useDapper();
  const team = usePromise(dapper.getTeamDetails, [teamName]);

  return (
    <ApiForm
      {...toaster}
      schema={teamDetailsEditFormSchema}
      metaData={{ teamIdentifier: team.name }}
      endpoint={teamDetailsEdit}
      formProps={{ className: styles.root }}
    >
      <div className={styles.root}>
        <div className={styles.section}>
          <SettingItem
            title="Team donation link"
            content={
              <div className={styles.donationLink}>
                <div className={styles.donationLinkLabel}>URL</div>
                <div className={styles.donationLinkActions}>
                  <div className={styles.donationLinkTextInput}>
                    <FormTextInput
                      schema={teamDetailsEditFormSchema}
                      name={"donation_link"}
                      placeholder={"https://"}
                      existingValue={
                        team.donation_link === null
                          ? undefined
                          : team.donation_link
                      }
                    />
                  </div>
                </div>
              </div>
            }
          />
        </div>
        <div className={styles.saveChangesWrapper}>
          <FormSubmitButton text="Save changes" />
        </div>
      </div>
    </ApiForm>
  );
}

TeamDetailsEdit.displayName = "TeamDetailsEdit";
