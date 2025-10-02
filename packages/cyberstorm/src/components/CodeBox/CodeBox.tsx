import styles from "./CodeBox.module.css";

export interface CodeBoxProps {
  value?: string;
  inline?: boolean;
}

/**
 * Cyberstorm CodeBox component
 */
export function CodeBox(props: CodeBoxProps) {
  const { value = "", inline = false } = props;

  return (
    <pre className={inline ? styles.inline : styles.root}>
      <code>{value}</code>
    </pre>
  );
}

CodeBox.displayName = "CodeBox";
