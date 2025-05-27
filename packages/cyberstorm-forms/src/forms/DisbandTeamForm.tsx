import styles from "./DisbandTeamForm.module.css";
import {
  ApiError,
  RequestConfig,
  teamDisband,
} from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamDisbandFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { CyberstormLink } from "@thunderstore/cyberstorm";
import { teamDisbandRequestParamsSchema } from "@thunderstore/thunderstore-api";

export function DisbandTeamForm(props: {
  teamName: string;
  config: () => RequestConfig;
}) {
  // const { onSubmitSuccess, onSubmitError } = useFormToaster({
  //   successMessage: (props) => `Team ${props.teamName} disbanded`,
  // });

  const { onSubmitSuccess, onSubmitError } = useFormToaster<
    object,
    { error?: Error | ApiError; message?: string }
  >({
    successMessage: () => `Team ${props.teamName} disbanded`,
    errorMessage: (errorProps) =>
      errorProps.message ?? "Please check the form for errors and try again.",
  });

  return (
    <ApiForm
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      endpoint={teamDisband}
      formProps={{ className: styles.root }}
      params={{ team_name: props.teamName }}
      queryParams={{}}
      config={props.config}
      schema={teamDisbandRequestParamsSchema}
    >
      <div className={styles.dialog}>
        <p className={styles.description}>
          As a precaution, to disband your team, please input {props.teamName}{" "}
          into the field below.
        </p>
        <FormTextInput
          schema={teamDisbandFormSchema}
          name={"verification"}
          placeholder={"Verification"}
        />
        <div className={styles.dialogText}>
          You are about to disband the team{" "}
          <CyberstormLink linkId="Team" team={props.teamName}>
            <span className={styles.kickDescriptionUserName}>
              {props.teamName}
            </span>
          </CyberstormLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton csVariant="danger">Disband team</FormSubmitButton>
      </div>
    </ApiForm>
  );
}

DisbandTeamForm.displayName = "DisbandTeamForm";
