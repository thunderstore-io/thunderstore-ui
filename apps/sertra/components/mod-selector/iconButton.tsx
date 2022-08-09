import styles from "./iconButton.module.css";
import { DetailedHTMLProps } from "react";

interface IconButtonProps {
  content: string;
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
