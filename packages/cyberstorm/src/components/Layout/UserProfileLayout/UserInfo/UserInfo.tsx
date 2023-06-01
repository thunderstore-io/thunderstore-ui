import styles from "./UserInfo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../../Button/Button";
import { Title } from "../../../Title/Title";
import { User } from "../../../../schema";
import {
  faDiscord,
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Avatar } from "../../../Avatar/Avatar";
import { Link } from "../../../Link/Link";

export interface UserInfoProps {
  userData: User;
}

/**
 * Cyberstorm UserInfo
 */
export function UserInfo(props: UserInfoProps) {
  const { userData } = props;
  return (
    <div className={styles.root}>
      <Avatar size="large" src={userData.imageSource} />
      <div className={styles.info}>
        <Title text={userData.name} />
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{userData.description}</p>
          <Button
            label="Show more"
            colorScheme="transparentDefault"
            size="small"
          />
        </div>
        <div className={styles.meta}>
          {userData.gitHubLink ? (
            <Link
              externalUrl={userData.gitHubLink}
              leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
              label="GitHub"
            />
          ) : null}
          {userData.twitterLink ? (
            <Link
              externalUrl={userData.twitterLink}
              leftIcon={<FontAwesomeIcon icon={faTwitter} fixedWidth />}
              label="Twitter"
            />
          ) : null}
          {userData.discordLink ? (
            <Link
              externalUrl={userData.discordLink}
              leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
              label="Discord"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

UserInfo.displayName = "UserInfo";
