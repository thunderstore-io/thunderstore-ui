import styles from "./CodeBox.module.css";

export interface CodeBoxProps {
  value?: string;
}

/**
 * Cyberstorm CodeBox component
 */
export function CodeBox(props: CodeBoxProps) {
  const { value = "" } = props;

  return (
    <code className={styles.root}>
      <pre>{value}</pre>
    </code>
  );
}

CodeBox.displayName = "CodeBox";
