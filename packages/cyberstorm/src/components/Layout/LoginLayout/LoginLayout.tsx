import styles from "./LoginLayout.module.css";
import { ThunderstoreLogoHorizontal } from "../../../svg/svg";
import { CyberstormLink } from "../../Links/Links";
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
            src="/cyberstorm-static/images/login_hexagon.png"
            alt="A cyberstorm-styled cube with hexagonal backdrop"
          />
          <div className={styles.legal}>
            By logging in and accessing the site I agree to{" "}
            <span className={styles.legalLink}>
              <CyberstormLink linkId="TermsOfService">
                Terms and Conditions
              </CyberstormLink>
            </span>{" "}
            and{" "}
            <span className={styles.legalLink}>
              <CyberstormLink linkId="PrivacyPolicy">
                Privacy Policy
              </CyberstormLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginLayout.displayName = "LoginLayout";
