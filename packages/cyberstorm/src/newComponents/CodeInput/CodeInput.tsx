import {
  faArrowsRotate,
  faCircleCheck,
  faPenToSquare,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type ReactNode } from "react";

import {
  Input,
  type InputTextAreaProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./CodeInput.css";
import {
  type CodeInputModifiers,
  type CodeInputSizes,
  type CodeInputVariants,
} from "./CodeInput.types";

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

export function ValidationBar(props: {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
  rootClasses?: string;
  children?: ReactNode;
}): ReactNode {
  if (props.status === "waiting") {
    return (
      <div className={classnames("validation-bar", props.rootClasses)}>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faPenToSquare} />
        </NewIcon>
        {props.message ? props.message : "Waiting for input"}
        {props.children}
      </div>
    );
  } else if (props.status === "processing") {
    return (
      <div className={classnames("validation-bar", props.rootClasses)}>
        <NewIcon csMode="inline" noWrapper rootClasses="validation-bar--spin">
          <FontAwesomeIcon icon={faArrowsRotate} />
        </NewIcon>
        {props.message ? props.message : "Processing..."}
        {props.children}
      </div>
    );
  } else if (props.status === "success") {
    return (
      <div
        className={classnames(
          "validation-bar validation-bar--success",
          props.rootClasses
        )}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCircleCheck} />
        </NewIcon>
        {props.message ? props.message : "All systems go!"}
        {props.children}
      </div>
    );
  } else {
    return (
      <div
        className={classnames(
          "validation-bar validation-bar--failure",
          props.rootClasses
        )}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </NewIcon>
        {props.message
          ? props.message
          : "Problem, alarm, danger. Everything is going to explode."}
        {props.children}
      </div>
    );
  }
}

ValidationBar.displayName = "ValidationBar";
