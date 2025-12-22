import { type OutletContextShape } from "app/root";
import { useOutletContext } from "react-router";

import { Heading, NewTable } from "@thunderstore/cyberstorm";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { type TeamServiceAccount } from "@thunderstore/thunderstore-api";

import { ServiceAccountRemoveModal } from "./ServiceAccountRemoveModal";
import "./ServiceAccounts.css";

const serviceAccountColumns = [
  { value: "Nickname", disableSort: false },
  { value: "Last Used", disableSort: false },
  { value: "Actions", disableSort: true },
];

export function ServiceAccountsTable(props: {
  serviceAccounts: TeamServiceAccount[];
  teamName: string;
  serviceAccountRevalidate: () => Promise<void>;
}) {
  const { serviceAccounts, serviceAccountRevalidate, teamName } = props;
  const outletContext = useOutletContext() as OutletContextShape;

  const tableData = serviceAccounts.map((serviceAccount) => {
    return [
      {
        value: (
          <p className="team-service-accounts__nickname">
            {serviceAccount.name}
          </p>
        ),
        sortValue: serviceAccount.name,
      },
      {
        value: (
          <p className="team-service-accounts__last-used">
            {serviceAccount.last_used ?? "Never"}
          </p>
        ),
        sortValue: serviceAccount.last_used ?? "0",
      },
      {
        value: (
          <ServiceAccountRemoveModal
            key={serviceAccount.identifier}
            serviceAccount={serviceAccount}
            teamName={teamName}
            revalidate={serviceAccountRevalidate}
            outletContext={outletContext}
          />
        ),
        sortValue: 0,
      },
    ];
  });

  return (
    <NewTable
      titleRowContent={<Heading csLevel="3">Service Accounts</Heading>}
      headers={serviceAccountColumns}
      rows={tableData}
      sortByHeader={1}
      sortDirection={TableSort.ASC}
    />
  );
}

ServiceAccountsTable.displayName = "ServiceAccountsTable";
