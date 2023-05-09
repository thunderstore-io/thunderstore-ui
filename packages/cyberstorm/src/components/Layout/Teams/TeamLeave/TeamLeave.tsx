import styles from "./TeamLeave.module.css";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { SettingItem } from "../../../SettingItem/SettingItem";

export interface TeamLeaveProps {
  teamName?: string;
}

export function TeamLeave(props: TeamLeaveProps) {
  const { teamName } = props;

  return (
    <div>
      <SettingItem
        title="Leave team"
        description="Leave your team"
        content={
          <div className={styles.content}>
            <p>{`You are about to leave the team ${teamName}`}</p>
            <p>
              If you are the owner of the team, you can only leave if the team
              has another owner assigned.
            </p>
            <div>
              <Button
                colorScheme="danger"
                label="Leave team"
                leftIcon={<FontAwesomeIcon icon={faSignOut} fixedWidth />}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

TeamLeave.displayName = "TeamLeave";
TeamLeave.defaultProps = { teamName: "" };
