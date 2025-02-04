import {
  faBars,
  faGamepad,
  faLongArrowLeft,
  faCaretRight,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MobileNavigation.css";
import "./Navigation.css";
import {
  Menu,
  NewLink,
  NewIcon,
  Avatar,
  Heading,
  NewButton,
  NewDropDown,
  NewDropDownItem,
  Modal,
  NewDropDownDivider,
  AvatarButton,
} from "@thunderstore/cyberstorm";
import {
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm/src/svg/svg";
import { CurrentUser } from "@thunderstore/dapper/types";

import {
  faSignOut,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";

export function Navigation(props: {
  hydrationCheck: boolean;
  currentUser?: CurrentUser;
}) {
  const { hydrationCheck, currentUser } = props;
  return (
    <>
      <header
        className="ts-container ts-container--x ts-section-item nimbus-commonComponents-navigation-header"
        aria-label="Header"
      >
        <nav className="__global" aria-label="Main">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Index"
            rootClasses="__logo"
            aria-label="Home"
            csVariant="cyber"
          >
            <NewIcon noWrapper>
              <ThunderstoreLogo />
            </NewIcon>
          </NewLink>
          <div className="__main">
            <NewButton
              primitiveType="cyberstormLink"
              linkId="Communities"
              csSize="big"
              csVariant="secondary"
              csModifiers={["ghost"]}
            >
              Communities
            </NewButton>
            <NewDropDown
              trigger={
                <NewButton
                  csSize="big"
                  csVariant="secondary"
                  csModifiers={["ghost"]}
                >
                  Developers
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faCaretDown} />
                  </NewIcon>
                </NewButton>
              }
              rootClasses="nimbus-commonComponents-navigation-header__developerDropdown"
            >
              <NewDropDownItem>
                <NewLink
                  primitiveType="link"
                  rootClasses={"ts-dropdown__item"}
                  href="/api/docs"
                >
                  API Docs
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  primitiveType="link"
                  rootClasses={"ts-dropdown__item"}
                  href="/package/create/docs/"
                >
                  Package Format Docs
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  primitiveType="link"
                  rootClasses={"ts-dropdown__item"}
                  href="/tools/manifest-v1-validator/"
                >
                  Manifest Validator
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  primitiveType="link"
                  rootClasses={"ts-dropdown__item"}
                  href="/tools/markdown-preview/"
                >
                  Markdown Preview
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem rootClasses="__focus">
                <NewLink
                  primitiveType="link"
                  rootClasses={classnames(
                    "__externalLink",
                    "ts-dropdown__item"
                  )}
                  href="https://github.com/thunderstore-io"
                >
                  Github
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
                </NewLink>
              </NewDropDownItem>
            </NewDropDown>
          </div>
        </nav>
        <div className="__user">
          <div className="__extra">
            <NewButton
              primitiveType="link"
              href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
              csSize="small"
              csVariant="secondary"
              aria-label="Get Thunderstore Mod Manager App"
            >
              Get Manager
            </NewButton>
          </div>
          {/* TODO: Add when upload page and notifs are a thing */}
          {/* <span className="__profile-actions">
            UPLOAD AND NOTIFS
          </span> */}
          {hydrationCheck && currentUser ? (
            <DesktopUserDropdown user={currentUser} />
          ) : (
            <DesktopLoginPopover />
          )}
        </div>
      </header>

      <nav className="nimbus-commonComponents-mobile-navigation">
        <button
          {...{
            popovertarget: "mobileNavMenu",
            popovertargetaction: "open",
          }}
          className="__item"
        >
          <NewIcon noWrapper>
            <FontAwesomeIcon icon={faBars} />
          </NewIcon>
          Menu
        </button>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses="__item"
        >
          <NewIcon noWrapper>
            <FontAwesomeIcon icon={faGamepad} />
          </NewIcon>
          Browse
        </NewLink>
        <button
          {...{
            popovertarget: "mobileNavAccount",
            popovertargetaction: "open",
          }}
          className="__item"
        >
          <Avatar
            src={
              currentUser?.connections.find((c) => c.avatar !== null)?.avatar
            }
            username={currentUser ? currentUser.username : null}
            size="verySmoll"
          />
          Account
        </button>
      </nav>
    </>
  );
}

export function DesktopLoginPopover() {
  return (
    <Modal
      popoverId={"navAccount"}
      trigger={
        <NewButton
          csVariant="accent"
          csSize="small"
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
      <div className="__login">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="45"
          viewBox="0 0 50 45"
          fill="none"
          className="__logo"
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
        <Heading mode="heading" csLevel="2" csSize="3" rootClasses="__tile">
          Log in to Thunderstore
        </Heading>
        <div className="__links">
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "discord" })}
            rootClasses="__link __discord"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDiscord} />
            </NewIcon>
            Connect with Discord
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "github" })}
            rootClasses="__link __github"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faGithub} />
            </NewIcon>
            Connect with Github
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({ type: "overwolf" })}
            rootClasses="__link __overwolf"
          >
            <NewIcon csMode="inline" noWrapper>
              <OverwolfLogo />
            </NewIcon>
            Connect with Overwolf
          </NewLink>
        </div>
        <p className="__legal">
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

