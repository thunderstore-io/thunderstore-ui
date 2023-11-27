"use client";

import styles from "./UploadPackageForm.module.css";
import {
  ApiForm,
  uploadPackageFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormMultiSelectSearch,
  FormSelectSearch,
  useFormToaster,
  CreateTeamForm,
  FormSwitch,
} from "@thunderstore/cyberstorm-forms";
import { Dialog, Button } from "@thunderstore/cyberstorm";
import { SettingItem } from "@thunderstore/cyberstorm/src/components/SettingItem/SettingItem";
import { packageUpload } from "@thunderstore/thunderstore-api";
import { usePromise } from "@thunderstore/use-promise";
import { useDapper } from "@thunderstore/dapper";

const options = [
  { label: "Asd", value: "asd asd" },
  { label: "Asd2", value: "asd2 asd2" },
  { label: "Asd3", value: "asd3 asd3" },
  { label: "Asd4", value: "asd4 asd4" },
  { label: "Asd5", value: "asd5 asd5" },
  { label: "Asd6", value: "asd6 asd6" },
];

export function UploadPackageForm() {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const communities = usePromise(dapper.getCommunities, []);

  const toaster = useFormToaster({
    successMessage: "Package submitted",
  });

  function communitiesParse(
    selected: {
      label: string;
      value: string;
    }[]
  ) {
    return selected.map((x) => x.value);
  }

  function communityCategoriesParse(
    selected: {
      label: string;
      value: string;
    }[]
  ) {
    const communityCategories: { [key: string]: string[] } = {};
    // TODO: Instead of getting the value from splitting a string, have it be passed in an object
    selected.map(
      (x) => (communityCategories["community_identifier"] = [x.value])
    );
    return communityCategories;
  }

  return (
    <ApiForm
      {...toaster}
      schema={uploadPackageFormSchema}
      endpoint={packageUpload}
      formProps={{ className: styles.root }}
    >
      <div className={styles.root}>
        <SettingItem
          title="Upload file"
          description="Upload your package as a ZIP file."
          content={<>upload block here</>}
        />
        <div className={styles.line} />
        <SettingItem
          title="Team"
          description="Select the team you want your package to be associated with."
          content={
            <div className={styles.teamContentWrapper}>
              <FormSelectSearch
                name="team"
                schema={uploadPackageFormSchema}
                options={user.teams.map((t) => t.name)}
                placeholder="Choose a team..."
              />
              <div className={styles.createTeamSentence}>
                <span>No teams available?</span>
                <Dialog.Root
                  title="Create Team"
                  trigger={
                    <button className={styles.createTeamModalLink}>
                      Create Team
                    </button>
                  }
                >
                  <CreateTeamForm />
                </Dialog.Root>
              </div>
            </div>
          }
        />
        <SettingItem
          title="Communities"
          description="Select communities you want your package to be listed under."
          content={
            <FormMultiSelectSearch
              name="communities"
              schema={uploadPackageFormSchema}
              options={communities.results.map((c) => {
                return { label: c.name, value: c.identifier };
              })}
              placeholder="Choose community..."
              fieldFormFormatParser={communitiesParse}
            />
          }
        />
        <SettingItem
          title="Categories"
          description="Select descriptive categories to help people discover your package."
          content={
            <FormMultiSelectSearch
              name="community_categories"
              schema={uploadPackageFormSchema}
              options={options}
              placeholder="Choose categories..."
              fieldFormFormatParser={communityCategoriesParse}
            />
          }
        />
        <div className={styles.line} />
        <SettingItem
          title="Contains NSFW content"
          description='A "NSFW" -tag will be applied to your package.'
          content={
            <FormSwitch
              schema={uploadPackageFormSchema}
              name="has_nsfw_content"
            />
          }
        />
        <div className={styles.line} />
        <SettingItem
          title="Submit"
          description='Double-check your selections and hit "Submit" when you are ready!'
          content={
            <div className={styles.submit}>
              <Button.Root colorScheme="danger">
                <Button.ButtonLabel>Reset</Button.ButtonLabel>
              </Button.Root>
              <FormSubmitButton text="Submit" />
            </div>
          }
        />
      </div>
    </ApiForm>
  );
}

UploadPackageForm.displayName = "UploadPackageForm";
