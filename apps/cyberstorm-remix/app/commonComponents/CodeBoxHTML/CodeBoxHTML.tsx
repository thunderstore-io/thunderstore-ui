import { faExpand } from "@fortawesome/free-solid-svg-icons";
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

/**
 * CodeBox component which renders HTML content by stripping HTML tags
 * and passing the plain text to the CodeBox component for syntax highlighting.
 *
 * Provides an Expand control that opens the code in a fullscreen modal (inset
 * from the window edges by a uniform margin) for reading large decompilations.
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

  return (
    <div className="code-box-html__container">
      <NewButton
        csVariant="secondary"
        csSize="small"
        csModifiers={["ghost", "only-icon"]}
        tooltipText="Expand"
        aria-label="Expand code to fullscreen"
        rootClasses="code-box-html__expand"
        onClick={() => setIsFullscreen(true)}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faExpand} />
        </NewIcon>
      </NewButton>

      <div
        className="code-box-html"
        style={{
          maxHeight,
          width: "100%",
          overflow: "auto",
        }}
      >
        <CodeBox value={result.text} language={language} />
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
        <Modal.Exit />
        <div className="code-box-html__fullscreen-inner">
          <CodeBox value={result.text} language={language} />
        </div>
      </Modal>
    </div>
  );
});

CodeBoxHTML.displayName = "CodeBoxHTML";
