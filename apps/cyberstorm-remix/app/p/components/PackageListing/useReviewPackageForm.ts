import { type RefObject, useEffect, useMemo, useState } from "react";
import { useRevalidator } from "react-router";

import { type useToast } from "@thunderstore/cyberstorm";
import { type PackageListingStatus } from "@thunderstore/dapper/types";
import {
  type RequestConfig,
  extractApiErrorMessage,
  extractApiFieldErrorMessage,
  packageListingApprove,
  packageListingReject,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

const TOAST_SUCCESS_DURATION_MS = 4000;
const TOAST_ERROR_DURATION_MS = 8000;

const reviewStatusColorMap = {
  approved: "green",
  rejected: "red",
  unreviewed: "orange",
} as const;

export interface UseReviewPackageFormParams {
  communityId: string;
  namespaceId: string;
  packageId: string;
  packageListingStatus?: PackageListingStatus;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
  isActionInProgressRef: RefObject<boolean>;
  enabled: boolean;
}

export interface ReviewPackageFormBodyProps {
  reviewStatus: string;
  reviewStatusColor: (typeof reviewStatusColorMap)[keyof typeof reviewStatusColorMap];
  rejectionReason: string;
  internalNotes: string;
  fieldErrors: Record<string, string[]> | null;
  isActionInProgress: boolean;
  onRejectionReasonChange: (value: string) => void;
  onInternalNotesChange: (value: string) => void;
}

export interface ReviewPackageFormFooterProps {
  isRejecting: boolean;
  isApproving: boolean;
  isActionInProgress: boolean;
  onReject: () => void;
  onApprove: () => void;
}

export function useReviewPackageForm({
  communityId,
  namespaceId,
  packageId,
  packageListingStatus,
  config,
  toast,
  isActionInProgressRef,
  enabled,
}: UseReviewPackageFormParams) {
  const { revalidate } = useRevalidator();

  const packageParams = useMemo(
    () => ({
      community: communityId,
      namespace: namespaceId,
      package: packageId,
    }),
    [communityId, namespaceId, packageId]
  );

  const [rejectionReason, setRejectionReason] = useState(
    packageListingStatus?.rejection_reason ?? ""
  );
  const [internalNotes, setInternalNotes] = useState(
    packageListingStatus?.internal_notes ?? ""
  );
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const isActionInProgress = isRejecting || isApproving;

  const reviewStatus = packageListingStatus?.review_status ?? "unreviewed";
  const reviewStatusColor =
    reviewStatusColorMap[reviewStatus as keyof typeof reviewStatusColorMap] ??
    "orange";

  const beginReject = () => {
    isActionInProgressRef.current = true;
    setIsRejecting(true);
  };

  const endReject = () => {
    isActionInProgressRef.current = false;
    setIsRejecting(false);
  };

  const beginApprove = () => {
    isActionInProgressRef.current = true;
    setIsApproving(true);
  };

  const endApprove = () => {
    isActionInProgressRef.current = false;
    setIsApproving(false);
  };

  useEffect(() => {
    if (!enabled) return;
    setRejectionReason(packageListingStatus?.rejection_reason ?? "");
    setInternalNotes(packageListingStatus?.internal_notes ?? "");
    setFieldErrors(null);
  }, [enabled, packageListingStatus]);

  const rejectPackageAction = ApiAction({
    endpoint: packageListingReject,
    onSubmitSuccess: () => {
      setFieldErrors(null);
      toast.addToast({
        csVariant: "success",
        children: "Package rejected",
        duration: TOAST_SUCCESS_DURATION_MS,
      });
      revalidate();
    },
    onSubmitError: (error) => {
      const fieldError = extractApiFieldErrorMessage(error, "rejection_reason");
      if (fieldError) {
        setFieldErrors({ rejection_reason: [fieldError] });
        return;
      }

      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: TOAST_ERROR_DURATION_MS,
      });
    },
  });

  const approvePackageAction = ApiAction({
    endpoint: packageListingApprove,
    onSubmitSuccess: () => {
      setFieldErrors(null);
      toast.addToast({
        csVariant: "success",
        children: "Package approved",
        duration: TOAST_SUCCESS_DURATION_MS,
      });
      revalidate();
    },
    onSubmitError: (error) => {
      const fieldError = extractApiFieldErrorMessage(error, "internal_notes");
      if (fieldError) {
        setFieldErrors({ internal_notes: [fieldError] });
        return;
      }

      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: TOAST_ERROR_DURATION_MS,
      });
    },
  });

  const handleReject = async () => {
    if (isActionInProgressRef.current) return;

    beginReject();
    try {
      await rejectPackageAction({
        config,
        params: packageParams,
        queryParams: {},
        data: {
          rejection_reason: rejectionReason,
          internal_notes: internalNotes || null,
        },
      });
    } finally {
      endReject();
    }
  };

  const handleApprove = async () => {
    if (isActionInProgressRef.current) return;

    beginApprove();
    try {
      await approvePackageAction({
        config,
        params: packageParams,
        queryParams: {},
        data: {
          internal_notes: internalNotes || null,
        },
      });
    } finally {
      endApprove();
    }
  };

  const bodyProps: ReviewPackageFormBodyProps = {
    reviewStatus,
    reviewStatusColor,
    rejectionReason,
    internalNotes,
    fieldErrors,
    isActionInProgress,
    onRejectionReasonChange: (value) => {
      setRejectionReason(value);
      setFieldErrors(null);
    },
    onInternalNotesChange: (value) => {
      setInternalNotes(value);
      setFieldErrors(null);
    },
  };

  const footerProps: ReviewPackageFormFooterProps = {
    isRejecting,
    isApproving,
    isActionInProgress,
    onReject: handleReject,
    onApprove: handleApprove,
  };

  return { bodyProps, footerProps };
}
