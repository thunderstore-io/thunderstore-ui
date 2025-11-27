import {
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Modal.css";
import { Button as NewButton, type ButtonComponentProps } from "@thunderstore/cyberstorm-button";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { type ModalVariants } from "@thunderstore/cyberstorm-theme/src/components";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { type ModalSizes } from "@thunderstore/cyberstorm-theme/src/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";

/**
 * Props for the `Modal` component.
 *
 * The modal is built on top of Radix UI Dialog and supports both
 * controlled and uncontrolled usage. Provide `open`,
 * `onOpenChange` and/or `defaultOpen` to control it programmatically, or omit them and
 * pass a `trigger` element to let Radix manage state internally.
 */
export interface ModalProps
  extends PropsWithChildren,
    Pick<Dialog.DialogProps, "onOpenChange" | "open" | "defaultOpen"> {
  /**
   * Optional element that acts as the opener for the modal.
   * Rendered through Radix `Dialog.Trigger` with `asChild` so your
   * element receives the trigger behavior without extra wrappers.
   *
   * Omit this when you control the modal via `open`/`onOpenChange` only.
   */
  trigger?: ReactNode;
  /**
   * Visual variant (theme-driven).
   * @default "default"
   */
  csVariant?: ModalVariants;
  /**
   * Visual size (theme-driven).
   * @default "medium"
   */
  csSize?: ModalSizes;
  /**
   * Additional class names applied to the modal content container.
   */
  contentClasses?: string;
  /**
   * When true, prevents rendering the default Title region.
   * Useful when you supply your own `Modal.Title` as a child.
   */
  disableTitle?: boolean;
  /**
   * When true, prevents rendering the default Body region.
   * Use this if you want to fully control child layout yourself.
   */
  disableBody?: boolean;
  /**
   * When true, prevents rendering the default Footer region.
   */
  disableFooter?: boolean;
  /**
   * When true, prevents rendering the default Exit (close) button.
   * You can provide your own `Modal.Exit` as a child to replace it.
   */
  disableExit?: boolean;
  /**
   * When true, disables the default subcomponent parsing entirely and
   * renders children exactly as provided.
   */
  disableDefaultSubComponents?: boolean;
  /**
   * Shorthand content for the title region; rendered as `<Modal.Title>`.
   */
  titleContent?: ReactNode;
  /**
   * Shorthand content for the footer region; rendered as `<Modal.Footer>`.
   */
  footerContent?: ReactNode;
  /**
   * Value forwarded to `aria-describedby` on the dialog content.
   * Provide the id of an element that describes the dialog.
   */
  ariaDescribedby?: string;
  /**
   * When true, the modal overlay applies a heavy blur effect. Disable for better performance.
   */
  enableBackdropBlur?: boolean;
}
// TODO: Style system compatibility is currently degraded, improve to a agreed upon level according to specifications

/**
 * Accessible modal dialog built on Radix UI Dialog.
 *
 * This component provides an opinionated layout with optional subcomponents:
 * `Modal.Exit`, `Modal.Title`, `Modal.Body`, and `Modal.Footer`. You can either
 * let the component render sensible defaults (via `titleContent`/`footerContent`),
 * or provide the subcomponents directly as children for full control.
 *
 * Control model:
 * - Uncontrolled: omit `open`/`onOpenChange` and provide a `trigger` element.
 * - Controlled: pass `open` and `onOpenChange` to manage visibility from state.
 *
 * Styling is driven by `csVariant` and `csSize` which map to the theme system.
 *
 * @param props - See `ModalProps` for full list of options.
 *
 * @example Uncontrolled with trigger and shorthand title/footer
 * ```tsx
 * function Example() {
 *   return (
 *     <Modal
 *       trigger={<NewButton csVariant="primary">Open modal</NewButton>}
 *       titleContent="Example modal"
 *       footerContent={
 *         <>
 *           <NewButton csVariant="secondary">Cancel</NewButton>
 *           <NewButton csVariant="primary">Confirm</NewButton>
 *         </>
 *       }
 *     >
 *       <p>Body content goes here.</p>
 *     </Modal>
 *   );
 * }
 * ```
 *
 * @example Controlled (programmatic open/close via state)
 * ```tsx
 * import { useState } from "react";
 *
 * function ControlledExample() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       // Programmatically open the modal without a trigger
 *       <NewButton csVariant="primary" onClick={() => setOpen(true)}>
 *         Open programmatically
 *       </NewButton>
 *
 *       <Modal
 *         open={open}
 *         onOpenChange={setOpen}
 *         titleContent="Controlled modal"
 *       >
 *         <p>Controlled body content.</p>
 *         <Modal.Footer>
 *           <NewButton csVariant="secondary" onClick={() => setOpen(false)}>
 *             Close
 *           </NewButton>
 *         </Modal.Footer>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 *
 * @example Using explicit subcomponents and custom footer structure
 * ```tsx
 * function CustomStructure() {
 *   return (
 *     <Modal trigger={<NewButton>Open</NewButton>}>
 *       <Modal.Exit />
 *       <Modal.Title>Custom title</Modal.Title>
 *       <Modal.Body>
 *         <div>Rich body content…</div>
 *         <div>Rich body content…</div>
 *         <div>Rich body content…</div>
 *       </Modal.Body>
 *       <Modal.Footer>
 *         <NewButton csVariant="secondary">Dismiss</NewButton>
 *       </Modal.Footer>
 *     </Modal>
 *   );
 * }
 * ```
 */
export function Modal(props: ModalProps) {
  const {
    children,
    csVariant = "default",
    csSize = "medium",
    trigger,
    disableTitle,
    disableBody,
    disableFooter,
    disableExit,
    disableDefaultSubComponents,
    titleContent,
    footerContent,
    ariaDescribedby,
    enableBackdropBlur = false,
    contentClasses,
    open: controlledOpen,
    onOpenChange,
    defaultOpen,
  } = props;

  const filteredChildren: ReactNode[] = [];
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const effectiveOpen = isControlled ? controlledOpen! : internalOpen;

  // Radix Select/DropdownMenu can leave body pointer-events disabled if the modal closes first.
  const restoreBodyPointerEvents = useCallback(() => {
    if (typeof document === "undefined") return;
    const bodyStyle = document.body.style;
    if (bodyStyle.pointerEvents === "none") {
      bodyStyle.pointerEvents = "";
      if (typeof CustomEvent === "function") {
        document.dispatchEvent(new CustomEvent("dismissableLayer.update"));
      }
    }
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
      if (!next) {
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(restoreBodyPointerEvents);
        } else {
          restoreBodyPointerEvents();
        }
      }
    },
    [isControlled, onOpenChange, restoreBodyPointerEvents]
  );

  useEffect(() => {
    if (!effectiveOpen) {
      restoreBodyPointerEvents();
    }
    return () => {
      restoreBodyPointerEvents();
    };
  }, [effectiveOpen, restoreBodyPointerEvents]);

  let exit = <Modal.Exit />;

  let title = titleContent ? <Modal.Title>{titleContent}</Modal.Title> : null;

  let body = undefined;

  let footer = footerContent ? (
    <Modal.Footer>{footerContent}</Modal.Footer>
  ) : null;

  if (!disableDefaultSubComponents && children) {
    for (const child of children instanceof Array ? children : [children]) {
      if (child == null) continue;
      if (isValidElement(child)) {
        const childDisplayName =
          typeof child.type === "function" &&
          Object.prototype.hasOwnProperty.call(child.type, "displayName")
            ? (child.type as { displayName?: string }).displayName
            : "";
        if (!disableExit && childDisplayName === ModalExit.displayName) {
          exit = child;
          continue;
        }
        if (!disableTitle && childDisplayName === ModalTitle.displayName) {
          title = child;
          continue;
        }
        if (!disableFooter && childDisplayName === ModalFooter.displayName) {
          footer = child;
          continue;
        }
        if (!disableBody && childDisplayName === ModalBody.displayName) {
          body = child;
          continue;
        }
        filteredChildren.push(child);
      } else {
        filteredChildren.push(child);
      }
    }
  }

  return (
    <Dialog.Root
      {...(isControlled ? { open: controlledOpen } : {})}
      {...(!isControlled && defaultOpen !== undefined ? { defaultOpen } : {})}
      onOpenChange={handleOpenChange}
    >
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay
          className={classnames(
            "modal__overlay",
            enableBackdropBlur ? "modal__overlay--blur" : null
          )}
        >
          <Dialog.Content
            className={classnames(
              "modal",
              "modal__content",
              ...componentClasses("modal", csVariant, csSize, undefined),
              contentClasses
            )}
            aria-describedby={ariaDescribedby}
            onOpenAutoFocus={(e) => {
              // Prevent auto-focusing the first focusable (usually Exit button with tooltip)
              e.preventDefault();
              contentRef.current?.focus();
            }}
            tabIndex={-1}
            ref={contentRef}
          >
            {disableDefaultSubComponents ? (
              children
            ) : (
              <>
                {disableExit ? null : exit}
                {disableTitle ? null : title}
                {disableBody ? (
                  filteredChildren
                ) : body ? (
                  body
                ) : (
                  <Modal.Body>{filteredChildren}</Modal.Body>
                )}
                {disableFooter ? null : footer}
              </>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

Modal.displayName = "Modal";

function ModalExit(props: {
  modalCloseProps?: Dialog.DialogCloseProps;
  asChild?: boolean;
  buttonProps?: ButtonComponentProps;
}) {
  return (
    <Dialog.Close
      asChild={props.asChild === undefined ? true : props.asChild}
      {...props.modalCloseProps}
      className={classnames("modal__exit", props.modalCloseProps?.className)}
    >
      <NewButton
        csVariant="secondary"
        csSize="medium"
        csModifiers={["ghost", "only-icon"]}
        tooltipText="Close"
        rootClasses="modal__button"
        {...props.buttonProps}
      >
        <NewIcon csMode="inline" csVariant="secondary" noWrapper>
          <FontAwesomeIcon icon={faXmarkLarge} />
        </NewIcon>
      </NewButton>
    </Dialog.Close>
  );
}

ModalExit.displayName = "ModalExit";

function ModalTitle(props: Dialog.DialogTitleProps) {
  return (
    <Dialog.Title
      {...props}
      className={classnames("modal__title", props.className)}
    />
  );
}

ModalTitle.displayName = "ModalTitle";

function ModalBody(
  props: { asChild?: boolean; className?: string } & PropsWithChildren
) {
  if (props.asChild) {
    if (isValidElement(props.children)) {
      return cloneElement(
        props.children as React.ReactElement<{ className?: string }>,
        {
          className: classnames(
            "modal__body",
            (props.children.props as { className?: string }).className,
            props.className
          ),
        }
      );
    } else {
      console.warn("Modal.Body child is not valid for usage with asChild");
      return (
        <div className={classnames("modal__body", props.className)}>
          {props.children}
        </div>
      );
    }
  }

  return (
    <div className={classnames("modal__body", props.className)}>
      {props.children}
    </div>
  );
}

ModalBody.displayName = "ModalBody";

function ModalFooter(
  props: { asChild?: boolean; className?: string } & PropsWithChildren
) {
  if (props.asChild) {
    if (isValidElement(props.children)) {
      return cloneElement(
        props.children as React.ReactElement<{ className?: string }>,
        {
          className: classnames(
            "modal__footer",
            (props.children.props as { className?: string }).className,
            props.className
          ),
        }
      );
    } else {
      console.warn("Modal.Footer child is not valid for usage with asChild");
      return (
        <div className={classnames("modal__footer", props.className)}>
          {props.children}
        </div>
      );
    }
  }

  return (
    <div className={classnames("modal__footer", props.className)}>
      {props.children}
    </div>
  );
}

ModalFooter.displayName = "ModalFooter";

// Expose subcomponents for easier access
Modal.Root = Dialog.Root;
Modal.Trigger = Dialog.Trigger;
Modal.Portal = Dialog.Portal;
Modal.Overlay = Dialog.Overlay;
Modal.Content = Dialog.Content;
Modal.Close = Dialog.Close;
Modal.Exit = ModalExit;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
