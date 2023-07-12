"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faCheck } from "@fortawesome/pro-regular-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./CopyButton.module.css";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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
  const {
    text,
    paddingSize = "none",
    colorScheme = "transparentDefault",
  } = props;
  if (!navigator?.clipboard) {
    console.warn("Clipboard not supported");
    return null;
  }

  const [wasRecentlyCopied, setWasRecentlyCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const icon = wasRecentlyCopied ? (
    <FontAwesomeIcon fixedWidth icon={faCheck} className={styles.checkmark} />
  ) : (
    <FontAwesomeIcon fixedWidth icon={faClone} className={styles.copy} />
  );

  const button = (
    <Button
      paddingSize={paddingSize}
      fontSize="small"
      colorScheme={colorScheme}
      onClick={() => {
        useCopyToClipboard(text, setWasRecentlyCopied);
      }}
      onMouseOver={() => {
        setTooltipOpen(true);
      }}
      onMouseOut={() => {
        setTooltipOpen(false);
      }}
      leftIcon={icon}
    />
  );

  return (
    <TooltipProvider>
      <Tooltip
        content={wasRecentlyCopied ? "Copied!" : "Copy"}
        open={tooltipOpen}
        side="bottom"
      >
        <div className={styles.root}>{button}</div>
      </Tooltip>
    </TooltipProvider>
  );
}

CopyButton.displayName = "CopyButton";
