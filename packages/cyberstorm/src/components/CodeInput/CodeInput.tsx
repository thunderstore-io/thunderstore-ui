import styles from "./CodeInput.module.css";
import { TextAreaInput } from "../TextAreaInput/TextAreaInput";
import { ValidationBar } from "../ValidationBar/ValidationBar";
import { classnames } from "../../utils/utils";

interface CodeInputProps {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  validationBarProps?: {
    status: "failure" | "success" | "waiting" | "processing";
    message?: string;
  };
}

/**
 * CodeInput with optional validation status bar
 */
export function CodeInput(props: CodeInputProps) {
  const { value, setValue, placeholder, validationBarProps } = props;

  if (validationBarProps) {
    return (
      <div className={styles.inputContainer}>
        <TextAreaInput
          placeHolder={placeholder}
          setValue={setValue}
          value={value}
        />
        <ValidationBar {...validationBarProps} />
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
