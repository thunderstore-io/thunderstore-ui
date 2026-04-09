import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type OutletContextShape } from "app/root";
import { useOutletContext } from "react-router";

import {
  EmptyState,
  Heading,
  NewTable,
  NewTableSort,
} from "@thunderstore/cyberstorm";
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

  return tableData.length === 0 ? (
    <EmptyState.Root>
      <EmptyState.Icon>
        <FontAwesomeIcon icon={faPeopleGroup} />
      </EmptyState.Icon>
      <EmptyState.Title>No service accounts</EmptyState.Title>
      <EmptyState.Message>
        This team does not have any service accounts yet.
      </EmptyState.Message>
    </EmptyState.Root>
  ) : (
    <NewTable
      titleRowContent={<Heading csLevel="3">Service Accounts</Heading>}
      headers={serviceAccountColumns}
      rows={tableData}
      sortByHeader={1}
      sortDirection={NewTableSort.ASC}
    />
  );
}

ServiceAccountsTable.displayName = "ServiceAccountsTable";
