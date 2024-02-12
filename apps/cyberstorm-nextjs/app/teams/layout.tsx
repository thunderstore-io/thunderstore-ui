"use client";
import "@thunderstore/cyberstorm-styles";
import rootStyles from "../RootLayout.module.css";
import React, { ReactNode, Suspense, useState } from "react";

import styles from "./TeamsLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { CreateTeamForm } from "@thunderstore/cyberstorm-forms";
import {
  BreadCrumbs,
  Button,
  Dialog,
  TeamsLink,
  SettingItem,
  PageHeader,
} from "@thunderstore/cyberstorm";
import { CommunityListSkeleton } from "../communities/@communityList/CommunityListSkeleton";

export default function TeamsLayout(props: { teamList: ReactNode }) {
  // TODO: Change to use NextJS slot modals
  // Remove "use client" aftewards
  // https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals
  const [dialogOpen, setOpenDialog] = useState(false);

  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
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
                <CreateTeamForm dialogOnChange={setOpenDialog} />
              </Dialog.Root>
            }
            content={
              <div className={styles.contentWrapper}>
                <Suspense fallback={<CommunityListSkeleton />}>
                  {props.teamList}
                </Suspense>
              </div>
            }
          />
        </main>
      </div>
    </section>
  );
}
