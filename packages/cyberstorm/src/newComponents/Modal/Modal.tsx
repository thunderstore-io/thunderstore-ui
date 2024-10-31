import { ReactNode } from "react";
import { Frame, FrameModalProps } from "../../primitiveComponents/Frame/Frame";
import "./Modal.css";
import { NewButton } from "../..";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ModalVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "../../utils/utils";

interface Props extends Omit<FrameModalProps, "primitiveType"> {
  trigger: ReactNode;
  csVariant?: ModalVariants;
}

// TODO: Add storybook story
export function Modal(props: Props) {
  const { children, csVariant = "primary" } = props;

  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="modal"
        popoverId={props.popoverId}
        rootClasses={classnames(
          "ts-modal",
          ...componentClasses(csVariant, undefined, undefined)
        )}
        wrapperClasses={classnames(
          "ts-modal__wrapper",
          ...componentClasses(csVariant, undefined, undefined)
        )}
      >
        <NewButton
          {...{
            popovertarget: props.popoverId,
            popovertargetaction: "close",
          }}
          csVariant="secondary"
          csSize="medium"
          csModifiers={["ghost"]}
          tooltipText="Close"
          icon={faXmark}
        />
        {children}
      </Frame>
    </>
  );
}

Modal.displayName = "Modal";
