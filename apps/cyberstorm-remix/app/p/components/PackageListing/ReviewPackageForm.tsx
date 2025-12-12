import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewTag,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  packageListingApprove,
  packageListingReject,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";

import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewPackageFormProps {
  communityId: string;
  namespaceId: string;
  packageId: string;
  packageListingStatus: PackageListingStatus;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

const reviewStatusColorMap = {
  approved: "green",
  rejected: "red",
  unreviewed: "orange",
} as const;

export function ReviewPackageForm({
  communityId,
  namespaceId,
  packageId,
  packageListingStatus,
  config,
  toast,
}: ReviewPackageFormProps) {
  const [rejectionReason, setRejectionReason] = useState(
    packageListingStatus?.rejection_reason ?? ""
  );

  const [internalNotes, setInternalNotes] = useState(
    packageListingStatus?.internal_notes ?? ""
  );

  const reviewStatus = packageListingStatus?.review_status ?? "unreviewed";
  const reviewStatusColor =
    reviewStatusColorMap[reviewStatus as keyof typeof reviewStatusColorMap] ??
    "orange";

  const { revalidate } = useRevalidator();

  useEffect(() => {
    setRejectionReason(packageListingStatus?.rejection_reason ?? "");
    setInternalNotes(packageListingStatus?.internal_notes ?? "");
  }, [packageListingStatus]);

  const rejectPackageAction = ApiAction({
    endpoint: packageListingReject,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Package rejected`,
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

  const approvePackageAction = ApiAction({
    endpoint: packageListingApprove,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Package approved`,
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
      csSize="small"
      trigger={
        <NewButton
          csSize="small"
          popoverTarget="reviewPackage"
          popoverTargetAction="show"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faScaleBalanced} />
          </NewIcon>
          Review Package
        </NewButton>
      }
      titleContent="Review Package"
    >
      <Modal.Body className="review-package__body">
        <NewAlert csVariant="info">
          Changes might take several minutes to show publicly! Info shown below
          is always up to date.
        </NewAlert>

        <div className="review-package__block">
          <p className="review-package__label">Review status</p>
          <NewTag csVariant={reviewStatusColor} csModifiers={["dark"]}>
            {reviewStatus}
          </NewTag>
        </div>

        <div className="review-package__block">
          <p className="review-package__label">
            Reject reason (saved on reject)
          </p>
          <NewTextInput
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Invalid submission"
            csSize="textarea"
            rootClasses="review-package__textarea"
          />
        </div>

        <div className="review-package__block">
          <p className="review-package__label">Internal notes</p>
          <NewTextInput
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder=".exe requires manual review"
            csSize="textarea"
            rootClasses="review-package__textarea"
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="modal-content__footer review-package__footer">
        <NewButton
          csVariant="danger"
          onClick={() =>
            rejectPackageAction({
              config,
              params: {
                community: communityId,
                namespace: namespaceId,
                package: packageId,
              },
              queryParams: {},
              data: {
                rejection_reason: rejectionReason,
                internal_notes: internalNotes ? internalNotes : null,
              },
            })
          }
        >
          Reject
        </NewButton>

        <NewButton
          csVariant="success"
          onClick={() =>
            approvePackageAction({
              config,
              params: {
                community: communityId,
                namespace: namespaceId,
                package: packageId,
              },
              queryParams: {},
              data: {
                internal_notes: internalNotes ? internalNotes : null,
              },
            })
          }
        >
          Approve
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}
