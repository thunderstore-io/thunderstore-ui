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
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
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
    open,
    onOpenChange,
    trigger,
    title = undefined,
    showHeaderBorder = false,
  } = props;

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div>
      <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
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
