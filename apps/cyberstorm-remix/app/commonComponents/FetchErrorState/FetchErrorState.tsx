import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { useRevalidator } from "react-router";

import {
  NewAlert,
  type NewAlertProps,
  NewButton,
  NewIcon,
} from "@thunderstore/cyberstorm";
import { faRotateRight } from "@thunderstore/icons";

import "./FetchErrorState.css";

interface Props {
  /** Message describing what failed to load. */
  message?: ReactNode;
  variant?: NewAlertProps["csVariant"];
  /** Retry handler. Defaults to revalidating the route's loaders. */
  onRetry?: () => void;
}

/**
 * Inline error element with a retry button for a single failed fetch, so one
 * broken region doesn't deadlock the whole page (TS-3397). Use as an
 * `<Await errorElement>` or in place of a region whose data failed to load.
 */
export function FetchErrorState({
  message = "Something went wrong while loading this section.",
  variant = "danger",
  onRetry,
}: Props) {
  const revalidator = useRevalidator();
  const handleRetry = onRetry ?? (() => revalidator.revalidate());
  // Reflect the revalidator's busy state only on the default (revalidate) path.
  const isRetrying = !onRetry && revalidator.state !== "idle";

  return (
    <div className="fetch-error-state">
      <NewAlert csVariant={variant}>
        <div className="fetch-error-state__content">
          <span className="fetch-error-state__message">{message}</span>
          <NewButton
            csVariant="secondary"
            csSize="small"
            onClick={handleRetry}
            disabled={isRetrying}
            rootClasses="fetch-error-state__retry"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faRotateRight} />
            </NewIcon>
            {isRetrying ? "Retrying…" : "Retry"}
          </NewButton>
        </div>
      </NewAlert>
    </div>
  );
}

FetchErrorState.displayName = "FetchErrorState";
