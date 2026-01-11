import {
  faBars,
  faGamepad,
  faLongArrowLeft,
  faCaretRight,
  faCaretDown,
  faCog,
  faUsers,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MobileNavigation.css";
import "./Navigation.css";
import {
  Heading,
  Menu,
  Modal,
  NewButton,
  NewDropDown,
  NewDropDownDivider,
  NewDropDownItem,
  NewDropDownSub,
  NewAvatar,
  NewIcon,
  NewLink,
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm";
import { type CurrentUser } from "@thunderstore/dapper/types";

import {
  faSignOut,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import {
  buildAuthLoginUrl,
  buildLogoutUrl,
} from "cyberstorm/utils/ThunderstoreAuth";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

export function Navigation(props: {
  // hydrationCheck: boolean;
  currentUser?: CurrentUser;
  domain: string;
}) {
  const { currentUser, domain } = props;
  return (
    <>
      <header
        className="container container--x island-item navigation-header"
        aria-label="Header"
      >
        <nav className="navigation-header__global" aria-label="Main">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Index"
            rootClasses="navigation-header__logo"
            aria-label="Home"
            csVariant="cyber"
          >
            <NewIcon noWrapper>
              <ThunderstoreLogo />
            </NewIcon>
          </NewLink>
          <div className="navigation-header__main">
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
              rootClasses="navigation-header__developers-dropdown"
            >
              <NewDropDownItem>
                <NewLink
                  primitiveType="link"
                  rootClasses={"dropdown__item"}
                  href={`${domain}/api/docs/`}
                >
                  API Docs
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  rootClasses={"dropdown__item"}
                  primitiveType="cyberstormLink"
                  linkId="PackageFormatDocs"
                >
                  Package Format Docs
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="ManifestValidator"
                  rootClasses={"dropdown__item"}
                >
                  Manifest Validator
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem>
                <NewLink
                  rootClasses={"dropdown__item"}
                  primitiveType="cyberstormLink"
                  linkId="MarkdownPreview"
                >
                  Markdown Preview
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem rootClasses="navigation-header--focus">
                <NewLink
                  primitiveType="link"
                  rootClasses={classnames(
                    "navigation-header__externalLink",
                    "dropdown__item"
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
        <div className="navigation-header__user">
          <div id="nimbusBeta" suppressHydrationWarning />
          <div className="navigation-header__extra">
            <NewButton
              primitiveType="link"
              href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
              csSize="small"
              csVariant="accent"
              aria-label="Get Thunderstore Mod Manager App"
            >
              Get Manager
            </NewButton>
          </div>
          {currentUser?.username ? (
            <span className="navigation-header__profile-actions">
              <NewButton
                primitiveType="cyberstormLink"
                linkId="PackageUpload"
                csVariant="secondary"
                csSize="small"
                // csModifiers={["ghost", "only-icon"]}
                tooltipText="Upload"
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faUpload} />
                </NewIcon>
                Upload
              </NewButton>
            </span>
          ) : null}

          {currentUser ? (
            <DesktopUserDropdown user={currentUser} domain={domain} />
          ) : (
            <DesktopLoginPopover />
          )}
        </div>
      </header>

      <nav className="mobile-navigation">
        <button
          popoverTarget="mobileNavMenu"
          popoverTargetAction="show"
          className="mobile-navigation__item"
        >
          <NewIcon noWrapper>
            <FontAwesomeIcon icon={faBars} />
          </NewIcon>
          Menu
        </button>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses="mobile-navigation__item"
        >
          <NewIcon noWrapper>
            <FontAwesomeIcon icon={faGamepad} />
          </NewIcon>
          Browse
        </NewLink>
        <button
          popoverTarget="mobileNavAccount"
          popoverTargetAction="show"
          className="mobile-navigation__item"
        >
          <NewAvatar
            src={
              currentUser?.connections.find((c) => c.avatar !== null)?.avatar
            }
            username={currentUser ? currentUser.username : null}
            csSize="verySmoll"
          />
          Account
        </button>
      </nav>
    </>
  );
}

export function DesktopLoginPopover() {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
  ]);

  return (
    <Modal
      disableBody
      trigger={
        <NewButton
          csVariant="accent"
          csSize="small"
          popoverTarget="navAccount"
          popoverTargetAction="show"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </NewIcon>
          Log In
        </NewButton>
      }
      contentClasses="navigation-login__modal"
    >
      <div className="navigation-login">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="45"
          viewBox="0 0 50 45"
          fill="none"
          className="navigation-login__logo"
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
          rootClasses="navigation-login__title"
        >
          Log in to Thunderstore
        </Heading>
        <div className="navigation-login__links">
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "discord",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
            })}
            rootClasses="navigation-login__link navigation-login__discord"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDiscord} />
            </NewIcon>
            Connect with Discord
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "github",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
            })}
            rootClasses="navigation-login__link navigation-login__github"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faGithub} />
            </NewIcon>
            Connect with Github
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "overwolf",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
            })}
            rootClasses="navigation-login__link navigation-login__overwolf"
          >
            <NewIcon csMode="inline">
              <OverwolfLogo />
            </NewIcon>
            Connect with Overwolf
          </NewLink>
        </div>
        <p className="navigation-login__legal">
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

