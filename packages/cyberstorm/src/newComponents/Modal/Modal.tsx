import { PropsWithChildren, type ReactNode } from "react";
import "./Modal.css";
import { NewButton, NewIcon } from "../..";
import { type ModalVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "../../utils/utils";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { type ModalSizes } from "@thunderstore/cyberstorm-theme/src/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";

export interface ModalProps extends PropsWithChildren {
  trigger?: ReactNode;
  csVariant?: ModalVariants;
  csSize?: ModalSizes;
  titleContent?: ReactNode;
  title?: ReactNode;
  footerContent?: ReactNode;
  ariaDescribedby?: string;
}

export function Modal(props: ModalProps) {
  const {
    children,
    csVariant = "default",
    csSize = "medium",
    trigger,
    titleContent,
    title,
    footerContent,
    ariaDescribedby,
  } = props;

  return (
    <>
      {trigger}
      <Dialog.Root>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="modal__overlay" />
          <Dialog.Content
            className={classnames(
              "modal",
              "modal__content",
              ...componentClasses("modal", csVariant, csSize, undefined)
            )}
            aria-describedby={ariaDescribedby}
          >
            {title ? (
              title
            ) : (
              <Dialog.Title asChild>
                <div className="modal__title">
                  {titleContent ? (
                    <span className="modal__title-content">{titleContent}</span>
                  ) : null}
                  <Dialog.Close asChild>
                    <NewButton
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
                  </Dialog.Close>
                </div>
              </Dialog.Title>
            )}
            {children}
            {footerContent ? (
              <div className="modal__footer">{footerContent}</div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

Modal.displayName = "Modal";

Modal.Title = Dialog.Title;
Modal.Close = Dialog.Close;
Modal.Trigger = Dialog.Trigger;
Modal.Portal = Dialog.Portal;
Modal.Overlay = Dialog.Overlay;
Modal.Content = Dialog.Content;
