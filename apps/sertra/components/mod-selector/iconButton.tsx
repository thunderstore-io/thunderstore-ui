import { DetailedHTMLProps, ReactNode } from "react";

import styles from "./iconButton.module.css";

interface IconButtonProps {
  content: ReactNode;
  buttonProps?: DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
}
export const IconButton: React.FC<IconButtonProps> = ({
  content,
  buttonProps,
}) => {
  return (
    <button {...buttonProps} className={styles.headerCloseButton}>
      {content}
    </button>
  );
};
