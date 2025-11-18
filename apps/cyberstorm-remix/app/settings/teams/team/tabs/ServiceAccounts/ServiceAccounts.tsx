import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, useReducer, useState } from "react";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";

import {
  NewAlert,
  NewButton,
  Modal,
  NewTable,
  NewIcon,
  NewTextInput,
  Heading,
  CodeBox,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { Await } from "react-router";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import {
  type RequestConfig,
  teamAddServiceAccount,
  type TeamServiceAccountAddRequestData,
  UserFacingError,
} from "@thunderstore/thunderstore-api";

import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/getLoaderTools";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { ServiceAccountRemoveModal } from "./ServiceAccountRemoveModal";
import "./ServiceAccounts.css";
import type { DapperTs } from "@thunderstore/dapper-ts";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    serviceAccounts: await dapper.getTeamServiceAccounts(teamName),
  })
);

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];

export default function ServiceAccounts() {
  const { teamName, serviceAccounts } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <Suspense fallback={<ServiceAccountsSkeleton />}>
      <Await
        resolve={serviceAccounts}
        errorElement={<NimbusAwaitErrorElement />}
      >
        {(result) => (
          <ServiceAccountsContent
            teamName={teamName}
            serviceAccounts={result}
            outletContext={outletContext}
          />
        )}
      </Await>
    </Suspense>
  );
}

interface ServiceAccountsContentProps {
  teamName: string;
  serviceAccounts: Awaited<ReturnType<DapperTs["getTeamServiceAccounts"]>>;
  outletContext: OutletContextShape;
}

/**
 * Renders the service accounts table after Suspense resolves the data.
 */
function ServiceAccountsContent({
  teamName,
  serviceAccounts,
  outletContext,
}: ServiceAccountsContentProps) {
  const revalidator = useRevalidator();

  const currentUserTeam = outletContext.currentUser?.teams_full?.find(
    (team) => team.name === teamName
  );
  const isOwner = currentUserTeam?.role === "owner";

  async function serviceAccountRevalidate() {
    revalidator.revalidate();
  }

  const tableData = serviceAccounts.map((serviceAccount) => {
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
          <ServiceAccountRemoveModal
            key={serviceAccount.identifier}
            serviceAccount={serviceAccount}
            teamName={teamName}
            outletContext={outletContext}
            revalidate={serviceAccountRevalidate}
          />
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
          {isOwner && (
            <AddServiceAccountForm
              teamName={teamName}
              config={outletContext.requestConfig}
              serviceAccountRevalidate={serviceAccountRevalidate}
            />
          )}
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

/**
 * Displays a placeholder skeleton while service accounts load.
 */
function ServiceAccountsSkeleton() {
  return (
    <div className="settings-items">
      <SkeletonBox className="settings-items__skeleton" />
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}

function AddServiceAccountForm(props: {
  teamName: string;
  config: () => RequestConfig;
  serviceAccountRevalidate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountToken, setAddedServiceAccountToken] = useState("");
  const [addedServiceAccountNickname, setAddedServiceAccountNickname] =
    useState("");
  const [error, setError] = useState<string | null>(null);

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

  const isValid = formInputs.nickname.trim().length > 0;

  type SubmitorOutput = Awaited<ReturnType<typeof teamAddServiceAccount>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamAddServiceAccount({
      config: props.config,
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
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: (result: SubmitorOutput) => {
      onSuccess(result);
      setError(null);
      // Refresh the service accounts list to show the newly created account
      // TODO: When API returns identifier in response, we can append the new
      // service account to the list instead of refreshing from backend
      props.serviceAccountRevalidate?.();
    },
    onSubmitError: (error) => {
      const message = `Error occurred: ${error.message || "Unknown error"}`;
      setError(message);
    },
  });

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
      titleContent="Add service account"
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
        <Modal.Body>
          <form
            className="service-accounts__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValid) {
                strongForm.submit();
              }
            }}
          >
            <div>
              Enter the nickname of the service account you wish to add to the
              team <span>{props.teamName}</span>
            </div>
            <div className="service-accounts__nickname-input">
              <NewTextInput
                value={formInputs.nickname}
                onChange={(e) => {
                  updateFormFieldState({
                    field: "nickname",
                    value: e.target.value,
                  });
                }}
                placeholder={"ExampleName"}
                maxLength={32}
              />
              <div className="service-accounts__nickname-input-max-length">
                Max. 32 characters
              </div>
            </div>
            {error && <NewAlert csVariant="danger">{error}</NewAlert>}
          </form>
        </Modal.Body>
      )}
      {serviceAccountAdded ? null : (
        <Modal.Footer>
          <NewButton onClick={strongForm.submit} disabled={!isValid}>
            Add Service Account
          </NewButton>
        </Modal.Footer>
      )}
    </Modal>
  );
}
