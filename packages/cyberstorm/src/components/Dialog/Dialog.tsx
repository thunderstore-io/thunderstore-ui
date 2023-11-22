"use client";
import { PropsWithChildren, ReactNode, useState } from "react";
import styles from "./Dialog.module.css";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as Button from "../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { Tooltip } from "../..";
import { classnames } from "../../utils/utils";

interface DialogProps extends PropsWithChildren {
  defaultOpen?: boolean;
  trigger?: ReactNode;
  title?: string;
  showHeaderBorder?: boolean;
}

/**
 * Cyberstorm Dialog Component
 */
export function Dialog(props: DialogProps) {
  const {
    children,
    defaultOpen = false,
    trigger,
    title = undefined,
    showHeaderBorder = false,
  } = props;

  const [isOpen, setOpen] = useState<boolean>(
    defaultOpen ? defaultOpen : false
  );

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div>
      <RadixDialog.Root open={isOpen} onOpenChange={setOpen}>
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className={styles.overlay}>
            <RadixDialog.Content className={styles.content}>
              <div
                className={classnames(
                  styles.header,
                  showHeaderBorder ? styles.headerBorder : null
                )}
              >
                <Tooltip content="Close" side="bottom" open={tooltipOpen}>
                  <RadixDialog.Close asChild>
                    <Button.Root
                      colorScheme="transparentDefault"
                      paddingSize="mediumSquare"
                      onMouseOver={() => {
                        setTooltipOpen(true);
                      }}
                      onMouseOut={() => {
                        setTooltipOpen(false);
                      }}
                    >
                      <Button.ButtonIcon>
                        <FontAwesomeIcon
                          className={styles.closeIcon}
                          icon={faXmarkLarge}
                        />
                      </Button.ButtonIcon>
                    </Button.Root>
                  </RadixDialog.Close>
                </Tooltip>
                {title ? <div className={styles.title}>{title}</div> : null}
              </div>

              <div className={styles.body}>{children}</div>
            </RadixDialog.Content>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
}

Dialog.displayName = "Dialog";

export { Dialog as Root };
