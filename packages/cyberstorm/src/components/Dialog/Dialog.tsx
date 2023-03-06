import React, { ReactNode, useState } from "react";
import styles from "./Dialog.module.css";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type DialogProps = {
  content?: ReactNode;
  defaultOpen?: boolean;
  trigger?: ReactNode;
  title?: string;
  acceptButton?: ReactNode;
  cancelButton?: ReactNode;
};

/**
 * Cyberstorm Dialog Component
 */
export const Dialog: React.FC<DialogProps> = (props) => {
  const { content, defaultOpen, trigger, acceptButton, cancelButton, title } =
    props;

  const [isOpen, setOpen] = useState<boolean>(
    defaultOpen ? defaultOpen : false
  );

  return (
    <div>
      <RadixDialog.Root open={isOpen} onOpenChange={setOpen}>
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className={styles.overlay} />
          <RadixDialog.Content className={styles.content}>
            <div className={styles.section}>
              <div className={styles.heading}>
                <RadixDialog.Close asChild>
                  <Button
                    colorScheme="transparentDefault"
                    leftIcon={<FontAwesomeIcon icon={faXmark} fixedWidth />}
                  />
                </RadixDialog.Close>
                {title ? <Title size="smaller" text={title} /> : null}
              </div>
            </div>

            <div className={styles.section}>{content}</div>

            <div className={styles.separator} />
            <div className={styles.section}>
              <div className={styles.footer}>
                {!cancelButton ? (
                  <RadixDialog.Close asChild>
                    <Button label="Cancel" colorScheme="transparentDefault" />
                  </RadixDialog.Close>
                ) : (
                  <RadixDialog.Close asChild>{cancelButton}</RadixDialog.Close>
                )}

                {!acceptButton ? null : (
                  <RadixDialog.Close asChild>{acceptButton}</RadixDialog.Close>
                )}
              </div>
            </div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  );
};

Dialog.displayName = "Dialog";
Dialog.defaultProps = { defaultOpen: false, title: undefined };
