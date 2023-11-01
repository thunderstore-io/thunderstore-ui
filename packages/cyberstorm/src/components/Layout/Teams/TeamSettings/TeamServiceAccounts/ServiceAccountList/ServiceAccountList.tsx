import styles from "./ServiceAccountList.module.css";
import { ServiceAccount } from "@thunderstore/dapper/types";
import { Dialog } from "../../../../../Dialog/Dialog";
import * as Button from "../../../../../Button";
import { Table } from "../../../../../Table/Table";
import { Alert } from "../../../../../../index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/pro-solid-svg-icons";

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];

interface Props {
  serviceAccounts: ServiceAccount[];
}

export function ServiceAccountList(props: Props) {
  const { serviceAccounts } = props;

  const tableData = serviceAccounts.map((serviceAccount, index) => [
    { value: serviceAccount.name, sortValue: serviceAccount.name },
    {
      value: serviceAccount.last_used ?? "Never",
      sortValue: serviceAccount.last_used ?? "Never",
    },
    {
      value: (
        <Dialog
          key={`${serviceAccount.name}_${index}`}
          trigger={
            <Button.Root colorScheme="danger" paddingSize="large">
              <Button.ButtonLabel>Remove</Button.ButtonLabel>
            </Button.Root>
          }
          content={
            <div className={styles.content}>
              <Alert
                icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
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
            <Button.Root colorScheme="danger" paddingSize="large">
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

  return <Table headers={serviceAccountColumns} rows={tableData} />;
}

ServiceAccountList.displayName = "ServiceAccountList";
