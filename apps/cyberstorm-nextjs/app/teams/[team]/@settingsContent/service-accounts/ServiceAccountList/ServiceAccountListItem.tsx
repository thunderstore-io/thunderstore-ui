import styles from "./ServiceAccountListItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@thunderstore/cyberstorm";

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
        <Button.Root colorScheme="danger">
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faTrashCan} />
          </Button.ButtonIcon>
          <Button.ButtonLabel>Remove</Button.ButtonLabel>
        </Button.Root>
      </div>
    </div>
  );
}

ServiceAccountListItem.displayName = "ServiceAccountListItem";
