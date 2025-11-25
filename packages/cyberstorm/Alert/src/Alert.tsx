import "./Alert.css";
import React from "react";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";
import {
  type AlertSizes,
  type AlertVariants,
} from "@thunderstore/cyberstorm-theme/src/components";
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faOctagonExclamation } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { type PrimitiveComponentDefaultProps } from "@thunderstore/cyberstorm-primitive-utils";

export interface AlertProps extends PrimitiveComponentDefaultProps {
  csVariant?: AlertVariants;
  csSize?: AlertSizes;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props: AlertProps, forwardedRef) => {
    const {
      children,
      rootClasses,
      csVariant = "info",
      csSize = "small",
      ...forwardedProps
    } = props;

    const icon = getIcon(csVariant);

    return (
      <div
        {...forwardedProps}
        className={classnames(
          "alert",
          ...componentClasses("alert", csVariant, csSize, undefined),
          rootClasses
        )}
        ref={forwardedRef}
      >
        <NewIcon noWrapper csMode="inline" rootClasses="alert__icon">
          <FontAwesomeIcon icon={icon} />
        </NewIcon>
        <span className="alert__content">{children}</span>
      </div>
    );
  }
);

Alert.displayName = "Alert";

const getIcon = (scheme: AlertProps["csVariant"] = "info") => {
  return {
    info: faExclamationCircle,
    success: faCheckCircle,
    warning: faExclamationTriangle,
    danger: faOctagonExclamation,
  }[scheme];
};
