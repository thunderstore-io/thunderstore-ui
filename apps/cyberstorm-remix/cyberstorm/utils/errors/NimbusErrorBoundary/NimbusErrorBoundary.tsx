import { Component, type ErrorInfo, type ReactNode, useCallback } from "react";
import { useAsyncError, useLocation, useRouteError } from "react-router";

import { NewButton } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm";

import {
  resolveRouteErrorPayload,
  safeResolveRouteErrorPayload,
} from "../resolveRouteErrorPayload";
import "./NimbusErrorBoundary.css";

interface NimbusErrorBoundaryState {
  error: Error | null;
}

export interface NimbusErrorRetryHandlerArgs {
  error: unknown;
  reset: () => void;
}

export interface NimbusErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
  retryLabel?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  fallback?: React.ComponentType<NimbusErrorBoundaryFallbackProps>;
  onRetry?: (args: NimbusErrorRetryHandlerArgs) => void;
  fallbackClassName?: string;
}

export interface NimbusErrorBoundaryFallbackProps {
  error: unknown;
  reset?: () => void;
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: (args: NimbusErrorRetryHandlerArgs) => void;
  className?: string;
}

export type NimbusAwaitErrorElementProps = Pick<
  NimbusErrorBoundaryFallbackProps,
  "title" | "description" | "retryLabel" | "className" | "onRetry"
>;

/**
 * NimbusErrorBoundary isolates rendering failures within a subtree and surfaces
 * a consistent recovery UI with an optional "Retry" affordance.
 */
export class NimbusErrorBoundary extends Component<
  NimbusErrorBoundaryProps,
  NimbusErrorBoundaryState
> {
  public state: NimbusErrorBoundaryState = {
    error: null,
  };

  public static getDerivedStateFromError(
    error: Error
  ): NimbusErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  private readonly resetBoundary = () => {
    this.setState({ error: null }, () => {
      this.props.onReset?.();
    });
  };

  public override render() {
    const { error } = this.state;

    if (error) {
      const FallbackComponent =
        this.props.fallback ?? NimbusErrorBoundaryFallback;

      return (
        <FallbackComponent
          error={error}
          reset={this.resetBoundary}
          title={this.props.title}
          description={this.props.description}
          retryLabel={this.props.retryLabel}
          className={this.props.fallbackClassName}
          onRetry={this.props.onRetry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default fallback surface displayed by {@link NimbusErrorBoundary}. It derives
 * user-facing messaging from the captured error when possible and offers a
 * retry button that either resets the boundary or runs a custom handler.
 */
export function NimbusErrorBoundaryFallback(
  props: NimbusErrorBoundaryFallbackProps
) {
  const { error, reset, onRetry, className } = props;
  const { pathname, search, hash } = useLocation();

  const payload = safeResolveRouteErrorPayload(error);
  const title = props.title ?? payload?.headline ?? "Something went wrong";
  const description =
    props.description ?? payload?.description ?? "Please try again.";
  const retryLabel = props.retryLabel ?? "Retry";
  const currentLocation = `${pathname}${search}${hash}`;
  const rootClassName = classnames(
    "container container--y container--full nimbus-error-boundary",
    className
  );

  const noopReset = useCallback(() => {}, []);
  const safeReset = reset ?? noopReset;

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry({ error, reset: safeReset });
      return;
    }

    window.location.assign(currentLocation);
  }, [currentLocation, error, onRetry, safeReset]);

  return (
    <div className={rootClassName}>
      <p>{title}</p>
      {description ? (
        <p className="nimbus-error-boundary__description">{description}</p>
      ) : null}
      <div className="nimbus-error-boundary__actions">
        <NewButton
          csVariant="accent"
          onClick={handleRetry}
          csSize="medium"
          rootClasses="nimbus-error-boundary__button"
        >
          {retryLabel}
        </NewButton>
      </div>
    </div>
  );
}

/**
 * Generic Await error element that mirrors {@link NimbusErrorBoundaryFallback}
 * behaviour by surfacing the async error alongside Nimbus styling.
 */
export function NimbusAwaitErrorElement(props: NimbusAwaitErrorElementProps) {
  const error = useAsyncError();

  return <NimbusErrorBoundaryFallback {...props} error={error} />;
}

export function NimbusDefaultRouteErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NimbusErrorBoundaryFallback
      error={error}
      title={payload.headline}
      description={payload.description}
    />
  );
}
