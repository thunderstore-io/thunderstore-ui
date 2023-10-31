"use client";
import styles from "./CollapsibleText.module.css";
import { ReactElement, useState } from "react";

export interface CollapsibleTextProps {
  text?: string;
  maxLength?: number;
  meta?: ReactElement[];
}

/**
 * Cyberstorm CollapsibleText
 */
export function CollapsibleText(props: CollapsibleTextProps) {
  const { text = "", maxLength = 80 } = props;

  const textIsTooLong = text.length >= maxLength;
  const [opened, setOpened] = useState(!textIsTooLong);

  return (
    <div className={styles.root}>
      <p className={`${styles.text} ${opened ? styles.opened : null}`}>
        {text}
      </p>
      {textIsTooLong ? (
        <button className={styles.show} onClick={() => setOpened(!opened)}>
          {opened ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

CollapsibleText.displayName = "CollapsibleText";
