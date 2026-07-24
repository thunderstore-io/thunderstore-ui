import * as Sentry from "@sentry/react-router";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface MarkdownErrorBoundaryProps {
  /**
   * The source being rendered. Doubles as the reset key: a new document must
   * get a fresh attempt, or one bad wiki page would leave every page visited
   * afterwards showing the fallback for the rest of the session.
   */
  input: string;
  children: ReactNode;
}

interface MarkdownErrorBoundaryState {
  hasError: boolean;
  seenInput: string;
}

/**
 * Renders markdown that fails to convert as plain text instead of taking the
 * page down with it.
 *
 * Markdown here is author-controlled, and the conversion walks the document
 * recursively, so an unusually structured one can exhaust the call stack partway
 * through. Catching the failure is more robust than enumerating the shapes that
 * cause it — what matters is that a document which cannot be converted costs its
 * own formatting rather than the reader's page. The text is still shown, because
 * a page that renders as plain text is far more useful than an error.
 *
 * Scope: React render errors, which is where the conversion runs (MarkdownHooks
 * processes in an effect and rethrows on the following render).
 */
export class MarkdownErrorBoundary extends Component<
  MarkdownErrorBoundaryProps,
  MarkdownErrorBoundaryState
> {
  static displayName = "MarkdownErrorBoundary";

  state: MarkdownErrorBoundaryState = {
    hasError: false,
    seenInput: this.props.input,
  };

  static getDerivedStateFromError(): Partial<MarkdownErrorBoundaryState> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: MarkdownErrorBoundaryProps,
    state: MarkdownErrorBoundaryState
  ): Partial<MarkdownErrorBoundaryState> | null {
    if (props.input === state.seenInput) return null;
    // New document: clear the latch so it gets its own attempt.
    return { hasError: false, seenInput: props.input };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Match the other boundaries: log in dev, report in prod.
    if (!import.meta.env.PROD) {
      console.error("Markdown render error", error);
      return;
    }

    Sentry.captureException(error, {
      // One issue for all of these rather than one per document, so a single
      // crafted page can't flood the project.
      fingerprint: ["markdown-render"],
      contexts: {
        markdownErrorBoundary: {
          inputLength: this.props.input.length,
          componentStack: info.componentStack,
        },
      },
    });
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <pre className="markdown__fallback">{this.props.input}</pre>;
  }
}
