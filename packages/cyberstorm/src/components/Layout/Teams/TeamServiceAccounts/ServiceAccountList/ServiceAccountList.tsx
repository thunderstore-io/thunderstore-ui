import React from "react";
import styles from "./ServiceAccountList.module.css";
import { ServiceAccountListItem } from "./ServiceAccountListItem";
import { ServiceAccount } from "../../../../../schema";

export interface ServiceAccountListProps {
  serviceAccountData?: ServiceAccount[];
}

export const ServiceAccountList: React.FC<ServiceAccountListProps> = (
  props
) => {
  const { serviceAccountData } = props;

  const mappedServiceAccountList = serviceAccountData?.map(
    (serviceAccount: ServiceAccount, index: number) => {
      return (
        <div key={index}>
          <ServiceAccountListItem
            serviceAccountName={serviceAccount.name}
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
