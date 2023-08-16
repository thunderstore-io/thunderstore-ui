import styles from "./LoginLayout.module.css";
import { ThunderstoreLogoHorizontal } from "../../../svg/svg";
import { PrivacyPolicyLink, TermsOfServiceLink } from "../../Links/Links";
import { LoginForm } from "./LoginForm/LoginForm";

/**
 * Cyberstorm Login Layout
 */
export function LoginLayout() {
  return (
    <div className={styles.root}>
      <div className={styles.login}>
        <div className={styles.backgroundGradient} />
        <LoginForm />
      </div>
      <div className={styles.graphicsWrapper}>
        <div className={styles.graphics}>
          <div className={styles.logo}>
            <ThunderstoreLogoHorizontal />
          </div>
          <img
            className={styles.graphicsImage}
            src="/images/login_hexagon.png"
          />
          <div className={styles.legal}>
            By logging in and accessing the site I agree to{" "}
            <span className={styles.legalLink}>
              <TermsOfServiceLink>Terms and Conditions</TermsOfServiceLink>
            </span>{" "}
            and{" "}
            <span className={styles.legalLink}>
              <PrivacyPolicyLink>Privacy Policy</PrivacyPolicyLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginLayout.displayName = "LoginLayout";
