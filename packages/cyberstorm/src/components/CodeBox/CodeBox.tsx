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
    <pre className={styles.root}>
      <code>{value}</code>
    </pre>
  );
}

CodeBox.displayName = "CodeBox";
