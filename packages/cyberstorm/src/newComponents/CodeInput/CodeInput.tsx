import {
  faArrowsRotate,
  faCircleCheck,
  faPenToSquare,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type ReactNode } from "react";

import {
  type CodeInputModifiers,
  type CodeInputSizes,
  type CodeInputVariants,
} from "@thunderstore/cyberstorm-theme";

import {
  Input,
  type InputTextAreaProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./CodeInput.css";

export interface CodeInputProps
  extends Omit<InputTextAreaProps, "primitiveType"> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  enterHook?: (value: string | number | readonly string[]) => string | void;
  validationBarProps?: {
    status: "failure" | "success" | "waiting" | "processing";
    message?: string;
  };
  csVariant?: CodeInputVariants;
  csSize?: CodeInputSizes;
  csModifiers?: CodeInputModifiers[];
}

// TODO: Finish the styles conversion to new system
export const CodeInput = React.forwardRef<HTMLTextAreaElement, CodeInputProps>(
  (props: CodeInputProps, forwardedRef) => {
    const {
      children,
      enterHook,
      rootClasses,
      validationBarProps,
      csVariant = "primary",
      csSize = "default",
      csModifiers,
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as InputTextAreaProps;
    const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (fProps.value && enterHook && e.key === "Enter") {
        enterHook(fProps.value);
      }
    };

    return (
      <div
        className={classnames(
          "code-input__wrapper",
          ...componentClasses(
            "code-input__wrapper",
            csVariant,
            csSize,
            csModifiers
          ),
          rootClasses
        )}
      >
        <div className="code-input__body">
          <Input
            {...fProps}
            primitiveType={"textArea"}
            rootClasses={classnames(
              "code-input",
              ...componentClasses("code-input", csVariant, csSize, csModifiers)
            )}
            ref={forwardedRef}
            onKeyDown={onEnter}
          >
            {children}
          </Input>
        </div>
        {validationBarProps ? <ValidationBar {...validationBarProps} /> : null}
      </div>
    );
  }
);

CodeInput.displayName = "CodeInput";

const VALIDATION_BAR_STATES = {
  waiting: {
    icon: faPenToSquare,
    modifier: undefined,
    defaultMessage: "Waiting for input",
  },
  processing: {
    icon: faArrowsRotate,
    modifier: undefined,
    defaultMessage: "Processing...",
  },
  success: {
    icon: faCircleCheck,
    modifier: "validation-bar--success",
    defaultMessage: "All systems go!",
  },
  failure: {
    icon: faTriangleExclamation,
    modifier: "validation-bar--failure",
    defaultMessage: "Problem, alarm, danger. Everything is going to explode.",
  },
} as const;

export function ValidationBar(props: {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
  rootClasses?: string;
  children?: ReactNode;
}): ReactNode {
  const state = VALIDATION_BAR_STATES[props.status];
  return (
    <div
      className={classnames(
        "validation-bar",
        state.modifier,
        props.rootClasses
      )}
    >
      {props.status === "processing" ? (
        <NewIcon csMode="inline" rootClasses="validation-bar--spin">
          <FontAwesomeIcon icon={state.icon} />
        </NewIcon>
      ) : (
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={state.icon} />
        </NewIcon>
      )}
      {props.message ?? state.defaultMessage}
      {props.children}
    </div>
  );
}

ValidationBar.displayName = "ValidationBar";
