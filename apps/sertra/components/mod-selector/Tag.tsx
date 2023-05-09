import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./Tag.module.css";

export interface TagProps {
  label: string;
  onRemove?: () => void;
  size?: "sm" | "lg";
}

export function Tag(props: TagProps) {
  return (
    <div className={`${styles.tag} ${styles[props.size ?? "sm"]}`}>
      {props.label}
      {props.onRemove && (
        <button type="button" onClick={props.onRemove}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
}

export interface TagListProps {
  tags: TagProps[];
  showMax?: number;
}

export function TagList(props: TagListProps) {
  const { tags, showMax } = props;
  const shown = tags.slice(0, showMax);
  const notShown = Math.max(tags.length - (showMax ?? 0), 0);

  return (
    <ul className={styles.tagList}>
      {shown.map((tagProps, i) => (
        <li key={`${tagProps.label}-${i}`}>
          <Tag {...tagProps} />
        </li>
      ))}
      {notShown > 0 && (
        <li className={styles.others}>...and {notShown} others</li>
      )}
    </ul>
  );
}
