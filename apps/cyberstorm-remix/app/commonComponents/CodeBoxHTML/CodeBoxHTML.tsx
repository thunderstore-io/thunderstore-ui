import {
  faCheck,
  faClone,
  faCompress,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { stripHtmlTags } from "cyberstorm/utils/HTMLParsing";
import { memo, useMemo, useState } from "react";

import {
  CodeBox,
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
} from "@thunderstore/cyberstorm";

import "./CodeBoxHTML.css";

export interface CodeBoxHTMLProps {
  value?: string;
  maxHeight?: number;
  language?: string;
}

/** Copy-to-clipboard button styled to match the other toolbar icon buttons. */
function ToolbarCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    // Guard the API: navigator.clipboard is undefined in non-secure contexts and
    // some browsers, where the optional chain would yield undefined and `.then`
    // would throw. Catch write failures (e.g. denied permissions) so the
    // rejection doesn't go unhandled.
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard write failed; leave the button in its default state.
      });
  };

  return (
    <NewButton
      csVariant="secondary"
      csSize="small"
      csModifiers={["only-icon"]}
      tooltipText={copied ? "Copied!" : "Copy"}
      aria-label="Copy code"
      onClick={onCopy}
    >
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={copied ? faCheck : faClone} />
      </NewIcon>
    </NewButton>
  );
}

/**
 * CodeBox component which renders HTML content by stripping HTML tags
 * and passing the plain text to the CodeBox component for syntax highlighting.
 *
 * Renders a non-ghost toolbar overlaid on the code box's top-right corner: copy,
 * then a control that toggles fullscreen — Expand in the normal view, Minimize
 * in the fullscreen modal (which slides up from the bottom of the viewport,
 * inset from the top/bottom edges on non-mobile widths).
 */
export const CodeBoxHTML = memo(function CodeBoxHTML({
  value = "",
  maxHeight = 600,
  language = "text",
}: CodeBoxHTMLProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const result = useMemo(() => {
    try {
      const text = stripHtmlTags(value);
      return { text, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process HTML content";
      return { text: "", error: errorMessage };
    }
  }, [value]);

  if (result.error) {
    return <NewAlert csVariant="danger">{result.error}</NewAlert>;
  }

  // Toolbar overlays the code box's top-right corner in both views. Normal view
  // shows Expand (enter fullscreen); the fullscreen modal shows Minimize (exit).
  const renderToolbar = (mode: "normal" | "fullscreen") => (
    <div className="code-box-html__toolbar">
      <ToolbarCopyButton text={result.text} />
      <NewButton
        csVariant="secondary"
        csSize="small"
        csModifiers={["only-icon"]}
        tooltipText={mode === "normal" ? "Expand" : "Minimize"}
        aria-label={
          mode === "normal"
            ? "Expand code to fullscreen"
            : "Minimize code from fullscreen"
        }
        onClick={() => setIsFullscreen(mode === "normal")}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={mode === "normal" ? faExpand : faCompress} />
        </NewIcon>
      </NewButton>
    </div>
  );

  return (
    <div className="code-box-html__container">
      {renderToolbar("normal")}

      <div
        className="code-box-html"
        style={{
          maxHeight,
          width: "100%",
          overflow: "auto",
        }}
      >
        <CodeBox
          value={result.text}
          language={language}
          showLineNumbers
          allowCopy={false}
        />
      </div>

      <Modal
        open={isFullscreen}
        onOpenChange={setIsFullscreen}
        disableDefaultSubComponents
        contentClasses="code-box-html__fullscreen"
      >
        <Modal.Title className="code-box-html__sr-only">
          Code viewer
        </Modal.Title>
        <div className="code-box-html__container code-box-html__container--fullscreen">
          {renderToolbar("fullscreen")}
          <div className="code-box-html__fullscreen-inner">
            <CodeBox
              value={result.text}
              language={language}
              showLineNumbers
              allowCopy={false}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
});

CodeBoxHTML.displayName = "CodeBoxHTML";
