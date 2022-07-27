import styles from "./iconButton.module.css";

interface IconButtonProps {
  content: string;
}
export const IconButton: React.FC<IconButtonProps> = ({ content }) => {
  return <button className={styles.headerCloseButton}>{content}</button>;
};
