import styles from "./ServiceAccountList.module.css";
import { ServiceAccount } from "@thunderstore/dapper/types";
import { Dialog } from "../../../../../Dialog/Dialog";
import * as Button from "../../../../../Button";
import { Table, TableRows } from "../../../../../Table/Table";
import { Alert, Icon } from "../../../../../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/pro-solid-svg-icons";

export interface ServiceAccountListProps {
  serviceAccountData?: ServiceAccount[];
}

export function ServiceAccountList(props: ServiceAccountListProps) {
  const { serviceAccountData = [] } = props;

  const tableData: TableRows = [];
  serviceAccountData?.forEach((serviceAccount: ServiceAccount, index) => {
    tableData.push([
      { value: serviceAccount.name, sortValue: serviceAccount.name },
      { value: serviceAccount.lastUsed, sortValue: serviceAccount.lastUsed },
      {
        value: (
          <Dialog
            key={`${serviceAccount.name}_${index}`}
            trigger={
              <Button.Root variant="danger" paddingSize="large">
                <Button.ButtonLabel>Remove</Button.ButtonLabel>
              </Button.Root>
            }
            content={
              <div className={styles.content}>
                <Alert
                  icon={
                    <Icon>
                      <FontAwesomeIcon icon={faTriangleExclamation} />
                    </Icon>
                  }
                  content={
                    "This cannot be undone! Related API token will stop working immediately if the service account is removed."
                  }
                  variant="warning"
                />
                <span>
                  You are about to remove service account{" "}
                  <span className={styles.removeDescriptionAccountName}>
                    {serviceAccount.name}
                  </span>
                  .
                </span>
              </div>
            }
            acceptButton={
              <Button.Root variant="danger" paddingSize="large">
                <Button.ButtonLabel>Remove service account</Button.ButtonLabel>
              </Button.Root>
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

  return (
    <Table
      headers={serviceAccountColumns}
      rows={tableData}
      variant="itemList"
    />
  );
}

ServiceAccountList.displayName = "ServiceAccountList";

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];
