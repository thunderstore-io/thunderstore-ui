import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode } from "react";

import { NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

import "./StalenessIndicator.css";

interface Props {
  children: ReactNode;
  rootClasses?: string;
  isStale: boolean;
}

export function StalenessIndicator(props: Props) {
  const { children, rootClasses, isStale = false } = props;
  return (
    <>
      <div
        className={classnames(
          isStale ? "staleness-indicator__wrapper" : null,
          rootClasses
        )}
      >
        {isStale ? (
          <NewIcon wrapperClasses="staleness-indicator">
            <FontAwesomeIcon icon={faSpinnerThird} />
          </NewIcon>
        ) : undefined}
        {children}
      </div>
    </>
  );
}

StalenessIndicator.displayName = "StalenessIndicator";
