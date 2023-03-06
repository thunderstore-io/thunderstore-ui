import React from "react";
import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Button } from "../../../Button/Button";
import {
  ServiceAccountDataItem,
  ServiceAccountList,
} from "./ServiceAccountList/ServiceAccountList";
import { Dialog } from "../../../Dialog/Dialog";

export interface TeamServiceAccountsProps {
  serviceAccountData?: Array<ServiceAccountDataItem>;
}

export const TeamServiceAccounts: React.FC<TeamServiceAccountsProps> = (
  props
) => {
  const { serviceAccountData } = props;

  return (
    <div>
      <SettingItem
        title="Service accounts"
        description="Your loyal servants"
        additionalLeftColumnContent={
          <div>
            <Dialog
              title="Add Service Account"
              trigger={<Button label="Add Service Account" />}
            />
          </div>
        }
        content={
          <div className={styles.content}>
            <ServiceAccountList serviceAccountData={serviceAccountData} />
          </div>
        }
      />
    </div>
  );
};

TeamServiceAccounts.displayName = "TeamServiceAccounts";
TeamServiceAccounts.defaultProps = { serviceAccountData: [] };
