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
import { TextInput, Dialog, Button } from "@thunderstore/cyberstorm";
import { SettingItem } from "@thunderstore/cyberstorm/src/components/SettingItem/SettingItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { packageUpload } from "@thunderstore/thunderstore-api";

const options = [
  { label: "Asd", value: "asd" },
  { label: "Asd2", value: "asd2" },
  { label: "Asd3", value: "asd3" },
  { label: "Asd4", value: "asd4" },
  { label: "Asd5", value: "asd5" },
  { label: "Asd6", value: "asd6" },
  { label: "Asd7", value: "asd7" },
  { label: "Asd8", value: "asd8" },
  { label: "Asd9", value: "asd9" },
  { label: "Asd10", value: "asd10" },
  { label: "Asd11", value: "asd11" },
  { label: "Asd12", value: "asd12" },
  { label: "Asd13", value: "asd13" },
  { label: "Asd14", value: "asd14" },
];

interface UploadPackageFormProps {
  teams: {
    name: string;
  }[];
}

export function UploadPackageForm(props: UploadPackageFormProps) {
  const toaster = useFormToaster({
    successMessage: "Package submitted",
  });

  // Parse categories to the right format for form
  function communityCategoriesParse(
    selected: {
      label: string;
      value: string;
    }[],
    onChange: (selected: { [key: string]: string[] }) => void
  ) {
    const communityCategories: { [key: string]: string[] } = {};
    selected.map((x) => (communityCategories[x.value] = [x.value]));
    onChange(communityCategories);
  }

  // Parse communities to the right format for form
  function communitiesParse(
    selected: {
      label: string;
      value: string;
    }[],
    onChange: (selected: string[]) => void
  ) {
    onChange(selected.map((x) => x.value));
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
          content={<TextInput />}
        />
        <div className={styles.line} />
        <SettingItem
          title="Team"
          description="No teams available?"
          additionalLeftColumnContent={
            <Dialog.Root
              title="Create Team"
              trigger={
                <Button.Root colorScheme="primary" paddingSize="large">
                  <Button.ButtonLabel>Create team</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <CreateTeamForm />
            </Dialog.Root>
          }
          content={
            <FormSelectSearch
              name="team"
              schema={uploadPackageFormSchema}
              options={props.teams.map((t) => t.name)}
              placeholder="Choose a team..."
            />
          }
        />
        <SettingItem
          title="Communities"
          description="Select communities you want your package to be listed under. Current community is selected by default."
          content={
            <FormMultiSelectSearch
              name="communities"
              schema={uploadPackageFormSchema}
              options={options}
              placeholder="Choose community..."
              onChangeParse={communitiesParse}
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
              onChangeParse={communityCategoriesParse}
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
