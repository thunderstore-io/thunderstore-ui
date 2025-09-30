import "./ServiceAccounts.css";
import {
  NewAlert,
  NewButton,
  Modal,
  NewTable,
  NewIcon,
  NewTextInput,
  Heading,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  ApiError,
  RequestConfig,
  teamAddServiceAccount,
  TeamServiceAccountAddRequestData,
  teamServiceAccountRemove,
} from "@thunderstore/thunderstore-api";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { type OutletContextShape } from "../../../../../root";
import { useReducer, useState } from "react";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const tools = getSessionTools();
      const config = tools?.getConfig();
      const dapper = new DapperTs(() => {
        return {
          apiHost: config?.apiHost,
          sessionId: config?.sessionId,
        };
      });
      return {
        teamName: params.namespaceId,
        serviceAccounts: await dapper.getTeamServiceAccounts(
          params.namespaceId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];

export default function ServiceAccounts() {
  const { teamName, serviceAccounts } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const revalidator = useRevalidator();

  const toast = useToast();

  async function serviceAccountRevalidate() {
    revalidator.revalidate();
  }

  // Remove service account stuff
  const removeServiceAccountAction = ApiAction({
    endpoint: teamServiceAccountRemove,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Service account removed`,
        duration: 4000,
      });
      serviceAccountRevalidate();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  const tableData = serviceAccounts.map((serviceAccount, index) => {
    return [
      {
        value: (
          <p className="team-service-accounts__nickname">
            {serviceAccount.name}
          </p>
        ),
        sortValue: serviceAccount.name,
      },
      {
        value: (
          <p className="team-service-accounts__last-used">
            {serviceAccount.last_used ?? "Never"}
          </p>
        ),
        sortValue: serviceAccount.last_used ?? "0",
      },
      {
        value: (
          <Modal
            key={`${serviceAccount.name}_${index}`}
            popoverId={`memberKickModal-${serviceAccount.name}-${index}`}
            title="Confirm service account removal"
            trigger={
              <NewButton
                csVariant="danger"
                popoverTarget={`memberKickModal-${serviceAccount.name}-${index}`}
                popoverTargetAction="show"
                csSize="xsmall"
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faTrash} />
                </NewIcon>
                Remove
              </NewButton>
            }
            csSize="small"
          >
            <div className="modal-content">
              <div className="modal-content__header">
                Remove service account
              </div>
              <div className="modal-content__body">
                <NewAlert csVariant="warning">
                  This cannot be undone! Related API token will stop working
                  immediately if the service account is removed.
                </NewAlert>
                <div>
                  You are about to remove service account{" "}
                  <span className="team-service-accounts__highlight">
                    {serviceAccount.name}
                  </span>
                  .
                </div>
              </div>
              <div className="modal-content__footer">
                <NewButton
                  onClick={() => {
                    removeServiceAccountAction({
                      config: outletContext.requestConfig,
                      params: {
                        team_name: teamName,
                        uuid: serviceAccount.identifier,
                      },
                      queryParams: {},
                      data: {},
                    });
                  }}
                  csVariant="danger"
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faTrash} />
                  </NewIcon>
                  Remove service account
                </NewButton>
              </div>
            </div>
          </Modal>
        ),
        sortValue: 0,
      },
    ];
  });

  // Add service account stuff
  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountToken, setAddedServiceAccountToken] = useState("");
  const [addedServiceAccountNickname, setAddedServiceAccountNickname] =
    useState("");

  function onSuccess(
    result: Awaited<ReturnType<typeof teamAddServiceAccount>>
  ) {
    setServiceAccountAdded(true);
    setAddedServiceAccountToken(result.api_token);
    setAddedServiceAccountNickname(result.nickname);
    serviceAccountRevalidate();
  }

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Service accounts</p>
          <p className="settings-items__description">Your loyal servants</p>
          <Modal
            popoverId="serviceAccountAdd"
            trigger={
              <NewButton
                popoverTarget="serviceAccountAdd"
                popoverTargetAction="show"
              >
                Add Service Account
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faPlus} />
                </NewIcon>
              </NewButton>
            }
            csSize="small"
          >
            {serviceAccountAdded ? (
              <div className="modal-content">
                <div className="modal-content__content">
                  <p>
                    New service account{" "}
                    <span>{addedServiceAccountNickname}</span> was created
                    successfully. It can be used with this API token:
                  </p>
                  <div>
                    <pre>{addedServiceAccountToken}</pre>
                    {/* <CopyButton text={addedServiceAccountToken} /> */}
                  </div>
                  <NewAlert csVariant="info">
                    Store this token securely, as it can&apos;t be retrieved
                    later, and treat it as you would treat an important
                    password.
                  </NewAlert>
                </div>
                <div className="modal-content__footer">
                  <NewButton
                    onClick={() => {
                      setAddedServiceAccountToken("");
                      setAddedServiceAccountNickname("");
                      setServiceAccountAdded(false);
                    }}
                    popoverTarget="serviceAccountAdd"
                    popoverTargetAction="hide"
                  >
                    Close
                  </NewButton>
                </div>
              </div>
            ) : (
              <AddServiceAccountForm
                onSuccess={onSuccess}
                teamName={teamName}
                config={outletContext.requestConfig}
              />
            )}
          </Modal>
        </div>
        <div className="settings-items__content">
          <NewTable
            titleRowContent={<Heading csLevel="3">Service Accounts</Heading>}
            headers={serviceAccountColumns}
            rows={tableData}
            sortByHeader={1}
            sortDirection={TableSort.ASC}
          />
        </div>
      </div>
    </div>
  );
}

function AddServiceAccountForm(props: {
  teamName: string;
  config: () => RequestConfig;
  onSuccess: (
    result: Awaited<ReturnType<typeof teamAddServiceAccount>>
  ) => void;
}) {
  const toast = useToast();

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
      config: props.config,
      params: { team_name: props.teamName },
      queryParams: {},
      data: { nickname: data.nickname },
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
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Service account added`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <div className="modal-content">
      <div className="modal-content__header">Add service account</div>
      <div className="modal-content__body">
        <div>
          Enter the nickname of the service account you wish to add to the team{" "}
          <span>{props.teamName}</span>
        </div>
        <div>
          <NewTextInput
            onChange={(e) => {
              updateFormFieldState({
                field: "nickname",
                value: e.target.value,
              });
            }}
            placeholder={"ExampleName"}
          />
        </div>
      </div>
      <div className="modal-content__footer">
        <NewButton onClick={strongForm.submit}>Add Service Account</NewButton>
      </div>
    </div>
  );
}
