import { ReactNode } from "react";
import styles from "./Button.module.css";
import classNames from "classnames";

export interface ButtonLabelProps {
  children: ReactNode | ReactNode[];
  fontSize?: "small" | "medium" | "large" | "huge";
  fontWeight?: "medium" | "bold" | "boldest";
}

export function ButtonLabel(props: ButtonLabelProps) {
  const { children, fontSize = "medium", fontWeight = "bold" } = props;
  return (
    <span
      className={classNames(
        styles.label,
        getFontSize(fontSize),
        getFontWeight(fontWeight)
      )}
    >
      {children}
    </span>
  );
}

const getFontSize = (scheme: string) => {
  return {
    small: styles.font_small,
    medium: styles.font_medium,
    large: styles.font_large,
    huge: styles.font_huge,
  }[scheme];
};

const getFontWeight = (scheme: string) => {
  return {
    medium: styles.label_font_weight_medium,
    bold: styles.label_font_weight_medium,
    boldest: styles.label_font_weight_medium,
  }[scheme];
};

ButtonLabel.displayName = "ButtonLabel";
