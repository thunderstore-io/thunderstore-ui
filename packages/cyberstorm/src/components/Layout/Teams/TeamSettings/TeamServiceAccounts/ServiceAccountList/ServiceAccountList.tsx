import styles from "./ServiceAccountList.module.css";
import { ServiceAccount } from "../../../../../../schema";
import { Dialog } from "../../../../../Dialog/Dialog";
import { Button } from "../../../../../Button/Button";
import { DataTable, DataTableRows } from "../../../../../DataTable/DataTable";

export interface ServiceAccountListProps {
  serviceAccountData?: ServiceAccount[];
}

export function ServiceAccountList(props: ServiceAccountListProps) {
  const { serviceAccountData = [] } = props;

  const tableData: DataTableRows = [];
  serviceAccountData?.forEach((serviceAccount: ServiceAccount, index) => {
    tableData.push([
      { value: serviceAccount.name, sortValue: serviceAccount.name },
      { value: serviceAccount.lastUsed, sortValue: serviceAccount.lastUsed },
      {
        value: (
          <Dialog
            key={`${serviceAccount.name}_${index}`}
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
        sortValue: 0,
      },
    ]);
  });

  return <DataTable headers={serviceAccountColumns} rows={tableData} />;
}

ServiceAccountList.displayName = "ServiceAccountList";

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];
