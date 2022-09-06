import { PropsWithChildren } from "react";

import styles from "./button.module.css";

interface ButtonBaseProps {
  className: string;
}
const ButtonBase: React.FC<PropsWithChildren<ButtonBaseProps>> = ({
  children,
  className,
}) => {
  return <button className={className}>{children}</button>;
};

interface ButtonProps {}
export const ButtonPrimary: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
}) => {
  return <ButtonBase className={styles.buttonPrimary}>{children}</ButtonBase>;
};

export const ButtonSecondary: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
}) => {
  return <ButtonBase className={styles.buttonSecondary}>{children}</ButtonBase>;
};
