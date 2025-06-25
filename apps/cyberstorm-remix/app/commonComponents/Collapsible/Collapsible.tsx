import { memo, PropsWithChildren } from "react";
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
export const CollapsibleMenu = memo(function CollapsibleMenu(props: Props) {
  const { headerTitle, defaultOpen, children } = props;

  return (
    <details className="collapsible" open={defaultOpen}>
      <summary
        className={classnames(
          "button button--variant--secondary button--size--big button--ghost",
          "collapsible__header"
        )}
      >
        {headerTitle}
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCaretDown} />
        </NewIcon>
      </summary>
      <div className="collapsible__content">{children}</div>
    </details>
  );
});

CollapsibleMenu.displayName = "CollapsibleMenu";
