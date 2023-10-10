"use client";
import styles from "./CodeInput.module.css";
import { useState } from "react";
import { TextAreaInput } from "../TextAreaInput/TextAreaInput";
import { ValidationBar } from "../ValidationBar/ValidationBar";

interface CodeInputProps {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  validator?: {
    validationFunc: (
      props: any
    ) => Promise<{ status: "failure" | "success"; message: string }>;
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
    const [validationStatus, setValidationStatus] = useState("");
    return (
      <div
        className={`${styles.inputContainer} ${
          validationStatus === "failure" ? styles.inputContainerFailure : ""
        }`}
      >
        <TextAreaInput
          placeHolder={placeholder}
          setValue={setValue}
          value={value}
        />
        <ValidationBar
          validator={validator}
          shouldValidate={shouldValidate}
          setStatus={setValidationStatus}
        />
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.inputContainer} ${styles.inputContainerStatusBarDisabled}`}
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
