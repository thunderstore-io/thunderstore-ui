import styles from "./Title.module.css";

export interface TitleProps {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
}

/**
 * Cyberstorm Title component
 */
export function Title(props: TitleProps) {
  const { fontSize = 51, fontWeight = 800, text = "" } = props;
  return (
    <div
      style={{ fontSize: fontSize + "px", fontWeight: fontWeight }}
      className={styles.root}
    >
      {text}
    </div>
  );
}

Title.displayName = "Title";
