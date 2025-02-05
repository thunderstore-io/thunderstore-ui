import styles from "./TeamDetailsEdit.module.css";
import { RequestConfig, teamDetailsEdit } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamDetailsEditFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { SettingItem } from "@thunderstore/cyberstorm/src/components/SettingItem/SettingItem";
import { TeamDetails } from "@thunderstore/dapper/types";

export function TeamDetailsEdit({
  team,
  updateTrigger,
  config,
}: {
  team: TeamDetails;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Changes saved",
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        updateTrigger();
      }}
      onSubmitError={onSubmitError}
      schema={teamDetailsEditFormSchema}
      meta={{ teamIdentifier: team.name }}
      endpoint={teamDetailsEdit}
      formProps={{ className: styles.root }}
      config={config}
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
