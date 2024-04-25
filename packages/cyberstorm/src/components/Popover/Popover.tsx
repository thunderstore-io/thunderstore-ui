import { PropsWithChildren, ReactNode } from "react";

interface Props extends PropsWithChildren {
  trigger: ReactNode;
  popoverId: string;
  popoverRootClasses?: string;
  popoverWrapperClasses?: string;
  noWrapper?: boolean;
}

/**
 * Centralized component for using HTML popovers.
 * The trigger should already have popover attributes set
 * as it is just inserted as a child.
 */
export function Popover(props: Props) {
  return (
    <>
      {props.trigger}
      <div
        id={props.popoverId}
        {...{ popover: "auto" }}
        className={props.popoverRootClasses}
      >
        {props.noWrapper ? (
          props.children
        ) : (
          <div className={props.popoverWrapperClasses}>{props.children}</div>
        )}
      </div>
    </>
  );
}

Popover.displayName = "Popover";
