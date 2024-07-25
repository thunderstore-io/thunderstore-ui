import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import {
  BreadCrumbs,
  Button,
  CyberstormLink,
  Dialog,
  SettingItem,
  Table,
} from "@thunderstore/cyberstorm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./TeamsLayout.module.css";
import rootStyles from "../../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { CreateTeamForm } from "@thunderstore/cyberstorm-forms";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  return [
    { title: `Teams of ${data?.currentUser.username}` },
    { name: "description", content: `Teams of ${data?.currentUser.username}` },
  ];
};

export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  if (!currentUser.username) {
    throw new Response("Not logged in.", { status: 401 });
  } else {
    return {
      currentUser: currentUser as typeof currentUserSchema._type,
    };
  }
}

export function HydrateFallback() {
  return "Loading...";
}

export default function Teams() {
  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  const { currentUser } = useLoaderData<typeof clientLoader>();
  const [dialogOpen, setOpenDialog] = useState(false);
  const revalidator = useRevalidator();
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    setIsRefetching(false);
  }, [currentUser]);

  async function createTeamRevalidate() {
    if (!isRefetching) {
      setIsRefetching(true);
      revalidator.revalidate();
    }
  }

  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Teams">Teams</CyberstormLink>
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <PageHeader title="Teams" />
      </header>
      <main className={rootStyles.main}>
        <SettingItem
          title="Teams"
          description="Manage your teams"
          additionalLeftColumnContent={
            <Dialog.Root
              open={dialogOpen}
              onOpenChange={setOpenDialog}
              title="Create Team"
              trigger={
                <Button.Root colorScheme="primary" paddingSize="large">
                  <Button.ButtonLabel>Create team</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <CreateTeamForm
                dialogOnChange={setOpenDialog}
                updateTrigger={createTeamRevalidate}
              />
            </Dialog.Root>
          }
          content={
            <div className={styles.contentWrapper}>
              <Table
                headers={[
                  { value: "Team Name", disableSort: false },
                  { value: "Role", disableSort: false },
                  { value: "Members", disableSort: false },
                ]}
                rows={currentUser.teams.map((team) => [
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
            </div>
          }
        />
      </main>
    </>
  );
}