export function DesktopUserDropdown(props: { user: CurrentUser }) {
  const { user } = props;

  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  // REMIX TODO: Turn this into a popover
  return (
    <NewDropDown
      contentAlignment="end"
      trigger={
        <AvatarButton src={avatar} username={user.username} size="small" />
      }
      rootClasses="nimbus-commonComponents-navigation-header__userDropdown"
    >
      <NewDropDownItem rootClasses="__avatar">
        <div>
          <Avatar src={avatar} username={user.username} size="small" />
          <p className="__details">{user.username}</p>
        </div>
      </NewDropDownItem>
      <NewDropDownDivider />
      {/* <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Settings"
          rootClasses="ts-dropdown__item __item"
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
          Settings
        </NewLink>
      </NewDropDownItem> */}
      {/* <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          rootClasses="ts-dropdown__item __item"
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faUsers} />
          </NewIcon>
          Teams
        </NewLink>
      </NewDropDownItem> */}
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="link"
          href="/logout"
          rootClasses="ts-dropdown__item __item"
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faSignOut} />
          </NewIcon>
          Log Out
        </NewLink>
      </NewDropDownItem>
    </NewDropDown>
  );
}

export function MobileNavigationMenu() {
  return (
    <Menu
      popoverId={"mobileNavMenu"}
      rootClasses="nimbus-commonComponents-mobile-navigation-menu"
    >
      <nav className="__popover">
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses="__item --thick"
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
              className="__item --thick __developersButton"
            >
              Developers
              <NewIcon csMode="inline" noWrapper>
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
              csSize="medium"
              csVariant="secondary"
              csModifiers={["ghost"]}
              icon={faLongArrowLeft}
            />
          }
        >
          <nav className="__popover">
            <NewLink
              primitiveType="link"
              href="/api/docs"
              rootClasses="__item --thick"
            >
              API Docs
            </NewLink>
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io"
              rootClasses="__item --thick"
            >
              GitHub
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/package/create/docs/"
              rootClasses="__item --thick"
            >
              Package Format Docs
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/tools/markdown-preview/"
              rootClasses="__item --thick"
            >
              Markdown Preview
            </NewLink>
            <NewLink
              primitiveType="link"
              href="/tools/manifest-v1-validator/"
              rootClasses="__item --thick"
            >
              Manifest Validator
            </NewLink>
          </nav>
        </Menu>
        <div className="__divider" />
        <NewLink
          primitiveType="link"
          href="https://pages.thunderstore.io/p/contact-us"
          rootClasses="__item --thin"
        >
          Contact Us
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://pages.thunderstore.io/p/privacy-policy"
          rootClasses="__item --thin"
        >
          Privacy Policy
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://blog.thunderstore.io/"
          rootClasses="__item --thin"
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
    <Menu
      popoverId={"mobileNavAccount"}
      rootClasses="nimbus-commonComponents-mobile-navigation-user"
    >
      {user && user.username ? (
        <div className="__popover">
          <div className="__avatar">
            <Avatar src={avatar} username={user.username} size="small" />
            <p className="__details">{user.username}</p>
          </div>
          {/* <NewLink
            primitiveType="cyberstormLink"
            linkId="Settings"
            csVariant="primary"
            rootClasses="__item --thick"
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
            rootClasses="__item --thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
          </NewLink> */}
          <NewLink
            primitiveType="link"
            href="/logout"
            rootClasses="__item --thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faSignOut} />
            </NewIcon>
            Log Out
          </NewLink>
        </div>
      ) : (
        <div className="__login">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="45"
            viewBox="0 0 50 45"
            fill="none"
            className="__logo"
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
          <Heading mode="heading" csLevel="2" csSize="3" rootClasses="__title">
            Log in to Thunderstore
          </Heading>
          <div className="__links">
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "discord" })}
              rootClasses="__link __discord"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faDiscord} />
              </NewIcon>
              Connect with Discord
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "github" })}
              rootClasses="__link __github"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faGithub} />
              </NewIcon>
              Connect with Github
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({ type: "overwolf" })}
              rootClasses="__link __overwolf"
            >
              <NewIcon csMode="inline" noWrapper>
                <OverwolfLogo />
              </NewIcon>
              Connect with Overwolf
            </NewLink>
          </div>
          <p className="__legal">
            By logging in and accessing the site you agree to{" "}
            <NewLink primitiveType="cyberstormLink" linkId="TermsOfService">
              Terms and Conditions
            </NewLink>{" "}
            and{" "}
            <NewLink primitiveType="cyberstormLink" linkId="PrivacyPolicy">
              Privacy Policy
            </NewLink>
          </p>
        </div>
      )}
    </Menu>
  );
}
