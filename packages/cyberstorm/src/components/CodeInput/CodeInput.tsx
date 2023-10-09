"use client";
import styles from "./CodeInput.module.css";
import { Icon } from "../Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faPenToSquare,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

import { TextAreaInput } from "../TextAreaInput/TextAreaInput";

interface CodeInputProps {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  validationBar?: boolean;
  validationStatus?: "waiting" | "validating" | "success" | "failure";
  failureMessage?: string;
}

/**
 * CodeInput with optional validation status bar
 */
export function CodeInput(props: CodeInputProps) {
  const {
    value,
    setValue,
    placeholder,
    validationBar = false,
    validationStatus,
    failureMessage,
  } = props;

  let statusElement = null;
  if (validationBar) {
    if (validationStatus === "waiting") {
      statusElement = (
        <div className={styles.statusBar}>
          <div className={styles.icon}>
            <Icon>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Icon>
          </div>
          Waiting for input
        </div>
      );
    } else if (validationStatus === "validating") {
      statusElement = (
        <div className={styles.statusBar}>
          <div className={`${styles.icon} ${styles.spinningIcon}`}>
            <Icon>
              <FontAwesomeIcon icon={faArrowsRotate} />
            </Icon>
          </div>
          Validating...
        </div>
      );
    } else if (validationStatus === "success") {
      statusElement = (
        <div className={`${styles.statusBar} ${styles.statusBarSuccess}`}>
          <div className={styles.icon}>
            <Icon>
              <FontAwesomeIcon icon={faCircleCheck} />
            </Icon>
          </div>
          All systems go!
        </div>
      );
    } else if (validationStatus === "failure") {
      statusElement = (
        <div className={`${styles.statusBar} ${styles.statusBarFailure}`}>
          <div className={`${styles.icon} ${styles.iconFailure}`}>
            <Icon>
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </Icon>
          </div>
          {failureMessage
            ? failureMessage
            : "Problem, alarm, danger. Everything is going to explode."}
        </div>
      );
    }
  }
  return (
    <div
      className={`${styles.inputContainer} ${
        validationStatus === "failure" ? styles.inputContainerFailure : ""
      } ${!validationBar ? styles.inputContainerStatusBarDisabled : ""}`}
    >
      <TextAreaInput
        placeHolder={placeholder}
        setValue={setValue}
        value={value}
      />
      {validationBar ? statusElement : null}
    </div>
  );
}

CodeInput.displayName = "CodeInput";
