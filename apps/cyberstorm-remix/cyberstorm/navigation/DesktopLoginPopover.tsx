import styles from "./Navigation.module.css";
import {
  Heading,
  Modal,
  NewButton,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverwolfLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

export function DesktopLoginPopover() {
  return (
    <Modal
      popoverId={"navAccount"}
      trigger={
        <NewButton
          csVariant="primary"
          csSize="big"
          rootClasses={styles.loginButton}
          {...{
            popovertarget: "navAccount",
            popovertargetaction: "open",
          }}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </NewIcon>
          Log In
        </NewButton>
      }
    >
      <div className={styles.loginList}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="45"
          viewBox="0 0 50 45"
          fill="none"
          className={styles.TSLoginLogo}
        >
          <path
            d="M0.710078 24.9394L9.78854 41.2481L14.6615 32.2309L10.0734 23.9981C9.52443 23.0474 9.52443 21.9529 10.0734 20.9973L16.2418 10.2767C16.7912 9.32224 17.734 8.77655 18.831 8.77697H22.1474L15.7292 23.2203H23.6593L12.8766 44.1116L34.5318 18.1671H27.8748L32.4178 8.77697H40.3769H45.006L49.96 0.167812H35.7761H26.3397H14.9641C13.1759 0.168228 11.6411 1.05689 10.7459 2.60758L0.710078 20.0561C-0.182994 21.6105 -0.18362 23.3929 0.710078 24.9394ZM17.1308 44.832H35.0372C36.8217 44.832 38.3601 43.9432 39.2578 42.3883L49.2938 24.9389C50.1816 23.3929 50.1816 21.6105 49.2938 20.0557L45.2805 13.0783H35.3738L39.93 20.9973C40.4744 21.9537 40.4744 23.048 39.9285 23.9985L33.7625 34.7217C33.2095 35.6776 32.2661 36.2225 31.1679 36.2225H26.6871L24.2827 36.1873L17.1308 44.832Z"
            fill="url(#paint0_linear_11481_128455)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_11481_128455"
              x1="28.2562"
              y1="44.832"
              x2="28.2562"
              y2="0.167812"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00B976" />
              <stop offset="0.796875" stopColor="#46FFBD" />
            </linearGradient>
          </defs>
        </svg>
        <Heading
          mode="heading"
          csLevel="2"
          csSize="3"
          rootClasses={styles.loginTitle}
        >
          Log in to Thunderstore
        </Heading>
        <div className={styles.loginLinkList}>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "discord" })}
            rootClasses={classnames(styles.loginLink, styles.loginLinkDiscord)}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDiscord} />
            </NewIcon>
            Connect with Discord
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "github" })}
            rootClasses={classnames(styles.loginLink, styles.loginLinkGithub)}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faGithub} />
            </NewIcon>
            Connect with Github
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "overwolf" })}
            rootClasses={classnames(styles.loginLink, styles.loginLinkOverwolf)}
          >
            <NewIcon csMode="inline" noWrapper>
              <OverwolfLogo />
            </NewIcon>
            Connect with Overwolf
          </NewLink>
        </div>
        <p className={styles.loginLegalText}>
          By logging in and accessing the site you agree to{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="TermsOfService"
            csVariant="primary"
          >
            Terms and Conditions
          </NewLink>{" "}
          and{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="PrivacyPolicy"
            csVariant="primary"
          >
            Privacy Policy
          </NewLink>
        </p>
      </div>
    </Modal>
  );
}
