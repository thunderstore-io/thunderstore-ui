import "./CodeInput.css";
import React, { ReactNode } from "react";
import {
  Input,
  InputTextAreaProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import { NewIcon } from "../..";
import {
  CodeInputVariants,
  CodeInputSizes,
  CodeInputModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";
import {
  faPenToSquare,
  faArrowsRotate,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

function ValidationBar(props: {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
}): ReactNode {
  if (props.status === "waiting") {
    return (
      <div className="validation-bar">
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faPenToSquare} />
        </NewIcon>
        {props.message ? props.message : "Waiting for input"}
      </div>
    );
  } else if (props.status === "processing") {
    return (
      <div className="validation-bar">
        <NewIcon csMode="inline" rootClasses="validation-bar--spin">
          <FontAwesomeIcon icon={faArrowsRotate} />
        </NewIcon>
        {props.message ? props.message : "Processing..."}
      </div>
    );
  } else if (props.status === "success") {
    return (
      <div className="validation-bar validation-bar--success">
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCircleCheck} />
        </NewIcon>
        {props.message ? props.message : "All systems go!"}
      </div>
    );
  } else {
    return (
      <div className="validation-bar validation-bar--failure">
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </NewIcon>
        {props.message
          ? props.message
          : "Problem, alarm, danger. Everything is going to explode."}
      </div>
    );
  }
}

ValidationBar.displayName = "ValidationBar";
