"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/pro-light-svg-icons";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./CopyButton.module.css";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";

type CopyButtonProps = {
  text: string;
};
type CopyFn = (text: string) => Promise<void>;

function useCopyToClipboard(): CopyFn {
  const copy: CopyFn = async (text) => {
    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.warn("Copy failed", error);
    }
  };

  return copy;
}

export function CopyButton(props: CopyButtonProps) {
  const { text } = props;
  if (!navigator?.clipboard) {
    console.warn("Clipboard not supported");
    return null;
  }

  const copy = useCopyToClipboard();
  const [wasRecentlyCopied, setWasRecentlyCopied] = useState(false);
  useEffect(() => {
    setTimeout(() => setWasRecentlyCopied(false), 2000);
  }, [setWasRecentlyCopied]);

  const icon = wasRecentlyCopied ? (
    <FontAwesomeIcon fixedWidth icon={faCheck} className={styles.checkmark} />
  ) : (
    <FontAwesomeIcon fixedWidth icon={faClone} className={styles.copy} />
  );
  return (
    <Tooltip content="Copy">
      <Button
        size={"tiny"}
        colorScheme={"transparentDefault"}
        onClick={() => {
          copy(text);
          setWasRecentlyCopied(true);
        }}
        leftIcon={icon}
      />
    </Tooltip>
  );
}

CopyButton.displayName = "CopyButton";
