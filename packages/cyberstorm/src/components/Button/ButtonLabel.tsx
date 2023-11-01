import { ReactNode } from "react";
import styles from "./Button.module.css";
import { classnames } from "../../utils/utils";

export interface ButtonLabelProps {
  children: ReactNode | ReactNode[];
  fontSize?: "small" | "medium" | "large" | "huge";
  fontWeight?: "600" | "700" | "800";
}

export function ButtonLabel(props: ButtonLabelProps) {
  const { children, fontSize = "medium", fontWeight = "700" } = props;
  return (
    <span
      className={classnames(
        styles.ButtonLabel,
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
    small: styles.ButtonLabel__font__small,
    medium: styles.ButtonLabel__font__medium,
    large: styles.ButtonLabel__font__large,
    huge: styles.ButtonLabel__font__huge,
  }[scheme];
};

const getFontWeight = (scheme: string) => {
  return {
    "600": styles.ButtonLabel__fontWeight__600,
    "700": styles.ButtonLabel__fontWeight__700,
    "800": styles.ButtonLabel__fontWeight__800,
  }[scheme];
};

ButtonLabel.displayName = "ButtonLabel";
