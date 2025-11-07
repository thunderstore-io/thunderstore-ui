import { Component, useCallback, type ErrorInfo, type ReactNode } from "react";
import { NewButton } from "@thunderstore/cyberstorm";
import { useAsyncError, useLocation, useRouteError } from "react-router";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import "./NimbusErrorBoundary.css";

interface NimbusErrorBoundaryState {
  error: Error | null;
}

export interface NimbusErrorRetryHandlerArgs {
  /** The error instance that triggered the boundary. */
  error: unknown;
  /**
   * Clears the captured error and re-renders the child tree. Consumers should
   * call this when attempting to recover without a full reload.
   */
  reset: () => void;
}

/**
 * Props accepted by {@link NimbusErrorBoundary}.
 *
 * @property {ReactNode} children React subtree guarded by the boundary.
 * @property {string} [title] Heading override forwarded to the fallback UI.
 * @property {string} [description] Description override forwarded to the fallback UI.
 * @property {string} [retryLabel] Custom text for the retry button; defaults to "Retry".
 * @property {(error: Error, info: ErrorInfo) => void} [onError] Invoked after an error is captured for telemetry.
 * @property {() => void} [onReset] Runs once the boundary resets so callers can clear side effects.
 * @property {React.ComponentType<NimbusErrorBoundaryFallbackProps>} [fallback] Custom fallback renderer; receives the captured error and reset helpers.
 * @property {(args: NimbusErrorRetryHandlerArgs) => void} [onRetry] Optional retry handler that replaces the default reset behaviour.
 * @property {string} [fallbackClassName] Additional class name applied to the fallback container.
 */
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

/**
 * Props consumed by {@link NimbusErrorBoundaryFallback} and compatible fallbacks.
 *
 * @property {unknown} error Error instance captured by the boundary.
 * @property {() => void} [reset] Clears the boundary's error state when invoked.
 * @property {string} [title] Heading override for the rendered fallback surface.
 * @property {string} [description] Supplementary description shown beneath the title.
 * @property {string} [retryLabel] Text used for the retry button; defaults to "Retry" when omitted.
 * @property {(args: NimbusErrorRetryHandlerArgs) => void} [onRetry] Optional handler executed when retrying instead of the default behaviour.
 * @property {string} [className] Additional CSS class names appended to the fallback container.
 */
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
  const baseClassName =
    "container container--y container--full nimbus-error-boundary";
  const rootClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

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
 * Attempts to derive a user-facing payload from the thrown error without letting
 * mapper issues break the fallback UI.
 */
function safeResolveRouteErrorPayload(error: unknown) {
  try {
    return resolveRouteErrorPayload(error);
  } catch (resolutionError) {
    console.error("Failed to resolve route error payload", resolutionError);
    return null;
  }
}

/**
 * Generic Await error element that mirrors {@link NimbusErrorBoundaryFallback}
 * behaviour by surfacing the async error alongside Nimbus styling.
 */
export function NimbusAwaitErrorElement(props: NimbusAwaitErrorElementProps) {
  const error = useAsyncError();

  return <NimbusErrorBoundaryFallback {...props} error={error} />;
}

/**
 * Maps loader errors to user-facing alerts for the wiki page route.
 */
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
