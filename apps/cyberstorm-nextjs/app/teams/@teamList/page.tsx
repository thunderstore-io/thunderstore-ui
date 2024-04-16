"use client";
import styles from "./TeamList.module.css";
import { Table, CyberstormLink } from "@thunderstore/cyberstorm";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

export default function Page() {
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
            <CyberstormLink
              linkId="TeamSettings"
              key={team.name}
              team={team.name}
            >
              <span className={styles.nameColumn}>{team.name}</span>
            </CyberstormLink>
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
