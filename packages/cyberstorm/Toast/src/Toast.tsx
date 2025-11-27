import React from "react";
import "./Toast.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixToast from "@radix-ui/react-toast";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { type PrimitiveComponentDefaultProps } from "@thunderstore/cyberstorm-primitive-utils";
import {
  type ToastVariants,
  type ToastSizes,
} from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";

import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faOctagonExclamation,
  faXmarkLarge,
} from "@fortawesome/pro-solid-svg-icons";

// export type ToastProps = {
//   variant?: "info" | "danger" | "warning" | "success";
// };

export interface ToastProps extends PrimitiveComponentDefaultProps {
  csVariant?: ToastVariants;
  csSize?: ToastSizes;
  id: string;
  duration?: number;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (props: ToastProps, forwardedRef) => {
    const {
      duration = 10000,
      children,
      rootClasses,
      csVariant = "info",
      csSize = "medium",
      ...forwardedProps
    } = props;
    // const durationCSS = {
    //   "--bar-duration": `${duration / 1000}s`,
    // } as CSSProperties;

    const icon = getIcon(csVariant);

    return (
      <RadixToast.Root asChild duration={duration}>
        <div
          {...forwardedProps}
          className={classnames(
            "toast",
            ...componentClasses("toast", csVariant, csSize, undefined),
            rootClasses
          )}
          ref={forwardedRef}
        >
          <NewIcon noWrapper csMode="inline" rootClasses="toast__icon">
            <FontAwesomeIcon icon={icon} />
          </NewIcon>
          <span className="toast__content">{children}</span>
          <RadixToast.Close className="toast__close" aria-label="Close">
            <NewIcon rootClasses="toast__close-icon" csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmarkLarge} />
            </NewIcon>
          </RadixToast.Close>
        </div>
      </RadixToast.Root>
    );
  }
);

Toast.displayName = "Toast";

const getIcon = (scheme: ToastProps["csVariant"] = "info") => {
  return {
    info: faExclamationCircle,
    success: faCheckCircle,
    warning: faExclamationTriangle,
    danger: faOctagonExclamation,
  }[scheme];
};
