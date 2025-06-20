import styles from "./CreateTeamForm.module.css";
import {
  ApiForm,
  createTeamFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export function CreateTeamForm(props: {
  config: () => RequestConfig;
  updateTrigger: () => Promise<void>;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Team created",
  });
  return <p>Form is currently disabled.</p>;

  // return (
  //   <ApiForm
  //     config={props.config}
  //     onSubmitSuccess={() => {
  //       props.updateTrigger();
  //       onSubmitSuccess();
  //     }}
  //     onSubmitError={onSubmitError}
  //     schema={createTeamFormSchema}
  //     meta={{}}
  //     endpoint={createTeam}
  //     formProps={{ className: styles.root }}
  //   >
  //     <div className={styles.dialog}>
  //       <div className={styles.dialogText}>
  //         Enter the name of the team you wish to create. Team names can contain
  //         the characters a-z A-Z 0-9 _ and must not start or end with an _
  //       </div>
  //       <div>
  //         <FormTextInput
  //           schema={createTeamFormSchema}
  //           name={"name"}
  //           placeholder={"ExampleName"}
  //         />
  //       </div>
  //     </div>
  //     <div className={styles.footer}>
  //       <FormSubmitButton text="Create" />
  //     </div>
  //   </ApiForm>
  // );
}

CreateTeamForm.displayName = "CreateTeamForm";
