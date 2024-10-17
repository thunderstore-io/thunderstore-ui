import {
  faBars,
  faGamepad,
  faLongArrowLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import {
  Menu,
  LinkButton,
  NewLink,
  NewIcon,
  Avatar,
  NewText,
  Heading,
  NewButton,
} from "@thunderstore/cyberstorm";
import {
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm/src/svg/svg";
import { DevelopersDropDown } from "./DevelopersDropDown";
// Disabled until we have "rated_packages_cyberstorm" available in the currentUser django endpoint
// import { DesktopUserDropdown } from "./DesktopUserDropdown";
// import { DesktopLoginPopover } from "./DesktopLoginPopover";
import { CurrentUser } from "@thunderstore/dapper/types";

import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";

export function Navigation(props: {
  hydrationCheck: boolean;
  currentUser?: CurrentUser;
}) {
  // Disabled until we have "rated_packages_cyberstorm" available in the currentUser django endpoint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hydrationCheck, currentUser } = props;
  return (
    <>
      <header className={styles.desktopNavRoot} aria-label="Header">
        <nav className={styles.item} aria-label="Main">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Index"
            rootClasses={styles.logoWrapper}
            csVariant="default"
            csColor="cyber-green"
            aria-label="Home"
          >
            <NewIcon noWrapper>
              <ThunderstoreLogo />
            </NewIcon>
          </NewLink>
          <LinkButton
            primitiveType="cyberstormLink"
            linkId="Communities"
            csSize="l"
            csColor="surface-alpha"
            csVariant="tertiary"
          >
            Communities
          </LinkButton>
          <DevelopersDropDown />
        </nav>
        <div className={styles.headerRightSide}>
          <LinkButton
            primitiveType="link"
            href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
            csSize="s"
            csColor="cyber-green"
            csVariant="accent"
            rootClasses={styles.getAppButton}
            aria-label="Get Thunderstore Mod Manager App"
          >
            Get App
          </LinkButton>
          {/* Disabled until we have "rated_packages_cyberstorm" available in the currentUser django endpoint */}
          {/* {hydrationCheck && currentUser ? (
            <DesktopUserDropdown user={currentUser} />
          ) : (
            <DesktopLoginPopover />
          )} */}
        </div>
      </header>

      <nav className={styles.mobileNavRoot}>
        <button
          {...{
            popovertarget: "mobileNavMenu",
            popovertargetaction: "open",
          }}
          className={styles.mobileNavItem}
        >
          <NewIcon noWrapper rootClasses={styles.mobileNavItemIcon}>
            <FontAwesomeIcon icon={faBars} />
          </NewIcon>
          Menu
        </button>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses={styles.mobileNavItem}
        >
          <NewIcon rootClasses={styles.mobileNavItemIcon} noWrapper>
            <FontAwesomeIcon icon={faGamepad} />
          </NewIcon>
          Browse
        </NewLink>
        {/* Disabled until we have "rated_packages_cyberstorm" available in the currentUser django endpoint */}
        {/* <button
          {...{
            popovertarget: "mobileNavAccount",
            popovertargetaction: "open",
          }}
          className={styles.mobileNavItem}
        >
          <Avatar
            src={
              currentUser?.connections.find((c) => c.avatar !== null)?.avatar
            }
            username={currentUser ? currentUser.username : null}
            size="verySmoll"
          />
          Account
        </button> */}
      </nav>
    </>
  );
}

export function MobileNavigationMenu() {
  return (
    <Menu popoverId={"mobileNavMenu"} rootClasses={styles.mobileMenu}>
      <nav className={styles.mobileNavPopover}>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses={styles.navMenuItem}
          csVariant="primary"
          csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
        >
          Communities
        </NewLink>
        <Menu
          popoverId={"mobileNavMenuDevelopers"}
          trigger={
            <button
              {...{
                popovertarget: "mobileNavMenuDevelopers",
                popovertargetaction: "open",
              }}
              className={classnames(
                "fontSizeM",
                "fontWeightBold",
                "lineHeightAuto",
                styles.navMenuItem,
                styles.mobileNavMenuDevelopersButton
              )}
            >
              Developers
              <NewIcon
                csMode="inline"
                csVariant="tertiary"
                wrapperClasses={styles.mobileNavMenuDevelopersButtonIcon}
              >
                <FontAwesomeIcon icon={faCaretRight} />
              </NewIcon>
            </button>
          }
          controls={
            <NewButton
              {...{
                popovertarget: "mobileNavMenuDevelopers",
                popovertargetaction: "close",
              }}
              aria-label="Back to previous menu"
              csSize="m"
              csVariant="tertiaryDimmed"
              icon={faLongArrowLeft}
            />
          }
        >
          <nav className={styles.mobileNavPopover}>
            <NewLink
              primitiveType="link"
              href="/api/docs"
              csVariant="primary"
              csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
              rootClasses={styles.navMenuItem}
            >
              API Docs
            </NewLink>
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io"
              csVariant="primary"
              csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
              rootClasses={styles.navMenuItem}
            >
              GitHub
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/package/create/docs/"
              csVariant="primary"
              csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
              rootClasses={styles.navMenuItem}
            >
              Package Format Docs
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/tools/markdown-preview/"
              csVariant="primary"
              csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
              rootClasses={styles.navMenuItem}
            >
              Markdown Preview
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/tools/manifest-v1-validator/"
              csVariant="primary"
              csTextStyles={["fontSizeM", "fontWeightBold", "lineHeightAuto"]}
              rootClasses={styles.navMenuItem}
            >
              Manifest Validator
            </NewLink>
          </nav>
        </Menu>
        <div className={styles.divider} />
        <NewLink
          primitiveType="link"
          csVariant="primary"
          href="https://pages.thunderstore.io/p/contact-us"
          csTextStyles={["fontSizeS", "fontWeightRegular", "lineHeightAuto"]}
          rootClasses={styles.navMenuItem}
        >
          Contact Us
        </NewLink>
        <NewLink
          primitiveType="link"
          csVariant="primary"
          href="https://pages.thunderstore.io/p/privacy-policy"
          csTextStyles={["fontSizeS", "fontWeightRegular", "lineHeightAuto"]}
          rootClasses={styles.navMenuItem}
        >
          Privacy Policy
        </NewLink>
        <NewLink
          primitiveType="link"
          csVariant="primary"
          href="https://blog.thunderstore.io/"
          csTextStyles={["fontSizeS", "fontWeightRegular", "lineHeightAuto"]}
          rootClasses={styles.navMenuItem}
        >
          News
        </NewLink>
      </nav>
    </Menu>
  );
}

export function MobileUserPopoverContent(props: { user?: CurrentUser }) {
  const { user } = props;
  const avatar = user?.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <Menu popoverId={"mobileNavAccount"}>
      {user && user.username ? (
        <div className={styles.mobileNavPopover}>
          <div className={styles.accountPopoverUser}>
            <Avatar src={avatar} username={user.username} size="small" />
            <NewText
              rootClasses={styles.dropdownUserInfoDetails}
              csTextStyles={["fontSizeM", "fontWeightBold"]}
            >
              {user.username}
            </NewText>
          </div>
          {/* <NewLink
            primitiveType="cyberstormLink"
            linkId="Settings"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
            csTextStyles={["fontSizeM", "fontWeightRegular", "lineHeightAuto"]}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCog} />
            </NewIcon>
            Settings
          </NewLink>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
            csTextStyles={["fontSizeM", "fontWeightRegular", "lineHeightAuto"]}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
          </NewLink> */}
          <NewLink
            primitiveType="link"
            href="/logout"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
            csTextStyles={["fontSizeM", "fontWeightRegular", "lineHeightAuto"]}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faSignOut} />
            </NewIcon>
            Log Out
          </NewLink>
        </div>
      ) : (
        <div className={styles.loginListMobile}>
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
              fill="url(#paint0_linear_11481_128456)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_11481_128456"
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
            csStyleLevel="3"
            rootClasses={styles.loginTitle}
          >
            Log in to Thunderstore
          </Heading>
          <div className={styles.loginLinkList}>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "discord" })}
              rootClasses={classnames(
                styles.loginLinkMobile,
                styles.loginLinkDiscord
              )}
              csTextStyles={["fontSizeS", "fontWeightBold"]}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faDiscord} />
              </NewIcon>
              Connect with Discord
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "github" })}
              rootClasses={classnames(
                styles.loginLinkMobile,
                styles.loginLinkGithub
              )}
              csTextStyles={["fontSizeS", "fontWeightBold"]}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faGithub} />
              </NewIcon>
              Connect with Github
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "overwolf" })}
              rootClasses={classnames(
                styles.loginLinkMobile,
                styles.loginLinkOverwolf
              )}
              csTextStyles={["fontSizeS", "fontWeightBold"]}
            >
              <NewIcon csMode="inline" noWrapper>
                <OverwolfLogo />
              </NewIcon>
              Connect with Overwolf
            </NewLink>
          </div>
          <NewText
            rootClasses={styles.loginLegalText}
            csTextStyles={["lineHeightBody", "fontSizeXS", "fontWeightRegular"]}
          >
            By logging in and accessing the site you agree to{" "}
            <NewLink
              primitiveType="cyberstormLink"
              linkId="TermsOfService"
              csVariant="tertiary"
            >
              Terms and Conditions
            </NewLink>{" "}
            and{" "}
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PrivacyPolicy"
              csVariant="tertiary"
            >
              Privacy Policy
            </NewLink>
          </NewText>
        </div>
      )}
    </Menu>
  );
}
