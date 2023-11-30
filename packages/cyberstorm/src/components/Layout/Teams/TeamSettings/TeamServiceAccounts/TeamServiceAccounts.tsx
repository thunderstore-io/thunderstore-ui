import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { Dialog } from "../../../../../index";
import { AddServiceAccountForm } from "@thunderstore/cyberstorm-forms";

interface Props {
  teamName: string;
}

export function TeamServiceAccounts(props: Props) {
  const { teamName } = props;

  const dapper = useDapper();
  const serviceAccounts = usePromise(dapper.getTeamServiceAccounts, [teamName]);

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
              <AddServiceAccountForm teamName={teamName} />
            </Dialog.Root>
          </div>
        }
        content={
          <div className={styles.content}>
            <ServiceAccountList serviceAccounts={serviceAccounts} />
          </div>
        }
      />
    </div>
  );
}

TeamServiceAccounts.displayName = "TeamServiceAccounts";
