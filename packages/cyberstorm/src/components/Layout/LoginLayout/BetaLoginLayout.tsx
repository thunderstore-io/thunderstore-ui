import styles from "./BetaLoginLayout.module.css";
import { Button } from "../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo, ThunderstoreLogo } from "../../../svg/svg";
import { PrivacyPolicyLink, TermsOfServiceLink } from "../../Links/Links";

/**
 * Cyberstorm Beta Login Layout
 */
export function BetaLoginLayout() {
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
            <div className={styles.loginButton}>
              <Button
                colorScheme="discord"
                label="Discord"
                leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.loginButton}>
              <Button
                colorScheme="github"
                label="GitHub"
                leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.loginButton}>
              <Button
                colorScheme="overwolf"
                label="Overwolf"
                leftIcon={<OverwolfLogo />}
                paddingSize="large"
              />
            </div>
          </div>
          <div className={styles.descriptor}>Or</div>
          <div className={styles.alternateAction}>
            Want early access? Thunderstore beta is currently available for
            Thunderstore Premium users only.
            <Button
              paddingSize="huge"
              colorScheme="primary"
              label="Go Premium"
            />
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
            <Button
              paddingSize="large"
              label="Go Premium"
              colorScheme="specialPurple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

BetaLoginLayout.displayName = "BetaLoginLayout";
