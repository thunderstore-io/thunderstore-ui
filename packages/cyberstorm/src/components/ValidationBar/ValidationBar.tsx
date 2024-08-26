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

import { classnames } from "../../utils/utils";
import { Suspense, useEffect, useState } from "react";

const waitingElement = (
  <div className={styles.statusBar}>
    <Icon inline wrapperClasses={styles.icon}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </Icon>
    Waiting for input
  </div>
);

const validatingElement = (
  <div className={styles.statusBar}>
    <Icon inline wrapperClasses={classnames(styles.icon, styles.spinningIcon)}>
      <FontAwesomeIcon icon={faArrowsRotate} />
    </Icon>
    Validating...
  </div>
);

const successElement = (
  <div className={classnames(styles.statusBar, styles.statusBarSuccess)}>
    <Icon inline wrapperClasses={styles.icon}>
      <FontAwesomeIcon icon={faCircleCheck} />
    </Icon>
    All systems go!
  </div>
);

const failureElement = (message: string) => {
  return (
    <div className={classnames(styles.statusBar, styles.statusBarFailure)}>
      <Icon inline wrapperClasses={classnames(styles.icon, styles.iconFailure)}>
        <FontAwesomeIcon icon={faTriangleExclamation} />
      </Icon>
      {message
        ? message
        : "Problem, alarm, danger. Everything is going to explode."}
    </div>
  );
};

function Validator(props: {
  validator: {
    validationFunc: (props: unknown) => Promise<{
      status: "failure" | "success" | "waiting";
      message: string;
    }>;
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

  const [validation, setValidation] = useState({
    status: "waiting",
    message: "",
  });

  useEffect(() => {
    async function getStatus() {
      setValidation(await validator.validationFunc({ ...validator.args }));
    }
    getStatus();
  }, [validator.args]);

  if (validation.status === "waiting") {
    return waitingElement;
  } else if (validation.status === "success") {
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
