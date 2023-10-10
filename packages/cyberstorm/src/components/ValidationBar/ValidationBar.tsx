"use client";
import styles from "./ValidationBar.module.css";
import { Icon } from "../Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faPenToSquare,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { Suspense } from "react";

import { usePromise } from "@thunderstore/use-promise";

const waitingElement = (
  <div className={styles.statusBar}>
    <div className={styles.icon}>
      <Icon>
        <FontAwesomeIcon icon={faPenToSquare} />
      </Icon>
    </div>
    Waiting for input
  </div>
);

const validatingElement = (
  <div className={styles.statusBar}>
    <div className={`${styles.icon} ${styles.spinningIcon}`}>
      <Icon>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </Icon>
    </div>
    Validating...
  </div>
);

const successElement = (
  <div className={`${styles.statusBar} ${styles.statusBarSuccess}`}>
    <div className={styles.icon}>
      <Icon>
        <FontAwesomeIcon icon={faCircleCheck} />
      </Icon>
    </div>
    All systems go!
  </div>
);

const failureElement = (message: string) => {
  return (
    <div className={`${styles.statusBar} ${styles.statusBarFailure}`}>
      <div className={`${styles.icon} ${styles.iconFailure}`}>
        <Icon>
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </Icon>
      </div>
      {message
        ? message
        : "Problem, alarm, danger. Everything is going to explode."}
    </div>
  );
};

function Validator(props: {
  validator: {
    validationFunc: (
      props: unknown
    ) => Promise<{ status: "failure" | "success"; message: string }>;
    args: { [key: string]: unknown };
  };
  shouldValidate: boolean;
  setStatus?: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const { validator, shouldValidate, setStatus } = props;

  if (!shouldValidate) {
    if (setStatus) setStatus("waiting");
    return waitingElement;
  }

  const validation = usePromise(validator.validationFunc, [
    { ...validator.args },
  ]);

  if (validation.status === "success") {
    if (setStatus) setStatus("success");
    return successElement;
  } else if (validation.status === "failure" && validation.message) {
    if (setStatus) setStatus("failure");
    return failureElement(validation.message);
  } else {
    if (setStatus) setStatus("failure");
    return failureElement("Validator internal error");
  }
}

/**
 * ValidationBar that takes in a validation function with arguments
 * executes validation function with usePromise
 */
export function ValidationBar(props: {
  validator: {
    validationFunc: (
      props: unknown
    ) => Promise<{ status: "failure" | "success"; message: string }>;
    args: { [key: string]: unknown };
  };
  shouldValidate: boolean;
  setStatus?: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const { validator, shouldValidate, setStatus } = props;

  return (
    <Suspense fallback={validatingElement}>
      <Validator
        validator={validator}
        shouldValidate={shouldValidate}
        setStatus={setStatus}
      />
    </Suspense>
  );
}

ValidationBar.displayName = "ValidationBar";
