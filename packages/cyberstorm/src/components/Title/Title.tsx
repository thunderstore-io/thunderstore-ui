import React from "react";
import styles from "./Title.module.css";

export interface TitleProps {
  text?: string;
}

/**
 * Cyberstorm Title component
 */
export const Title: React.FC<TitleProps> = (props) => {
  const { text } = props;
  return <div className={styles.root}>{text}</div>;
};

Title.displayName = "Title";
Title.defaultProps = { text: "" };
