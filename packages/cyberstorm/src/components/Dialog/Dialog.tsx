"use client";
import { ReactNode, useState } from "react";
import styles from "./Dialog.module.css";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as Button from "../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { Icon, Tooltip } from "../..";

type DialogProps = {
  content?: ReactNode;
  defaultOpen?: boolean;
  trigger?: ReactNode;
  title?: string;
  acceptButton?: ReactNode | null;
  closeOnAccept?: boolean;
  cancelButton?: ReactNode | "default" | null;
  additionalFooterContent?: ReactNode;
  hideFooter?: boolean;
  noPadding?: boolean;
  showHeaderBorder?: boolean;
  showFooterBorder?: boolean;
};

/**
 * Cyberstorm Dialog Component
 */
export function Dialog(props: DialogProps) {
  const {
    additionalFooterContent = null,
    content,
    defaultOpen = false,
    trigger,
    acceptButton,
    closeOnAccept = true,
    cancelButton,
    title = undefined,
    hideFooter = false,
    noPadding = false,
    showHeaderBorder = false,
    showFooterBorder = false,
  } = props;

  const [isOpen, setOpen] = useState<boolean>(
    defaultOpen ? defaultOpen : false
  );

  let cancel = null;
  if (cancelButton === "default") {
    cancel = (
      <Button.Root paddingSize="large" variant="tertiary">
        <Button.ButtonLabel>Cancel</Button.ButtonLabel>
      </Button.Root>
    );
  } else if (cancelButton) {
    cancel = cancelButton;
  }

  let accept = null;
  if (acceptButton) {
    if (closeOnAccept) {
      accept = <RadixDialog.Close asChild>{acceptButton}</RadixDialog.Close>;
    } else {
      accept = acceptButton;
    }
  }

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div>
      <RadixDialog.Root open={isOpen} onOpenChange={setOpen}>
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className={styles.overlay}>
            <RadixDialog.Content className={styles.content}>
              <div
                className={`${styles.header} ${
                  showHeaderBorder ? styles.headerBorder : ""
                }`}
              >
                <Tooltip content="Close" side="bottom" open={tooltipOpen}>
                  <RadixDialog.Close asChild>
                    <Button.Root
                      variant="transparentDefault"
                      paddingSize="mediumSquare"
                      onMouseOver={() => {
                        setTooltipOpen(true);
                      }}
                      onMouseOut={() => {
                        setTooltipOpen(false);
                      }}
                    >
                      <Button.ButtonIcon>
                        <Icon>
                          <FontAwesomeIcon
                            className={styles.closeIcon}
                            icon={faXmarkLarge}
                          />
                        </Icon>
                      </Button.ButtonIcon>
                    </Button.Root>
                  </RadixDialog.Close>
                </Tooltip>
                {title ? <div className={styles.title}>{title}</div> : null}
              </div>

              <div
                className={`${styles.body} ${
                  noPadding ? "" : styles.bodyPadding
                }`}
              >
                {content}
              </div>

              {hideFooter ? null : (
                <div
                  className={`${styles.footer} ${
                    showFooterBorder ? styles.footerBorder : ""
                  }`}
                >
                  <div className={styles.footerSection}>
                    {additionalFooterContent}
                  </div>
                  <div className={styles.footerSection}>
                    <RadixDialog.Close asChild>{cancel}</RadixDialog.Close>
                    {accept}
                  </div>
                </div>
              )}
            </RadixDialog.Content>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
}

Dialog.displayName = "Dialog";
