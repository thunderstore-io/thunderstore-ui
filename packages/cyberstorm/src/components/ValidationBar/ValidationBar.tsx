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
import { usePromise } from "@thunderstore/use-promise";
import { useDebounce } from "use-debounce";

const waitingElement = (
  <div className={styles.statusBar}>
    <Icon inline wrapperClasses={styles.icon}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </Icon>
    Waiting for input
  </div>
);

const processingElement = (
  <div className={styles.statusBar}>
    <Icon inline wrapperClasses={classnames(styles.icon, styles.spinningIcon)}>
      <FontAwesomeIcon icon={faArrowsRotate} />
    </Icon>
    Processing...
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

function ValidationElement(props: {
  validator: {
    validationFunc: (props: unknown) => Promise<{
      status: "waiting" | "processing" | "success" | "failure";
      message: string;
    }>;
    args: { [key: string]: unknown };
  };
  shouldValidate: boolean;
}) {
  const { validator, shouldValidate } = props;

  const [validation, setValidation] = useState<{
    status: "waiting" | "processing" | "success" | "failure";
    message: string;
  }>({ status: "waiting", message: "Waiting for input" });

  const [valArgs] = useDebounce({ ...validator.args }, 300, {
    maxWait: 300,
  });

  const getValidation = () => usePromise(validator.validationFunc, [valArgs]);

  useEffect(() => {
    if (shouldValidate) {
      setValidation(getValidation);
    }
  }, [valArgs]);

  return !shouldValidate
    ? waitingElement
    : validation.status === "success"
    ? successElement
    : validation.status === "failure" && validation.message
    ? failureElement(validation.message)
    : failureElement("Internal error");
}

/**
 * ValidationBar that takes in a validation function with arguments
 * executes validation function with usePromise
 */
export function ValidationBar(props: {
  validator: {
    validationFunc: (props: unknown) => Promise<{
      status: "waiting" | "processing" | "success" | "failure";
      message: string;
    }>;
    args: { [key: string]: unknown };
  };
  shouldValidate: boolean;
}): JSX.Element {
  const { validator, shouldValidate } = props;

  return (
    <Suspense fallback={processingElement}>
      <ValidationElement
        validator={validator}
        shouldValidate={shouldValidate}
      />
    </Suspense>
  );
}

ValidationBar.displayName = "ValidationBar";
