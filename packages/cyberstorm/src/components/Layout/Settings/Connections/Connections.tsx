import styles from "./Connections.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { User } from "../../../../schema";
import { Link } from "../../../Link/Link";

export interface ConnectionsProps {
  userData: User;
}

export function Connections(props: ConnectionsProps) {
  const { userData } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Connections"
          additionalLeftColumnContent={<Link label="Privacy policy" />}
          description="This information will not be shared outside of Thunderstore. Read more on our Privacy policy:"
          content={
            <div>
              <div>{userData.gitHubLink}</div>
              <div>{userData.discordLink}</div>
            </div>
          }
        />
      </div>
    </div>
  );
}

Connections.displayName = "Connections";
