"use client";
import styles from "./CollapsibleText.module.css";
import { ReactElement, useState } from "react";
import { Button } from "../Button/Button";

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
    return <p>{text}</p>;
  } else {
    return (
      <div className={`${styles.root} ${opened ? styles.opened : null}`}>
        {opened ? <p>{text}</p> : <p>{text.substring(0, maxLength) + "..."}</p>}
        <Button
          label={opened ? "Show less" : "Show more"}
          colorScheme="transparentDefault"
          size="tiny"
          onClick={() => setOpened(!opened)}
        />
      </div>
    );
  }
}

CollapsibleText.displayName = "CollapsibleText";
