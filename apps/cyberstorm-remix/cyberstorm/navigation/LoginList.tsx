import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import { Icon } from "@thunderstore/cyberstorm";
import {
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm/src/svg/svg";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";

export function Loginlist() {
  return (
    <div className={styles.loginList}>
      <Icon wrapperClasses={styles.TSLoginLogo}>
        <ThunderstoreLogo />
      </Icon>
      <h1 className={styles.loginTitle}>Log in to Thunderstore</h1>
      <div className={styles.loginLinkList}>
        <a
          className={classnames(styles.loginLink, styles.loginLinkDiscord)}
          href={buildAuthLoginUrl({ type: "discord" })}
        >
          <Icon inline>
            <FontAwesomeIcon icon={faDiscord} />
          </Icon>
          Connect with Discord
        </a>
        <a
          className={classnames(styles.loginLink, styles.loginLinkGithub)}
          href={buildAuthLoginUrl({ type: "github" })}
        >
          <Icon inline>
            <FontAwesomeIcon icon={faGithub} />
          </Icon>
          Connect with Github
        </a>
        <a
          className={classnames(styles.loginLink, styles.loginLinkOverwolf)}
          href={buildAuthLoginUrl({ type: "overwolf" })}
        >
          <Icon inline noWrapper>
            <OverwolfLogo />
          </Icon>
          Connect with Overwolf
        </a>
      </div>
    </div>
  );
}
