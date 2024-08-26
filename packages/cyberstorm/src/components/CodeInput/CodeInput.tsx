"use client";
import styles from "./CodeInput.module.css";
import { TextAreaInput } from "../TextAreaInput/TextAreaInput";
import { ValidationBar } from "../ValidationBar/ValidationBar";
import { classnames } from "../../utils/utils";

interface CodeInputProps {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  validator?: {
    validationFunc: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props: any
    ) => Promise<{
      status: "failure" | "success" | "waiting";
      message: string;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: { [key: string]: any };
  };
  shouldValidate?: boolean;
}

/**
 * CodeInput with optional validation status bar
 */
export function CodeInput(props: CodeInputProps) {
  const {
    value,
    setValue,
    placeholder,
    validator,
    shouldValidate = true,
  } = props;

  if (validator) {
    return (
      <div className={styles.inputContainer}>
        <TextAreaInput
          placeHolder={placeholder}
          setValue={setValue}
          value={value}
        />
        <ValidationBar validator={validator} shouldValidate={shouldValidate} />
      </div>
    );
  } else {
    return (
      <div
        className={classnames(
          styles.inputContainer,
          styles.inputContainerStatusBarDisabled
        )}
      >
        <TextAreaInput
          placeHolder={placeholder}
          setValue={setValue}
          value={value}
        />
      </div>
    );
  }
}

CodeInput.displayName = "CodeInput";
