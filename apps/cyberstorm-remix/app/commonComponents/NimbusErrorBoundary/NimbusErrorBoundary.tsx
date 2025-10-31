import { Component, type ErrorInfo, type ReactNode } from "react";
import { useCallback } from "react";
import { NewButton } from "@thunderstore/cyberstorm";
import { useLocation } from "react-router";
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

export type NimbusErrorBoundaryFallbackConfig = Omit<
  NimbusErrorBoundaryFallbackProps,
  "error" | "reset"
>;

export interface NimbusErrorBoundaryProps {
  /** React subtree guarded by the error boundary. */
  children: ReactNode;
  /** Optional heading override for the fallback surface. */
  title?: string;
  /** Optional description override for the fallback surface. */
  description?: string;
  /**
   * Text for the retry button. Defaults to "Retry".
   */
  retryLabel?: string;
  /**
   * Called after the boundary captures an error. Can be used for reporting.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
  /**
   * Called after the boundary has been reset. Useful for clearing external
   * state (e.g. closing modals).
   */
  onReset?: () => void;
  /**
   * Custom fallback component. Receives the captured error along with reset
   * helpers. Defaults to {@link NimbusErrorBoundaryFallback}.
   */
  fallback?:
    | React.ComponentType<NimbusErrorBoundaryFallbackProps>
    | NimbusErrorBoundaryFallbackConfig;
  /**
   * Optional retry handler. When provided, the fallback's retry button will
   * invoke this instead of the default reset behaviour.
   */
  onRetry?: (args: NimbusErrorRetryHandlerArgs) => void;
}

export interface NimbusErrorBoundaryFallbackProps {
  /** The error that caused the boundary to render. */
  error: unknown;
  /** Clears the boundary's error state to allow a re-render. */
  reset?: () => void;
  /** Optional heading override passed from the boundary. */
  title?: string;
  /** Optional description override passed from the boundary. */
  description?: string;
  /** Retry button label. */
  retryLabel?: string;
  /** Optional retry handler. */
  onRetry?: (args: NimbusErrorRetryHandlerArgs) => void;
  /** Optional class name appended to the fallback container. */
  className?: string;
}

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
      const fallbackValue = this.props.fallback;
      let fallbackConfig: NimbusErrorBoundaryFallbackConfig | undefined;
      let FallbackComponent: React.ComponentType<NimbusErrorBoundaryFallbackProps> =
        NimbusErrorBoundaryFallback;

      if (fallbackValue) {
        if (typeof fallbackValue === "function") {
          FallbackComponent =
            fallbackValue as React.ComponentType<NimbusErrorBoundaryFallbackProps>;
        } else {
          fallbackConfig = fallbackValue;
        }
      }

      const fallbackTitle = this.props.title ?? fallbackConfig?.title;
      const fallbackDescription =
        this.props.description ?? fallbackConfig?.description;
      const fallbackRetryLabel =
        this.props.retryLabel ?? fallbackConfig?.retryLabel;
      const fallbackClassName = fallbackConfig?.className;
      const fallbackOnRetry = this.props.onRetry ?? fallbackConfig?.onRetry;

      return (
        <FallbackComponent
          error={error}
          reset={this.resetBoundary}
          title={fallbackTitle}
          description={fallbackDescription}
          retryLabel={fallbackRetryLabel}
          className={fallbackClassName}
          onRetry={fallbackOnRetry}
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

function safeResolveRouteErrorPayload(error: unknown) {
  try {
    return resolveRouteErrorPayload(error);
  } catch (resolutionError) {
    console.error("Failed to resolve route error payload", resolutionError);
    return null;
  }
}
