import React from "react";
import styles from "./CodeBox.module.css";

export interface CodeBoxProps {
  value?: string;
  inline?: boolean;
}

export interface CodeBoxHTMLProps {
  value?: string;
  inline?: boolean;
}

function BaseCodeBox({
  children,
  inline = false,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  return <pre className={inline ? styles.inline : styles.root}>{children}</pre>;
}

/**
 * Cyberstorm CodeBox component
 */
export function CodeBox(props: CodeBoxProps) {
  const { value = "", inline = false } = props;

  return (
    <BaseCodeBox inline={inline}>
      <code>{value}</code>
    </BaseCodeBox>
  );
}

/**
 * Cyberstorm CodeBox component which renders HTML
 */
export function CodeBoxHTML(props: CodeBoxHTMLProps) {
  const { value = "", inline = false } = props;

  return (
    <BaseCodeBox inline={inline}>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </BaseCodeBox>
  );
}

CodeBox.displayName = "CodeBox";
