import styles from "./Title.module.css";

export interface TitleProps {
  text?: string;
}

/**
 * Cyberstorm Title component
 */
export function Title(props: TitleProps) {
  const { text = "" } = props;
  return <div className={styles.root}>{text}</div>;
}

Title.displayName = "Title";
