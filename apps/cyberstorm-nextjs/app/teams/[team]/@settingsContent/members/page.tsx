"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { TeamMemberList } from "./TeamMemberList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { AddTeamMemberForm } from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import { SettingItem, Dialog, Button } from "@thunderstore/cyberstorm";

export default function Page(props: { params: { team: string } }) {
  const dapper = useDapper();
  const members = usePromise(dapper.getTeamMembers, [props.params.team]);
  const [dialogOpen, setOpenDialog] = useState(false);

  return (
    <SettingItem
      title="Members"
      description="Your best buddies"
      additionalLeftColumnContent={
        <Dialog.Root
          open={dialogOpen}
          onOpenChange={setOpenDialog}
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
            dialogOnChange={setOpenDialog}
            teamName={props.params.team}
          />
        </Dialog.Root>
      }
      content={
        <TeamMemberList members={members} teamName={props.params.team} />
      }
    />
  );
}
