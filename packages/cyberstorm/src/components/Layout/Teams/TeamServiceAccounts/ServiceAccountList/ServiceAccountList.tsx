import React from "react";
import styles from "./ServiceAccountList.module.css";
import { ServiceAccountListItem } from "./ServiceAccountListItem";

export interface ServiceAccountDataItem {
  serviceAccountName: string;
  lastUsed?: string;
}

export interface ServiceAccountListProps {
  serviceAccountData?: Array<ServiceAccountDataItem>;
}

export const ServiceAccountList: React.FC<ServiceAccountListProps> = (
  props
) => {
  const { serviceAccountData } = props;

  const mappedServiceAccountList = serviceAccountData?.map(
    (serviceAccount: ServiceAccountDataItem, index: number) => {
      return (
        <div key={index}>
          <ServiceAccountListItem
            serviceAccountName={serviceAccount.serviceAccountName}
            lastUsed={serviceAccount.lastUsed}
          />
        </div>
      );
    }
  );

  return <div className={styles.root}>{mappedServiceAccountList}</div>;
};

ServiceAccountList.displayName = "ServiceAccountList";
ServiceAccountList.defaultProps = { serviceAccountData: [] };
