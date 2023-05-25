import styles from "./ServiceAccountListItem.module.css";
import { Button } from "../../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface ServiceAccountListItemProps {
  serviceAccountName?: string;
  lastUsed?: string;
}

export function ServiceAccountListItem(props: ServiceAccountListItemProps) {
  const { serviceAccountName = "", lastUsed = "" } = props;

  return (
    <div className={styles.root}>
      <div className={styles.name}>{serviceAccountName}</div>
      <div className={styles.details}>{lastUsed}</div>
      <div className={styles.action}>
        <Button
          colorScheme="danger"
          label="Remove"
          leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
        />
      </div>
    </div>
  );
}

ServiceAccountListItem.displayName = "ServiceAccountListItem";
