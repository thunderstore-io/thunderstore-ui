import { PropsWithChildren } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Collapsible.css";
import { NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

interface Props extends PropsWithChildren {
  headerTitle: string;
  defaultOpen?: boolean;
}

/**
 * Wrapper for making a menu collapsible
 */
export const CollapsibleMenu = (props: Props) => {
  const { headerTitle, defaultOpen, children } = props;

  return (
    <details className="nimbus-commonComponents-collapsible" open={defaultOpen}>
      <summary
        className={classnames(
          "ts-button ts-variant--secondary ts-size--big ts-modifier--ghost",
          "__header"
        )}
      >
        {headerTitle}
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCaretDown} />
        </NewIcon>
      </summary>
      <div className="__content">{children}</div>
    </details>
  );
};

CollapsibleMenu.displayName = "CollapsibleMenu";
