import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { Suspense } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={members}>
        {(resolvedMembers) => (
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
                  members={resolvedMembers}
                  updateTrigger={teamMemberRevalidate}
                  config={outletContext.requestConfig}
                />
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
