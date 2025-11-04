import "./ServiceAccounts.css";
import { NewAlert, NewButton, Modal, NewIcon } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@thunderstore/cyberstorm";
import { teamServiceAccountRemove } from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { type OutletContextShape } from "~/root";
import { type TeamServiceAccount } from "@thunderstore/thunderstore-api";

interface ServiceAccountRemoveModalProps {
  serviceAccount: TeamServiceAccount;
  teamName: string;
  outletContext: OutletContextShape;
  revalidate: () => void;
}

export function ServiceAccountRemoveModal({
  serviceAccount,
  teamName,
  outletContext,
  revalidate,
}: ServiceAccountRemoveModalProps) {
  const toast = useToast();

  const canDelete = () => {
    const teams = outletContext.currentUser?.teams_full || [];
    const belongingTeam = teams.find((team) => team.name === teamName);
    if (!belongingTeam) {
      return false;
    }
    return belongingTeam.role === "owner";
  };

  const removeServiceAccountAction = ApiAction({
    endpoint: teamServiceAccountRemove,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: "Service account removed",
        duration: 4000,
      });
      revalidate();
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
    <Modal
      titleContent="Confirm service account removal"
      trigger={
        canDelete() && ( // Only show trigger if user can delete
          <NewButton csVariant="danger" csSize="xsmall">
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faTrash} />
            </NewIcon>
            Remove
          </NewButton>
        )
      }
      csSize="small"
    >
      <Modal.Body>
        <NewAlert csVariant="warning">
          This cannot be undone! Related API token will stop working immediately
          if the service account is removed.
        </NewAlert>
        <div>
          You are about to remove service account{" "}
          <span className="team-service-accounts__highlight">
            {serviceAccount.name}
          </span>
          .
        </div>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}
