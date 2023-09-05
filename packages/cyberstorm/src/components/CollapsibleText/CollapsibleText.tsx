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
  const { text = "" } = props;

  const [opened, setOpened] = useState(false);

  return (
    <div className={styles.root}>
      <p className={`${styles.text} ${opened ? styles.opened : null}`}>
        {text}
      </p>
      <button className={styles.show} onClick={() => setOpened(!opened)}>
        {opened ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

CollapsibleText.displayName = "CollapsibleText";