export function DesktopUserDropdown(props: {
  user: CurrentUser;
  domain: string;
}) {
  const { user, domain } = props;

  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  // REMIX TODO: Turn this into a popover
  return (
    <NewDropDown
      contentAlignment="end"
      trigger={
        <button className="navigation-header__user-button">
          <NewAvatar src={avatar} username={user.username} csSize="verySmoll" />
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretDown} />
          </NewIcon>
        </button>
      }
    >
      <NewDropDownItem
        rootClasses="navigation-header__avatar"
        onSelect={(event) => event.preventDefault()}
      >
        <div>
          <NewAvatar src={avatar} username={user.username} csSize="small" />
          <p className="navigation-header__dropdown-details">{user.username}</p>
        </div>
      </NewDropDownItem>
      <NewDropDownDivider />
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Settings"
          rootClasses="dropdown__item navigation-header__dropdown-item"
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
          Settings
        </NewLink>
      </NewDropDownItem>
      <NewDropDownSub
        trigger={
          <>
            <NewIcon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
            <NewIcon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faCaretRight} />
            </NewIcon>
          </>
        }
      >
        <NewDropDownItem asChild>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            rootClasses="dropdown__item navigation-header__dropdown-item"
          >
            All teams
          </NewLink>
        </NewDropDownItem>
        <NewDropDownDivider />
        {user.teams_full && user.teams_full.length > 0 ? (
          user.teams_full.map((team) => (
            <NewDropDownItem key={team.name} asChild>
              <NewLink
                primitiveType="link"
                href={`/c/all/p/${team.name}`}
                rootClasses="dropdown__item navigation-header__dropdown-item"
              >
                {team.name}
              </NewLink>
            </NewDropDownItem>
          ))
        ) : null}
      </NewDropDownSub>
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="link"
          href={buildLogoutUrl(domain)}
          rootClasses="dropdown__item navigation-header__dropdown-item"
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

export function MobileNavigationMenu({ domain }: { domain: string }) {
  return (
    <Menu popoverId={"mobileNavMenu"} rootClasses="mobile-navigation__menu">
      <nav className="mobile-navigation__popover">
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
        >
          Communities
        </NewLink>
        <Menu
          popoverId={"mobileNavMenuDevelopers"}
          trigger={
            <button
              popoverTarget="mobileNavMenuDevelopers"
              popoverTargetAction="show"
              className="mobile-navigation__popover-item mobile-navigation__popover--thick mobile-navigation__developers-button"
            >
              Developers
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCaretRight} />
              </NewIcon>
            </button>
          }
          controls={
            <NewButton
              popoverTarget="mobileNavMenuDevelopers"
              popoverTargetAction="hide"
              aria-label="Back to previous menu"
              csSize="medium"
              csVariant="secondary"
              csModifiers={["ghost", "only-icon"]}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faLongArrowLeft} />
              </NewIcon>
            </NewButton>
          }
        >
          <nav className="mobile-navigation__popover__popover">
            <NewLink
              primitiveType="link"
              href={`${domain}/api/docs/`}
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              API Docs
            </NewLink>
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io"
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              GitHub
            </NewLink>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PackageFormatDocs"
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              Package Format Docs
            </NewLink>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="MarkdownPreview"
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              Markdown Preview
            </NewLink>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="ManifestValidator"
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              Manifest Validator
            </NewLink>
          </nav>
        </Menu>
        <div className="mobile-navigation__divider" />
        <NewLink
          primitiveType="link"
          href="https://pages.thunderstore.io/p/contact-us"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thin"
        >
          Contact Us
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://pages.thunderstore.io/p/privacy-policy"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thin"
        >
          Privacy Policy
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://blog.thunderstore.io/"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thin"
        >
          News
        </NewLink>
      </nav>
      <div id="nimbusBetaMobile" suppressHydrationWarning />
    </Menu>
  );
}

export function MobileUserPopoverContent(props: {
  user?: CurrentUser;
  domain?: string;
}) {
  const { user, domain } = props;
  const avatar = user?.connections.find((c) => c.avatar !== null)?.avatar;
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
  ]);

  return (
    <Menu popoverId={"mobileNavAccount"} rootClasses="mobile-navigation__user">
      {user && user.username ? (
        <div className="mobile-navigation__popover">
          <div className="mobile-navigation__avatar">
            <NewAvatar src={avatar} username={user.username} csSize="small" />
            <p className="mobile-navigation__user-details">{user.username}</p>
          </div>
          <NewLink
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
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildLogoutUrl(domain)}
            rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faSignOut} />
            </NewIcon>
            Log Out
          </NewLink>
        </div>
      ) : (
        <div className="navigation-login">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="45"
            viewBox="0 0 50 45"
            fill="none"
            className="navigation-login__logo"
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
            csSize="3"
            rootClasses="navigation-login__title"
          >
            Log in to Thunderstore
          </Heading>
          <div className="navigation-login__links">
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({
                type: "discord",
                authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
                authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              })}
              rootClasses="navigation-login__link navigation-login__discord"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faDiscord} />
              </NewIcon>
              Connect with Discord
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({
                type: "github",
                authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
                authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              })}
              rootClasses="navigation-login__link navigation-login__github"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faGithub} />
              </NewIcon>
              Connect with Github
            </NewLink>
            <NewLink
              primitiveType="link"
              href={buildAuthLoginUrl({
                type: "overwolf",
                authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
                authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              })}
              rootClasses="navigation-login__link navigation-login__overwolf"
            >
              <NewIcon csMode="inline" noWrapper>
                <OverwolfLogo />
              </NewIcon>
              Connect with Overwolf
            </NewLink>
          </div>
          <p className="navigation-login__legal">
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
