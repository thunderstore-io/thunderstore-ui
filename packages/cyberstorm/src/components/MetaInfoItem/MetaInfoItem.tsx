"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MetaInfoItem.module.css";

type Props = {
  label: string;
  content?: ReactNode;
};

export const MetaInfoItem = React.forwardRef<HTMLDivElement, Props>(
  (props, forwardedRef) => {
    const { label, content, ...forwardedProps } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div {...forwardedProps} ref={ref} className={styles.root}>
        <div className={styles.label}>{label}</div>
        {content}
      </div>
    );
  }
);

MetaInfoItem.displayName = "MetaInfoItem";
