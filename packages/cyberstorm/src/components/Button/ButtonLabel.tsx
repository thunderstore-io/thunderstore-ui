import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface Props {
  children: ReactNode | ReactNode[];
  fontSize?: "small" | "medium" | "large" | "huge";
  fontWeight?: 600 | 700 | 800;
}

export function ButtonLabel(props: Props) {
  const { children, fontSize = "medium", fontWeight } = props;
  return (
    <span
      className={styles.label}
      data-font-size={fontSize}
      data-font-weight={fontWeight}
    >
      {children}
    </span>
  );
}

ButtonLabel.displayName = "ButtonLabel";
