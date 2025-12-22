import { faCheck, faClone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction, useState } from "react";
import React from "react";

import { NewIcon, Tooltip } from "@thunderstore/cyberstorm/src";

import "./CopyButton.css";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (props: CopyButtonProps, forwardedRef) => {
    const { text, ...forwardedProps } = props;

    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [wasRecentlyCopied, setWasRecentlyCopied] = useState(false);

    return (
      <Tooltip
        content={wasRecentlyCopied ? "Copied!" : "Copy"}
        open={isTooltipOpen}
        side="bottom"
      >
        <button
          onClick={() => useCopyToClipboard(text, setWasRecentlyCopied)}
          onMouseOver={() => setIsTooltipOpen(true)}
          onMouseOut={() => setIsTooltipOpen(false)}
          onBlur={() => {}}
          onFocus={() => {}}
          className="copy-button"
          ref={forwardedRef}
          {...forwardedProps}
        >
          <NewIcon
            rootClasses={
              wasRecentlyCopied ? "copy-button__checkmark" : "copy-button__copy"
            }
            csMode="inline"
            noWrapper
          >
            <FontAwesomeIcon icon={wasRecentlyCopied ? faCheck : faClone} />
          </NewIcon>
        </button>
      </Tooltip>
    );
  }
);

CopyButton.displayName = "CopyButton";

function useCopyToClipboard(
  text: string,
  recentlyCopiedMethod: Dispatch<SetStateAction<boolean>>
) {
  // Try to save to clipboard then save it in the state if worked
  try {
    navigator?.clipboard.writeText(text);
    recentlyCopiedMethod(true);
    setTimeout(() => {
      recentlyCopiedMethod(false);
    }, 2000);
  } catch (error) {
    console.warn("Copy failed", error);
  }
}
