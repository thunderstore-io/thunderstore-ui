import { ServiceAccount } from "@thunderstore/dapper/types";
import * as Button from "../../../../../Button";
import { Table } from "../../../../../Table/Table";
import { Dialog } from "../../../../../../index";
import { RemoveServiceAccountForm } from "@thunderstore/cyberstorm-forms";
import { useState } from "react";

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];

interface Props {
  teamName: string;
  serviceAccounts: ServiceAccount[];
}

export function ServiceAccountList(props: Props) {
  const { serviceAccounts } = props;

  const tableData = serviceAccounts.map((serviceAccount, index) => {
    const [dialogOpen, setOpenDialog] = useState(false);

    return [
      { value: serviceAccount.name, sortValue: serviceAccount.name },
      {
        value: serviceAccount.last_used ?? "Never",
        sortValue: serviceAccount.last_used ?? "Never",
      },
      {
        value: (
          <Dialog.Root
            open={dialogOpen}
            onOpenChange={setOpenDialog}
            key={`${serviceAccount.name}_${index}`}
            title="Confirm service account removal"
            trigger={
              <Button.Root colorScheme="danger" paddingSize="large">
                <Button.ButtonLabel>Remove</Button.ButtonLabel>
              </Button.Root>
            }
          >
            <RemoveServiceAccountForm
              dialogOnChange={setOpenDialog}
              teamName={props.teamName}
              serviceAccountNickname={serviceAccount.name}
              serviceAccountIdentifier={serviceAccount.identifier}
            />
          </Dialog.Root>
        ),
        sortValue: 0,
      },
    ];
  });

  return <Table headers={serviceAccountColumns} rows={tableData} />;
}

ServiceAccountList.displayName = "ServiceAccountList";
