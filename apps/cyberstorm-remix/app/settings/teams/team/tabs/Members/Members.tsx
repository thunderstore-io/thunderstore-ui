import { TeamMemberList } from "./TeamMemberList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AddTeamMemberForm } from "@thunderstore/cyberstorm-forms";
import { SettingItem, Dialog, Button } from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { ApiError } from "@thunderstore/thunderstore-api";
import { getDapper } from "cyberstorm/dapper/sessionUtils";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    const dapper = await getDapper(true);
    const currentUser = await dapper.getCurrentUser();
    if (!currentUser.username) {
      throw new Response("Not logged in.", { status: 401 });
    }
    try {
      const dapper = await getDapper(true);
      return {
        teamName: params.namespaceId,
        members: await dapper.getTeamMembers(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

export function HydrateFallback() {
  return "Loading...";
}

export default function Page() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();

  const revalidator = useRevalidator();

  async function addTeamMemberRevalidate() {
    revalidator.revalidate();
  }

  return (
    <SettingItem
      title="Members"
      description="Your best buddies"
      additionalLeftColumnContent={
        <Dialog.Root
          title="Add Member"
          trigger={
            <Button.Root colorScheme="primary" paddingSize="large">
              <Button.ButtonLabel>Add Member</Button.ButtonLabel>
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faPlus} />
              </Button.ButtonIcon>
            </Button.Root>
          }
        >
          <AddTeamMemberForm
            updateTrigger={addTeamMemberRevalidate}
            teamName={teamName}
          />
        </Dialog.Root>
      }
      content={<TeamMemberList members={members} teamName={teamName} />}
    />
  );
}
