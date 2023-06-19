"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faCheck } from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";
import styles from "./CopyButton.module.css";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type CopyButtonProps = {
  text: string;
};

function useCopyToClipboard(text: string, recentlyCopiedMethod: Function) {
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
  if (!navigator?.clipboard) {
    console.warn("Clipboard not supported");
    return null;
  }

  const [wasRecentlyCopied, setWasRecentlyCopied] = useState(false);

  const icon = wasRecentlyCopied ? (
    <FontAwesomeIcon fixedWidth icon={faCheck} className={styles.checkmark} />
  ) : (
    <FontAwesomeIcon fixedWidth icon={faClone} className={styles.copy} />
  );
  return (
    <TooltipProvider>
      <Tooltip content="Copy">
        <Button
          size={"tiny"}
          colorScheme={"transparentDefault"}
          onClick={() => {
            useCopyToClipboard(text, setWasRecentlyCopied);
          }}
          leftIcon={icon}
        />
      </Tooltip>
    </TooltipProvider>
  );
}

CopyButton.displayName = "CopyButton";
