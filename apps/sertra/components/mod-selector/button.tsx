import { PropsWithChildren } from "react";

import styles from "./button.module.css";

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void;
}

interface ButtonBaseProps extends ButtonProps {
  className: string;
}

const ButtonBase: React.FC<ButtonBaseProps> = (props) => <button {...props} />;

export const ButtonPrimary: React.FC<ButtonProps> = (props) => (
  <ButtonBase className={styles.buttonPrimary} {...props} />
);

export const ButtonSecondary: React.FC<ButtonProps> = (props) => (
  <ButtonBase className={styles.buttonSecondary} {...props} />
);
