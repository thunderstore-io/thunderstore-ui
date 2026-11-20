import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useRevalidator } from "react-router";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewTag,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  extractApiErrorMessage,
  packageVersionApprove,
  packageVersionReject,
} from "@thunderstore/thunderstore-api";

export interface ReviewVersionFormProps {
  communityId: string;
  namespaceId: string;
  packageId: string;
  versionNumber: string;
  isRejected: boolean;
  config: () => RequestConfig;
}

export function ReviewVersionForm({
  communityId,
  namespaceId,
  packageId,
  versionNumber,
  isRejected,
  config,
}: ReviewVersionFormProps) {
  const toast = useToast();
  const { revalidate } = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const isActionInProgressRef = useRef(false);
  const isActionInProgress = isRejecting || isApproving;

  const handleOpenChange = (open: boolean) => {
    if (!open && isActionInProgressRef.current) return;
    setIsOpen(open);
  };

  const review = async (action: "reject" | "approve") => {
    if (isActionInProgressRef.current) return;

    isActionInProgressRef.current = true;
    const setInProgress = action === "reject" ? setIsRejecting : setIsApproving;
    setInProgress(true);
    try {
      await (action === "reject"
        ? packageVersionReject
        : packageVersionApprove)({
        config,
        params: {
          community: communityId,
          namespace: namespaceId,
          package: packageId,
          version: versionNumber,
        },
        queryParams: {},
        data: {},
      });
      toast.addToast({
        csVariant: "success",
        children: action === "reject" ? "Version rejected" : "Version approved",
        duration: 4000,
      });
      revalidate();
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(
          error instanceof Error ? error : new Error(String(error))
        ),
        duration: 8000,
      });
    } finally {
      isActionInProgressRef.current = false;
      setInProgress(false);
    }
  };

  return (
    <Modal
      csSize="small"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton csSize="small">
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faScaleBalanced} />
          </NewIcon>
          Review
        </NewButton>
      }
      titleContent={`Review Version ${versionNumber}`}
      disableBody
    >
      {isOpen ? (
        <>
          <Modal.Body className="review-package__body">
            <NewAlert csVariant="info">
              Changes might take several minutes to show publicly! Rejected
              versions are hidden in every community the package is listed in.
            </NewAlert>

            <div className="review-package__block">
              <p className="review-package__label">Review status</p>
              <NewTag
                csVariant={isRejected ? "red" : "green"}
                csModifiers={["dark"]}
              >
                {isRejected ? "rejected" : "not rejected"}
              </NewTag>
            </div>
          </Modal.Body>

          <Modal.Footer className="review-package__footer">
            <NewButton
              csVariant="danger"
              disabled={isActionInProgress}
              onClick={() => review("reject")}
            >
              {isRejecting ? "Rejecting…" : "Reject"}
            </NewButton>

            <NewButton
              csVariant="success"
              disabled={isActionInProgress}
              onClick={() => review("approve")}
            >
              {isApproving ? "Approving…" : "Approve"}
            </NewButton>
          </Modal.Footer>
        </>
      ) : null}
    </Modal>
  );
}
