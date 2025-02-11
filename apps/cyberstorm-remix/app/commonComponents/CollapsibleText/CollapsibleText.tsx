import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import "./CollapsibleText.css";
import { ReactElement, useState } from "react";

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
    <div className="nimbus-commonComponents-collapsibleText">
      <p
        className={classnames(
          "nimbus-commonComponents-collapsibleText__text",
          opened
            ? "nimbus-commonComponents-collapsibleText__text--opened"
            : null
        )}
      >
        {text}
      </p>
      {textIsTooLong ? (
        <button
          className="nimbus-commonComponents-collapsibleText__show"
          onClick={() => setOpened(!opened)}
        >
          {opened ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

CollapsibleText.displayName = "CollapsibleText";
