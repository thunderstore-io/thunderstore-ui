import styles from "./ServiceAccountList.module.css";
import { ServiceAccount } from "../../../../../../schema";
import { Dialog } from "../../../../../Dialog/Dialog";
import { Button } from "../../../../../Button/Button";
import { DataTable } from "../../../../../DataTable/DataTable";
import { ReactElement } from "react";
import { TableColumn } from "react-data-table-component";

export interface ServiceAccountListProps {
  serviceAccountData?: ServiceAccount[];
}

export function ServiceAccountList(props: ServiceAccountListProps) {
  const { serviceAccountData = [] } = props;

  const tableData: ServiceAccountData[] = [];
  serviceAccountData?.forEach((serviceAccount: ServiceAccount) => {
    tableData.push({
      name: serviceAccount.name,
      lastUsed: serviceAccount.lastUsed,
      actions: (
        <Dialog
          trigger={
            <Button label="Remove" colorScheme="danger" paddingSize="large" />
          }
          content={
            <div>
              TODO: Alert
              <div>
                You are about to remove service account{" "}
                <span className={styles.removeDescriptionAccountName}>
                  {serviceAccount.name}
                </span>
                .
              </div>
            </div>
          }
          acceptButton={
            <Button
              colorScheme="danger"
              paddingSize="large"
              label="Remove service account"
            />
          }
          cancelButton="default"
          showFooterBorder
          title="Confirm service account removal"
        />
      ),
    });
  });

  return (
    <DataTable<ServiceAccountData>
      columns={serviceAccountColumns}
      data={tableData}
    />
  );
}

ServiceAccountList.displayName = "ServiceAccountList";

type ServiceAccountData = {
  name: string;
  lastUsed: string;
  actions: ReactElement;
};

const serviceAccountColumns: TableColumn<ServiceAccountData>[] = [
  {
    name: "Nickname",
    style: {
      color: "var(--color-text--default)",
      fontWeight: 700,
    },
    sortable: true,
    selector: (row) => row.name,
  },
  {
    name: "Last Used",
    style: {
      color: "var(--color-text--secondary)",
    },
    sortable: true,
    selector: (row) => row.lastUsed,
  },
  {
    name: "Actions",
    cell: (row) => row.actions,
  },
];
