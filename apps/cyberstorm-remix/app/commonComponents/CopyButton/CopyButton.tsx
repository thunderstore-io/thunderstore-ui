import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./CopyButton.css";
import { NewIcon, Tooltip } from "@thunderstore/cyberstorm/src";
import React from "react";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (props: CopyButtonProps, forwardedRef) => {
    const { text, ...forwardedProps } = props;

    const [isSupported, setIsSupported] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [wasRecentlyCopied, setWasRecentlyCopied] = useState(false);

    useEffect(() => {
      setIsSupported(
        typeof window !== "undefined" &&
          typeof navigator?.clipboard !== "undefined"
      );
    }, [setIsSupported]);

    return isSupported ? (
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
          className="nimbus-commonComponents-copyButton"
          ref={forwardedRef}
          {...forwardedProps}
        >
          <NewIcon
            rootClasses={wasRecentlyCopied ? "__checkmark" : "__copy"}
            csMode="inline"
            noWrapper
          >
            <FontAwesomeIcon icon={wasRecentlyCopied ? faCheck : faClone} />
          </NewIcon>
        </button>
      </Tooltip>
    ) : null;
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
