import React from "react";
import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Button } from "../../../Button/Button";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { Dialog } from "../../../Dialog/Dialog";
import { ServiceAccount } from "../../../../schema";
import { getServiceAccountDummyData } from "../../../../dummyData";

export interface TeamServiceAccountsProps {
  serviceAccountData: string[];
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
            <ServiceAccountList
              serviceAccountData={getServiceAccountListData(serviceAccountData)}
            />
          </div>
        }
      />
    </div>
  );
};

TeamServiceAccounts.displayName = "TeamServiceAccounts";
TeamServiceAccounts.defaultProps = { serviceAccountData: [] };

function getServiceAccountListData(
  serviceAccountIds: string[]
): ServiceAccount[] {
  const serviceAccountArray: ServiceAccount[] = [];
  serviceAccountIds.forEach((serviceAccountId) => {
    serviceAccountArray.push(getServiceAccountDummyData(serviceAccountId));
  });
  return serviceAccountArray;
}
