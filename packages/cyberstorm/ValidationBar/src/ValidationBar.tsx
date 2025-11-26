// TODO: Turn into non-module css
import styles from "./ValidationBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faPenToSquare,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

import { classnames } from "@thunderstore/cyberstorm-utils";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";
import { type ReactNode } from "react";

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
