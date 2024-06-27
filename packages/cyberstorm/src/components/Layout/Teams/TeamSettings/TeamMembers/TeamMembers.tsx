"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { TeamMemberList } from "./TeamMemberList";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { Dialog } from "../../../../..";
import { AddTeamMemberForm } from "@thunderstore/cyberstorm-forms";

interface Props {
  teamName: string;
}

export function TeamMembers(props: Props) {
  const { teamName } = props;

  const dapper = useDapper();
  const members = usePromise(dapper.getTeamMembers, [teamName]);

  return (
    <div>
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
            <AddTeamMemberForm teamName={teamName} />
          </Dialog.Root>
        }
        content={<TeamMemberList members={members} teamName={teamName} />}
      />
    </div>
  );
}

TeamMembers.displayName = "TeamMembers";
