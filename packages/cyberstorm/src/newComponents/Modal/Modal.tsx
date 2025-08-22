import { ReactNode } from "react";
import { Frame, FrameModalProps } from "../../primitiveComponents/Frame/Frame";
import "./Modal.css";
import { NewButton, NewIcon } from "../..";
import { ModalVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "../../utils/utils";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { ModalSizes } from "@thunderstore/cyberstorm-theme/src/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props extends Omit<FrameModalProps, "primitiveType"> {
  trigger?: ReactNode;
  csVariant?: ModalVariants;
  csSize?: ModalSizes;
}

// TODO: Add storybook story
// TODO: Currently the same modal can't be used in 2 different places in the same page. Fix that somehow
export function Modal(props: Props) {
  const { children, csVariant = "default", csSize = "medium", trigger } = props;

  return (
    <>
      {trigger}
      <Frame
        primitiveType="modal"
        popoverId={props.popoverId}
        rootClasses={classnames(
          "modal",
          ...componentClasses("modal", csVariant, csSize, undefined)
        )}
      >
        <NewButton
          popoverTarget={props.popoverId}
          popoverTargetAction="hide"
          csVariant="secondary"
          csSize="medium"
          csModifiers={["ghost", "only-icon"]}
          tooltipText="Close"
          rootClasses="modal__button"
        >
          <NewIcon csMode="inline" csVariant="secondary" noWrapper>
            <FontAwesomeIcon icon={faXmarkLarge} />
          </NewIcon>
        </NewButton>
        <div className="modal__content">{children}</div>
      </Frame>
    </>
  );
}

Modal.displayName = "Modal";
