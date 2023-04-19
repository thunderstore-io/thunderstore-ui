import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import styles from "./iconButton.module.css";

interface IconButtonProps {
  content: ReactNode;
  buttonProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
}
export function IconButton(props: IconButtonProps) {
  const { content, buttonProps } = props;
  return (
    <button {...buttonProps} className={styles.headerCloseButton}>
      {content}
    </button>
  );
}
