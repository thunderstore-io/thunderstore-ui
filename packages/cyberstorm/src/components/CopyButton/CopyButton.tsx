import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { PropsWithChildren, useEffect } from "react";
import { useState } from "react";
import styles from "./CopyButton.module.css";
import { Tooltip } from "../Tooltip/Tooltip";

type CopyButtonProps = {
  text: string;
};
type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<void>;

function useCopyToClipboard(): CopyFn {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const [stateValue, setState] = useState(false);
    useEffect(() => {
      setTimeout(() => setState(false), 2000);
    }, [stateValue]);
    return (
      <Tooltip content="Copy">
        <button
          type="button"
          onClick={() => {
            copy(props.text);
            setState(true);
          }}
        >
          {stateValue ? (
            <FontAwesomeIcon
              fixedWidth
              icon={faCheck}
              className={styles.checkmark}
            />
          ) : (
            <FontAwesomeIcon
              fixedWidth
              icon={faClone}
              className={styles.copy}
            />
          )}
        </button>
      </Tooltip>
    );
  }
);

CopyButton.displayName = "CopyButton";
