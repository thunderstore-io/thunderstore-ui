import "./ServiceAccounts.css";
import {
  NewAlert,
  NewButton,
  Modal,
  NewTable,
  NewIcon,
  NewTextInput,
  Heading,
  CodeBox,
  useToast,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  ApiError,
  type RequestConfig,
  teamAddServiceAccount,
  type TeamServiceAccountAddRequestData,
} from "@thunderstore/thunderstore-api";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { type OutletContextShape } from "../../../../../root";
import { useReducer, useState } from "react";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { ServiceAccountRemoveModal } from "./ServiceAccountRemoveModal";

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
          <AddServiceAccountForm
            teamName={teamName}
            config={outletContext.requestConfig}
            serviceAccountRevalidate={serviceAccountRevalidate}
          />
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
  serviceAccountRevalidate?: () => void;
}) {
  const [open, setOpen] = useState(false);
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
  }

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
    onSubmitSuccess: (result) => {
      onSuccess(result);
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

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setServiceAccountAdded(false);
      setAddedServiceAccountToken("");
      setAddedServiceAccountNickname("");
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
          <div>
            Enter the nickname of the service account you wish to add to the
            team <span>{props.teamName}</span>
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
        </Modal.Body>
      )}
      {serviceAccountAdded ? null : (
        <Modal.Footer>
          <NewButton onClick={strongForm.submit}>Add Service Account</NewButton>
        </Modal.Footer>
      )}
    </Modal>
  );
}
