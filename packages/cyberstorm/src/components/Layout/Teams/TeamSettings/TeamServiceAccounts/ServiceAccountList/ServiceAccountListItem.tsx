import styles from "./ServiceAccountListItem.module.css";
import * as Button from "../../../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../../../Icon/Icon";

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
        <Button.Root variant="danger">
          <Button.ButtonIcon>
            <Icon>
              <FontAwesomeIcon icon={faTrash} />
            </Icon>
          </Button.ButtonIcon>
          <Button.ButtonLabel>Remove</Button.ButtonLabel>
        </Button.Root>
      </div>
    </div>
  );
}

ServiceAccountListItem.displayName = "ServiceAccountListItem";
