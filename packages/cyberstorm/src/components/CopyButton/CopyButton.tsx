"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./CopyButton.module.css";
import { Tooltip } from "../Tooltip/Tooltip";
import { NewIcon } from "../..";

type CopyButtonProps = {
  text: string;
  paddingSize?: "none" | "small" | "medium" | "mediumSquare" | "large" | "huge";
  colorScheme?:
    | "danger"
    | "default"
    | "primary"
    | "accent"
    | "tertiary"
    | "fancyAccent"
    | "success"
    | "warning"
    | "specialGreen"
    | "specialPurple"
    | "transparentDanger"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentAccent"
    | "transparentPrimary";
};

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

export function CopyButton(props: CopyButtonProps) {
  const { text } = props;

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
        className={styles.root}
      >
        <NewIcon
          rootClasses={wasRecentlyCopied ? styles.checkmark : styles.copy}
          csMode="inline"
          noWrapper
        >
          <FontAwesomeIcon icon={wasRecentlyCopied ? faCheck : faClone} />
        </NewIcon>
      </button>
    </Tooltip>
  ) : null;
}

CopyButton.displayName = "CopyButton";
