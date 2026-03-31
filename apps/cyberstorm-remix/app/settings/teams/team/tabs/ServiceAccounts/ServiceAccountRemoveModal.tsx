import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type OutletContextShape } from "app/root";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { useState } from "react";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type TeamServiceAccount,
  teamServiceAccountRemove,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import "./ServiceAccounts.css";

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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isNameMatch = inputValue.trim() === serviceAccount.name;

  const removeServiceAccountAction = ApiAction({
    endpoint: teamServiceAccountRemove,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: "Service account removed",
        duration: 4000,
      });
      revalidate();
      setOpen(false);
      setInputValue("");
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
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setInputValue("");
        }
      }}
      titleContent="Confirm service account removal"
      trigger={
        isTeamOwner(teamName, outletContext.currentUser) && ( // Only show trigger if user can delete
          <NewButton csVariant="danger" csSize="small">
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
        <div>
          As a precaution, to remove the service account, please input{" "}
          <span className="team-service-accounts__highlight">
            {serviceAccount.name}
          </span>{" "}
          into the field below.
        </div>
        <NewTextInput
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          id={`serviceAccountNameInput-${serviceAccount.identifier}`}
          aria-label="Confirm service account name"
        />
      </Modal.Body>
      <Modal.Footer>
        <NewButton
          disabled={!isNameMatch}
          onClick={() => {
            if (!isNameMatch) return;
            removeServiceAccountAction({
              config: outletContext.requestConfig,
              params: {
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
