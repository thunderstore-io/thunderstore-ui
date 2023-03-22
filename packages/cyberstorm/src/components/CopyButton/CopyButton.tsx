import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import { useState } from "react";
import styles from "./CopyButton.module.css";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export const CopyButton = React.forwardRef<HTMLButtonElement>(() => {
  return (
    <button
      type="button"
      className={`${styles.root}`}
      onClick={useCopyToClipboard}
    >
      <FontAwesomeIcon fixedWidth icon={faClone} className={styles.home} />
    </button>
  );
});

CopyButton.displayName = "CopyButton";
