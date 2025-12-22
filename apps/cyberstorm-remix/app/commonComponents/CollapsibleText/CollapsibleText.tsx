import { type ReactElement, useState } from "react";

import { classnames } from "@thunderstore/cyberstorm";

import "./CollapsibleText.css";

export interface CollapsibleTextProps {
  text?: string;
  maxLength?: number;
  meta?: ReactElement[];
}

export function CollapsibleText(props: CollapsibleTextProps) {
  const { text = "", maxLength = 80 } = props;

  const textIsTooLong = text.length >= maxLength;
  const [opened, setOpened] = useState(!textIsTooLong);

  return (
    <div className="collapsible-text">
      <p
        className={classnames(
          "collapsible-text__text",
          opened ? "collapsible-text__text--opened" : null
        )}
      >
        {text}
      </p>
      {textIsTooLong ? (
        <button
          className="collapsible-text__show"
          onClick={() => setOpened(!opened)}
        >
          {opened ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

CollapsibleText.displayName = "CollapsibleText";
