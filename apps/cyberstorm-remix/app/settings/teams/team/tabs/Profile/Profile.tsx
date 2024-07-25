import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { TeamDetailsEdit } from "@thunderstore/cyberstorm-forms";
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
        team: await dapper.getTeamDetails(params.namespaceId),
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

export default function Profile() {
  const { team } = useLoaderData<typeof loader | typeof clientLoader>();

  const revalidator = useRevalidator();

  async function teamProfileRevalidate() {
    revalidator.revalidate();
  }

  return <TeamDetailsEdit team={team} updateTrigger={teamProfileRevalidate} />;
}
