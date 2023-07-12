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
  const { text = "", maxLength = 35 } = props;

  const [opened, setOpened] = useState(false);

  if (text.length <= maxLength) {
    return <p className={styles.text}>{text}</p>;
  } else {
    return (
      <div className={`${styles.root} ${opened ? styles.opened : null}`}>
        {opened ? (
          <p className={styles.text}>{text}</p>
        ) : (
          <p className={styles.text}>{text.substring(0, maxLength) + "..."}</p>
        )}
        <button className={styles.show} onClick={() => setOpened(!opened)}>
          {opened ? "Show less" : "Show more"}
        </button>
      </div>
    );
  }
}

CollapsibleText.displayName = "CollapsibleText";
