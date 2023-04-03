import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import React, { PropsWithChildren } from "react";
import { useState } from "react";
import styles from "./CopyButton.module.css";

type CopyButtonProps = {
  text: string;
};
type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<void>;

function useCopyToClipboard(): CopyFn {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
    }
  };

  return copy;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (props: PropsWithChildren<CopyButtonProps>) => {
    const copy = useCopyToClipboard();
    return (
      <button
        type="button"
        className={`${styles.root}`}
        onClick={() => copy(props.text)}
      >
        <FontAwesomeIcon fixedWidth icon={faClone} className={styles.home} />
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";
