import {
  NewAlert,
  NewButton,
  Modal,
  NewTable,
  NewIcon,
  isRecord,
} from "@thunderstore/cyberstorm";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react";
import {
  ApiError,
  teamAddServiceAccount,
  teamServiceAccountRemove,
} from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamAddServiceAccountFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { z } from "zod";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { OutletContextShape } from "../../../../../root";
import { useState } from "react";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const dapper = window.Dapper;
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
        // REMIX TODO: Add sentry
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

interface ServiceAccountSuccessResponse {
  api_token: string;
  nickname: string;
  team_name: string;
}

function isServiceAccountSuccessResponse(
  responseBodyJson: unknown
): responseBodyJson is ServiceAccountSuccessResponse {
  return (
    isRecord(responseBodyJson) &&
    typeof responseBodyJson.api_token === "string" &&
    typeof responseBodyJson.nickname === "string" &&
    typeof responseBodyJson.team_name === "string"
  );
}

export default function ServiceAccounts() {
  const { teamName, serviceAccounts } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const revalidator = useRevalidator();

  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  async function serviceAccountRevalidate() {
    revalidator.revalidate();
  }

  const removeToast = useFormToaster({
    successMessage: `Service account removed from team`,
  });

  const addToast = useFormToaster({
    successMessage: "Service account created",
  });

  const [serviceAccountAdded, setServiceAccountAdded] = useState(true);
  const [addedServiceAccountToken, setAddedServiceAccountToken] = useState("");
  const [addedServiceAccountNickname, setAddedServiceAccountNickname] =
    useState("");

  function onSubmitSuccessExtra(responseBodyString: object) {
    // TODO: Fix the Result type resolving in the whole chain of ApiForm
    // It's now just assumed all results are objects
    if (isServiceAccountSuccessResponse(responseBodyString)) {
      setServiceAccountAdded(true);
      setAddedServiceAccountToken(responseBodyString.api_token);
      setAddedServiceAccountNickname(responseBodyString.nickname);
      serviceAccountRevalidate();
      addToast.onSubmitSuccess();
    } else {
      addToast.onSubmitError();
    }
  }

  const tableData = serviceAccounts.map((serviceAccount, index) => {
    return [
      { value: serviceAccount.name, sortValue: serviceAccount.name },
      {
        value: serviceAccount.last_used ?? "Never",
        sortValue: serviceAccount.last_used ?? "Never",
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
                {...{
                  popovertarget: `memberKickModal-${serviceAccount.name}-${index}`,
                  popovertargetaction: "open",
                }}
              >
                Remove
              </NewButton>
            }
          >
            <ApiForm
              onSubmitSuccess={() => {
                removeToast.onSubmitSuccess();
                serviceAccountRevalidate();
              }}
              onSubmitError={removeToast.onSubmitError}
              schema={z.object({})}
              endpoint={teamServiceAccountRemove}
              formProps={{ className: "nimbus-commonStyles-modalTempalate" }}
              meta={{
                serviceAccountIdentifier: serviceAccount.identifier,
                teamName: teamName,
              }}
              config={outletContext.requestConfig}
            >
              <div className="nimbus-commonStyles-modalTempalate__header">
                Remove service account
              </div>
              <div className="nimbus-commonStyles-modalTempalate__content">
                <NewAlert csVariant="warning">
                  This cannot be undone! Related API token will stop working
                  immediately if the service account is removed.
                </NewAlert>
                <div>
                  You are about to remove service account{" "}
                  <span>{serviceAccount.name}</span>.
                </div>
              </div>
              <div className="nimbus-commonStyles-modalTempalate__footer">
                <FormSubmitButton csVariant="danger">
                  Remove service account
                </FormSubmitButton>
              </div>
            </ApiForm>
          </Modal>
        ),
        sortValue: 0,
      },
    ];
  });

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
                {...{
                  popovertarget: "serviceAccountAdd",
                  popovertargetaction: "open",
                }}
              >
                Add Service Account
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faPlus} />
                </NewIcon>
              </NewButton>
            }
          >
            {serviceAccountAdded ? (
              <>
                <div className="nimbus-commonStyles-modalTempalate__content">
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
                <div className="nimbus-commonStyles-modalTempalate__footer">
                  <NewButton
                    onClick={() => {
                      setAddedServiceAccountToken("");
                      setServiceAccountAdded(false);
                    }}
                    {...{
                      popovertarget: "serviceAccountAdd",
                      popovertargetaction: "close",
                    }}
                  >
                    Close
                  </NewButton>
                </div>
              </>
            ) : (
              <ApiForm
                onSubmitSuccess={onSubmitSuccessExtra}
                onSubmitError={addToast.onSubmitError}
                schema={teamAddServiceAccountFormSchema}
                meta={{ teamIdentifier: teamName }}
                endpoint={teamAddServiceAccount}
                formProps={{ className: "__form" }}
                config={outletContext.requestConfig}
              >
                <div className="nimbus-commonStyles-modalTempalate__header">
                  Confirm service account removal
                </div>
                <div className="nimbus-commonStyles-modalTempalate__content">
                  <div>
                    Enter the nickname of the service account you wish to add to
                    the team <span>{teamName}</span>
                  </div>
                  <div>
                    <FormTextInput
                      schema={teamAddServiceAccountFormSchema}
                      name={"nickname"}
                      placeholder={"ExampleName"}
                    />
                  </div>
                </div>
                <div className="nimbus-commonStyles-modalTempalate__footer">
                  <FormSubmitButton>Add Service Account</FormSubmitButton>
                </div>
              </ApiForm>
            )}
          </Modal>
        </div>
        <div className="settings-items__content">
          <NewTable
            headers={serviceAccountColumns}
            rows={tableData}
            sortByHeader={1}
            sortDirection={TableSort.ASC}
            csModifiers={["alignLastColumnRight"]}
          />
        </div>
      </div>
    </div>
  );
}
