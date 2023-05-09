import { PropsWithChildren } from "react";

import styles from "./button.module.css";

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void;
}

interface ButtonBaseProps extends ButtonProps {
  className: string;
}

function ButtonBase(props: ButtonBaseProps) {
  return <button {...props} />;
}

export function ButtonPrimary(props: ButtonProps) {
  return <ButtonBase className={styles.buttonPrimary} {...props} />;
}

export function ButtonSecondary(props: ButtonProps) {
  return <ButtonBase className={styles.buttonSecondary} {...props} />;
}
