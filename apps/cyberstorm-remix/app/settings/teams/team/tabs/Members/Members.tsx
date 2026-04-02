import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import { SuspenseIfPromise } from "~/commonComponents/SuspenseIfPromise/SuspenseIfPromise";

import { MemberAddForm } from "./MemberAddForm";
import "./Members.css";
import { MembersTable } from "./MembersTable";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    members: dapper.getTeamMembers(teamName),
  })
);

export default function Members() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const revalidator = useRevalidator();

  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  const isOwner = isTeamOwner(teamName, outletContext.currentUser);

  return (
    <SuspenseIfPromise resolve={members} fallback={<div>Loading...</div>}>
      {(resolvedMembers) => (
        <div className="settings-items">
          <div className="settings-items__item">
            <div className="settings-items__meta">
              <p className="settings-items__title">Teams</p>
              <p className="settings-items__description">Manage your teams</p>
              {isOwner && (
                <MemberAddForm
                  teamName={teamName}
                  updateTrigger={teamMemberRevalidate}
                  config={outletContext.requestConfig}
                />
              )}
            </div>
            <div className="settings-items__content">
              <MembersTable
                teamName={teamName}
                members={resolvedMembers}
                updateTrigger={teamMemberRevalidate}
                config={outletContext.requestConfig}
              />
            </div>
          </div>
        </div>
      )}
    </SuspenseIfPromise>
  );
}
