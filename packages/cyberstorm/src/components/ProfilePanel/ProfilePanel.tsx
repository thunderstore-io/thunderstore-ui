import styles from "./ProfilePanel.module.css";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";
import { Title } from "../Title/Title";

export interface ProfileModsProps {
  name: string;
  version: string;
  url: string;
}

export interface ProfileProps {
  code: string;
  name: string;
  mods: ProfileModsProps[];
}

export interface ProfilePanelProps {
  profile: ProfileProps;
}

/**
 * Cyberstorm ProfilePanel component
 */
export function ProfilePanel(props: ProfilePanelProps) {
  const { profile } = props;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <ThunderstoreLogo />
          <Title size="smaller" text="Thunderstore" />
        </div>
        <div className={styles.profileTitle}>Profile: {profile.name}</div>
        <div className={styles.profileTitle}>Code: {profile.code}</div>
      </div>
      <div className={styles.content}>
        {profile.mods.map(function (mod, i) {
          return (
            <div key={String(i)} className={styles.modrow}>
              <div className={styles.modInfo}>
                <div className={styles.modName}>{mod.name}</div>
                <div className={styles.modVersion}>{mod.version}</div>
              </div>
              <a className={styles.modLink} href={mod.url}>
                <FontAwesomeIcon fixedWidth icon={faArrowUpRightFromSquare} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ProfilePanel.displayName = "ProfilePanel";
