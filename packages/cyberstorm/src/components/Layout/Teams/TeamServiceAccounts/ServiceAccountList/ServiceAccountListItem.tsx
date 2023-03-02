import styles from "./ServiceAccountListItem.module.css";
import React from "react";
import { Button } from "../../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface ServiceAccountListItemProps {
  serviceAccountName?: string;
  lastUsed?: string;
}

export const ServiceAccountListItem: React.FC<ServiceAccountListItemProps> = (
  props
) => {
  const { serviceAccountName, lastUsed } = props;

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
};

ServiceAccountListItem.displayName = "ServiceAccountListItem";
ServiceAccountListItem.defaultProps = { serviceAccountName: "", lastUsed: "" };
