import { SettingItem, Dialog, Button } from "@thunderstore/cyberstorm";
import { AddServiceAccountForm } from "@thunderstore/cyberstorm-forms";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
        serviceAccounts: await dapper.getTeamServiceAccounts(
          params.namespaceId
        ),
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

export default function ServiceAccounts() {
  const { teamName, serviceAccounts } = useLoaderData<typeof clientLoader>();

  const revalidator = useRevalidator();

  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  async function addServiceAccountRevalidate() {
    revalidator.revalidate();
  }

  return (
    <div>
      <SettingItem
        title="Service accounts"
        description="Your loyal servants"
        additionalLeftColumnContent={
          <div>
            <Dialog.Root
              title="Add Service Account"
              trigger={
                <Button.Root paddingSize="large" colorScheme="primary">
                  <Button.ButtonLabel>Add Service Account</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <AddServiceAccountForm
                teamName={teamName}
                updateTrigger={addServiceAccountRevalidate}
              />
            </Dialog.Root>
          </div>
        }
        content={
          <ServiceAccountList
            serviceAccounts={serviceAccounts}
            teamName={teamName}
            updateTrigger={addServiceAccountRevalidate}
          />
        }
      />
    </div>
  );
}
