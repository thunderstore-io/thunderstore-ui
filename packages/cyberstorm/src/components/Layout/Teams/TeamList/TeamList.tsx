"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./TeamList.module.css";
import { Table } from "../../../Table/Table";
import { TeamSettingsLink } from "../../../Links/Links";

export function TeamList() {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);

  return (
    <Table
      headers={[
        { value: "Team Name", disableSort: false },
        { value: "Role", disableSort: false },
        { value: "Members", disableSort: false },
      ]}
      rows={user.teams.map((team) => [
        {
          value: (
            <TeamSettingsLink key={team.name} team={team.name}>
              <span className={styles.nameColumn}>{team.name}</span>
            </TeamSettingsLink>
          ),
          sortValue: team.name,
        },
        {
          value: team.role,
          sortValue: team.role,
        },
        {
          value: team.member_count,
          sortValue: team.member_count,
        },
      ])}
      variant="itemList"
    />
  );
}

TeamList.displayName = "TeamList";
