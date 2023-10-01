import { ReactNode } from "react";
import styles from "./Label.module.css";

export interface LabelProps {
  children: ReactNode | ReactNode[];
  fontSize?: "small" | "medium" | "large" | "huge";
  fontWeight?: "600" | "700" | "800";
}

export function Label(props: LabelProps) {
  const { children, fontSize = "medium", fontWeight = "700" } = props;
  return (
    <span
      className={`${styles.root} ${getFontSize(fontSize)} ${getFontWeight(
        fontWeight
      )}`}
    >
      {children}
    </span>
  );
}

const getFontSize = (scheme: string) => {
  return {
    small: styles.font__small,
    medium: styles.font__medium,
    large: styles.font__large,
    huge: styles.font__huge,
  }[scheme];
};

const getFontWeight = (scheme: string) => {
  return {
    "600": styles.fontWeight__600,
    "700": styles.fontWeight__700,
    "800": styles.fontWeight__800,
  }[scheme];
};

Label.displayName = "Label";
