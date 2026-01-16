// TODO: Turn into non-module css
import {
  faArrowsRotate,
  faCircleCheck,
  faPenToSquare,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode } from "react";

import { NewIcon } from "../..";
import { classnames } from "../../utils/utils";
import styles from "./ValidationBar.module.css";

export function ValidationBar(props: {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
}): ReactNode {
  if (props.status === "waiting") {
    return (
      <div className={styles.statusBar}>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faPenToSquare} />
        </NewIcon>
        {props.message ? props.message : "Waiting for input"}
      </div>
    );
  } else if (props.status === "processing") {
    return (
      <div className={styles.statusBar}>
        <NewIcon csMode="inline" rootClasses={styles.spinningIcon}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </NewIcon>
        {props.message ? props.message : "Processing..."}
      </div>
    );
  } else if (props.status === "success") {
    return (
      <div className={classnames(styles.statusBar, styles.statusBarSuccess)}>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCircleCheck} />
        </NewIcon>
        {props.message ? props.message : "All systems go!"}
      </div>
    );
  } else {
    return (
      <div className={classnames(styles.statusBar, styles.statusBarFailure)}>
        <NewIcon csMode="inline" noWrapper rootClasses={styles.iconFailure}>
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
