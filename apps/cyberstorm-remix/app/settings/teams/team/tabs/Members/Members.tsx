import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { Suspense } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";
import {
  FormSection,
  FormSections,
} from "~/commonComponents/FormSection/FormSection";

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
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={members}>
        {(resolvedMembers) => (
          <FormSections>
            <FormSection
              title="Members"
              description="Manage your team members"
              metaExtra={
                isOwner ? (
                  <MemberAddForm
                    teamName={teamName}
                    updateTrigger={teamMemberRevalidate}
                    config={outletContext.requestConfig}
                  />
                ) : undefined
              }
            >
              <MembersTable
                teamName={teamName}
                members={resolvedMembers}
                updateTrigger={teamMemberRevalidate}
                config={outletContext.requestConfig}
              />
            </FormSection>
          </FormSections>
        )}
      </Await>
    </Suspense>
  );
}
