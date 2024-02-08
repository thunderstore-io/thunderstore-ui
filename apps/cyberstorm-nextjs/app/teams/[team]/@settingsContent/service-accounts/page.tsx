"use client";
import { SettingItem, Dialog, Button } from "@thunderstore/cyberstorm";
import { AddServiceAccountForm } from "@thunderstore/cyberstorm-forms";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

export default function Page(props: { params: { team: string } }) {
  const dapper = useDapper();
  const serviceAccounts = usePromise(dapper.getTeamServiceAccounts, [
    props.params.team,
  ]);

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
              <AddServiceAccountForm teamName={props.params.team} />
            </Dialog.Root>
          </div>
        }
        content={
          <ServiceAccountList
            serviceAccounts={serviceAccounts}
            teamName={props.params.team}
          />
        }
      />
    </div>
  );
}
