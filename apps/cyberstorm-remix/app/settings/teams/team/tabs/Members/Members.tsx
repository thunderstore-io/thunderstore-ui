import { useLoaderData, useOutletContext, useRevalidator } from "react-router";

import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { MemberAddForm } from "./MemberAddForm";
import { MembersTable } from "./MembersTable";
import "./Members.css";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    members: await dapper.getTeamMembers(teamName),
  })
);

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Members() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const revalidator = useRevalidator();

  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Teams</p>
          <p className="settings-items__description">Manage your teams</p>
          <MemberAddForm
            teamName={teamName}
            updateTrigger={teamMemberRevalidate}
            config={outletContext.requestConfig}
          />
        </div>
        <div className="settings-items__content">
          <MembersTable
            teamName={teamName}
            members={members}
            updateTrigger={teamMemberRevalidate}
            config={outletContext.requestConfig}
          />
        </div>
      </div>
    </div>
  );
}
