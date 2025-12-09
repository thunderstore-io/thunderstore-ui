import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, useReducer, useState } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";

import {
  NewAlert,
  NewButton,
  Modal,
  NewIcon,
  NewTextInput,
  CodeBox,
} from "@thunderstore/cyberstorm";
import {
  teamAddServiceAccount,
  type TeamServiceAccountAddRequestData,
} from "@thunderstore/thunderstore-api";

import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { ServiceAccountsTable } from "./ServiceAccountsTable";
import "./ServiceAccounts.css";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    serviceAccounts: dapper.getTeamServiceAccounts(teamName),
  })
);

export default function ServiceAccounts() {
  const { teamName, serviceAccounts } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();

  async function serviceAccountRevalidate() {
    revalidator.revalidate();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={serviceAccounts}>
        {(resolvedServiceAccounts) => (
          <div className="settings-items">
            <div className="settings-items__item">
              <div className="settings-items__meta">
                <p className="settings-items__title">Service accounts</p>
                <p className="settings-items__description">
                  Your loyal servants
                </p>
                <AddServiceAccountForm
                  teamName={teamName}
                  serviceAccountRevalidate={serviceAccountRevalidate}
                />
              </div>
              <div className="settings-items__content">
                <ServiceAccountsTable
                  serviceAccounts={resolvedServiceAccounts}
                  serviceAccountRevalidate={serviceAccountRevalidate}
                  teamName={teamName}
                />
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

function AddServiceAccountForm(props: {
  teamName: string;
  serviceAccountRevalidate: () => Promise<void>;
}) {
  const outletContext = useOutletContext() as OutletContextShape;
  const [open, setOpen] = useState(false);
  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountToken, setAddedServiceAccountToken] = useState("");
  const [addedServiceAccountNickname, setAddedServiceAccountNickname] =
    useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isTeamOwner(props.teamName, outletContext.currentUser)) {
    return null;
  }

  function onSuccess(
    result: Awaited<ReturnType<typeof teamAddServiceAccount>>
  ) {
    setServiceAccountAdded(true);
    setAddedServiceAccountToken(result.api_token);
    setAddedServiceAccountNickname(result.nickname);
  }

  function formFieldUpdateAction(
    state: TeamServiceAccountAddRequestData,
    action: {
      field: keyof TeamServiceAccountAddRequestData;
      value: TeamServiceAccountAddRequestData[keyof TeamServiceAccountAddRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    nickname: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof teamAddServiceAccount>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamAddServiceAccount({
      config: outletContext.requestConfig,
      params: { team_name: props.teamName },
      queryParams: {},
      data: { nickname: data.nickname.trim() },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamServiceAccountAddRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    validators: { nickname: { required: true } },
    submitor,
    onSubmitSuccess: (result) => {
      onSuccess(result);
      setError(null);
      // Refresh the service accounts list to show the newly created account
      // TODO: When API returns identifier in response, we can append the new
      // service account to the list instead of refreshing from backend
      props.serviceAccountRevalidate();
    },
    onSubmitError: (error) => {
      const message = `Error occurred: ${error.message || "Unknown error"}`;
      setError(message);
    },
  });

  const nicknameFieldProps = strongForm.getFieldComponentProps("nickname");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setServiceAccountAdded(false);
      setAddedServiceAccountToken("");
      setAddedServiceAccountNickname("");
      setError(null);
      updateFormFieldState({ field: "nickname", value: "" });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton popoverTarget="serviceAccountAdd" popoverTargetAction="show">
          Add Service Account
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faPlus} />
          </NewIcon>
        </NewButton>
      }
      csSize="small"
      titleContent={
        serviceAccountAdded ? "Service Account Added" : "Add Service Account"
      }
    >
      {serviceAccountAdded ? (
        <Modal.Body>
          <p>
            New service account <span>{addedServiceAccountNickname}</span> was
            created successfully. It can be used with this API token:
          </p>
          <div>
            <CodeBox value={addedServiceAccountToken} />
          </div>
          <NewAlert csVariant="info">
            Store this token securely, as it can&apos;t be retrieved later, and
            treat it as you would treat an important password.
          </NewAlert>
        </Modal.Body>
      ) : (
        <>
          <Modal.Body>
            <div className="service-accounts__form">
              <div>
                Enter the nickname of the service account you wish to add to the
                team <span>{props.teamName}</span>
              </div>
              <label htmlFor="serviceAccountNickname">
                Nickname <span aria-hidden="true">*</span>
              </label>
              <div className="service-accounts__nickname-input">
                <NewTextInput
                  id="serviceAccountNickname"
                  value={formInputs.nickname}
                  onChange={(e) => {
                    updateFormFieldState({
                      field: "nickname",
                      value: e.target.value,
                    });
                  }}
                  placeholder={"ExampleName"}
                  maxLength={32}
                  required
                  {...nicknameFieldProps}
                />
                <div className="service-accounts__nickname-input-max-length">
                  Max. 32 characters
                </div>
              </div>
              {error && <NewAlert csVariant="danger">{error}</NewAlert>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <NewButton
              onClick={strongForm.submit}
              disabled={!strongForm.isReady}
            >
              Add Service Account
            </NewButton>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
