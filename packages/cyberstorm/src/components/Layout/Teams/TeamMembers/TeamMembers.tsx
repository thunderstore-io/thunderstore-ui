import React from "react";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserDataItem, UserList } from "./UserList/UserList";
import { Button } from "../../../Button/Button";

export interface TeamMembersProps {
  userData?: Array<UserDataItem>;
}

export const TeamMembers: React.FC<TeamMembersProps> = (props) => {
  const { userData } = props;

  return (
    <div>
      <SettingItem
        title="Members"
        description="Your best buddies"
        additionalLeftColumnContent={
          <div>
            <Button label="Add Member" />
          </div>
        }
        content={<UserList userData={userData} />}
      />
    </div>
  );
};

TeamMembers.displayName = "TeamMembers";
TeamMembers.defaultProps = { userData: [] };
