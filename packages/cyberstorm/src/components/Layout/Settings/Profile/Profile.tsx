import styles from "./Profile.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Button } from "../../../Button/Button";
import { Avatar } from "../../../Avatar/Avatar";
import { User } from "../../../../schema";
import { TextInput } from "../../../TextInput/TextInput";

export interface ProfileProps {
  userData: User;
}

export function Profile(props: ProfileProps) {
  const { userData } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Profile Picture"
          description="Instructions for uploading a picture"
          content={
            <div className={styles.avatarContent}>
              <Avatar size="large" src={userData.imageSource} />
              <div>
                <Button label="Upload picture" />
              </div>
            </div>
          }
        />
      </div>
      <div className={styles.line} />

      <div className={styles.section}>
        <SettingItem
          title="Profile Summary"
          description="A short introduction of a max of 160 characters"
          content={<TextInput placeHolder={userData.description} />}
        />
        <SettingItem
          title="Abut Me"
          description="A more comprehensive introduction of yourself shown in the About-tab on your user page"
          content={<TextInput placeHolder={userData.about} />}
        />
        <div className={styles.save}>
          <Button label="Save changes" />
        </div>
      </div>

      <div className={styles.line} />

      <div className={styles.section}>
        <SettingItem title="Social Links" content="Social links" />
      </div>
    </div>
  );
}

Profile.displayName = "Profile";
Profile.defaultProps = {};
