import styles from "./BetaLoginLayout.module.css";
import * as Button from "../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo, ThunderstoreLogo } from "../../../svg/svg";
import { PrivacyPolicyLink, TermsOfServiceLink } from "../../Links/Links";
import { Icon } from "../../Icon/Icon";

interface Props {
  discordAuthUrl?: string;
  githubAuthUrl?: string;
  overwolfAuthUrl?: string;
}

/**
 * Cyberstorm Beta Login Layout
 */
export function BetaLoginLayout(props: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.login}>
        <div className={styles.backgroundGradient} />
        <div className={styles.loginForm}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>Early Access</div>
            Login to Thunderstore Beta
          </div>
          <div className={styles.loginButtons}>
            {props.discordAuthUrl ? (
              <div className={styles.loginButton}>
                <a href={props.discordAuthUrl}>
                  <Button.Root plain variant="discord" paddingSize="large">
                    <Button.ButtonIcon>
                      <Icon>
                        <FontAwesomeIcon icon={faDiscord} />
                      </Icon>
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>Discord</Button.ButtonLabel>
                  </Button.Root>
                </a>
              </div>
            ) : null}
            {props.githubAuthUrl ? (
              <div className={styles.loginButton}>
                <a href={props.githubAuthUrl}>
                  <Button.Root plain variant="github" paddingSize="large">
                    <Button.ButtonIcon>
                      <Icon>
                        <FontAwesomeIcon icon={faGithub} />
                      </Icon>
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>GitHub</Button.ButtonLabel>
                  </Button.Root>
                </a>
              </div>
            ) : null}
            {props.overwolfAuthUrl ? (
              <div className={styles.loginButton}>
                <a href={props.overwolfAuthUrl}>
                  <Button.Root plain variant="overwolf" paddingSize="large">
                    <Button.ButtonIcon>
                      <Icon>
                        <OverwolfLogo />
                      </Icon>
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>Overwolf</Button.ButtonLabel>
                  </Button.Root>
                </a>
              </div>
            ) : null}
          </div>
          <div className={styles.descriptor}>Or</div>
          <div className={styles.alternateAction}>
            Want early access? Thunderstore beta is currently available for
            Thunderstore Premium users only.
            <Button.Root paddingSize="large" variant="primary">
              <Button.ButtonLabel>Go Premium</Button.ButtonLabel>
            </Button.Root>
          </div>
          <a href="https://thunderstore.io" className={styles.mainPageLink}>
            Continue to thunderstore.io
          </a>
        </div>
        <div className={styles.legal}>
          By logging in and accessing the site you agree to{" "}
          <TermsOfServiceLink>
            <span className={styles.legalLink}>Terms and Conditions</span>
          </TermsOfServiceLink>{" "}
          and{" "}
          <PrivacyPolicyLink>
            <span className={styles.legalLink}>Privacy Policy</span>
          </PrivacyPolicyLink>
        </div>
      </div>
      <div className={styles.advertisementWrapper}>
        <img
          className={styles.advertisementBackground}
          src="/images/communitygrid.png"
          alt="community thumbnails displayed in a skewed grid"
        />
        <div className={styles.advertisement}>
          <div className={styles.advertisementLogo}>
            <ThunderstoreLogo />
          </div>
          <div className={styles.advertisementTitle}>
            <span>Thunderstore</span>
            <span className={styles.advertisementTitleRight}>Premium</span>
          </div>
          <div className={styles.advertisementInfo}>
            Get Thunderstore Premium and enjoy these magnificent benefits:
            <ul>
              <li>Ad-free experience</li>
              <li>Early access to new website beta</li>
              <li>Exclusive supporter badge</li>
              <li>Support Thunderstore development</li>
            </ul>
          </div>
          <div>
            <Button.Root paddingSize="large" variant="specialPurple">
              <Button.ButtonLabel>Go Premium</Button.ButtonLabel>
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

BetaLoginLayout.displayName = "BetaLoginLayout";
