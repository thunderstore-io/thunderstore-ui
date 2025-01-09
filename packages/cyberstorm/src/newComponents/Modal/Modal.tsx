import { ReactNode } from "react";
import { Frame, FrameModalProps } from "../../primitiveComponents/Frame/Frame";
import "./Modal.css";
import { NewButton } from "../..";
import { ModalVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "../../utils/utils";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { ModalSizes } from "@thunderstore/cyberstorm-theme/src/components/Modal/Modal";

interface Props extends Omit<FrameModalProps, "primitiveType"> {
  trigger: ReactNode;
  csVariant?: ModalVariants;
  csSize?: ModalSizes;
}

// TODO: Add storybook story
export function Modal(props: Props) {
  const { children, csVariant = "default", csSize = "medium" } = props;

  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="modal"
        popoverId={props.popoverId}
        rootClasses={classnames(
          "ts-modal",
          ...componentClasses(csVariant, csSize, undefined)
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
          icon={faXmarkLarge}
          rootClasses="ts-modal__button"
        />
        <div className="ts-modal__content">{children}</div>
      </Frame>
    </>
  );
}

Modal.displayName = "Modal";
