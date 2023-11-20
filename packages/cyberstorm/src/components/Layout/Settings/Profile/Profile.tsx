import styles from "./Profile.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import * as Button from "../../../Button/";
import { Avatar } from "../../../Avatar/Avatar";
import { User } from "@thunderstore/dapper/types";
import { TextInput } from "../../../TextInput/TextInput";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

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
              <Avatar
                size="large"
                src={
                  userData.imageSource ? userData.imageSource : defaultImageSrc
                }
              />
              <div>
                <Button.Root>
                  <Button.ButtonLabel>Upload picture</Button.ButtonLabel>
                </Button.Root>
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
          content={<TextInput placeholder="This is an description" />}
        />
        <SettingItem
          title="Abut Me"
          description="A more comprehensive introduction of yourself shown in the About-tab on your user page"
          content={<TextInput placeholder="It's about me" />}
        />
        <div className={styles.save}>
          <Button.Root>
            <Button.ButtonLabel>Save changes</Button.ButtonLabel>
          </Button.Root>
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
