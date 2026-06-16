import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faCaretDown,
  faCaretRight,
  faCog,
  faGamepad,
  faLongArrowLeft,
  faUpload,
  faUserShield,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faArrowRightToBracket,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import {
  faArrowUpRight,
  faCodeSimple,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import {
  buildAuthLoginUrl,
  buildLogoutUrl,
} from "cyberstorm/utils/ThunderstoreAuth";
import { type CSSProperties, useEffect } from "react";
import { useLocation } from "react-router";
import { Island } from "~/commonComponents/Island/Island";

import {
  Heading,
  Menu,
  Modal,
  NewAvatar,
  NewButton,
  NewDropDown,
  NewDropDownDivider,
  NewDropDownItem,
  NewDropDownSub,
  NewDropDownSubContent,
  NewDropDownSubTrigger,
  NewIcon,
  NewLink,
  OverwolfLogo,
  ThunderstoreLogo,
  classnames,
} from "@thunderstore/cyberstorm";
import { type CurrentUser } from "@thunderstore/dapper/types";

const NAVIGATION_POPOVER_ID = "mobileNavMenu";
const DEVELOPERS_POPOVER_ID = "mobileNavMenuDevelopers";

const hidePopoverById = (popoverId: string) => {
  const element = document.getElementById(popoverId) as
    | (HTMLElement & {
        togglePopover?: (force?: boolean) => boolean | undefined;
      })
    | null;
  element?.togglePopover?.(false);
};

const closeMobileNavigationMenus = () => {
  hidePopoverById(DEVELOPERS_POPOVER_ID);
  hidePopoverById(NAVIGATION_POPOVER_ID);
};

// Full-page switch to the legacy Django site, preserving the path. The React app
// is served from either the base domain (thunderstore.io) or the beta subdomain
// (new.thunderstore.io), so strip a leading new./old. before prepending old.;
// otherwise new.thunderstore.io would map to the nonexistent
// old.new.thunderstore.io.
// Nimbus adds package sub-routes (required, wiki, changelog, versions, source,
// dependants, v/<version>/...) that the legacy Django site doesn't have, so
// switching from one would land on a 404. Collapse any package path down to its
// detail page so the legacy switch always reaches a valid page (TS-3941).
function toLegacyPath(pathname: string): string {
  const packageDetail = pathname.match(/^(\/c\/[^/]+\/p\/[^/]+\/[^/]+\/)/);
  return packageDetail ? packageDetail[1] : pathname;
}

function switchToLegacySite() {
  if (typeof window === "undefined") return;
  const { protocol, hostname, pathname } = window.location;
  const baseHost = hostname.replace(/^(?:new|old)\./, "");
  window.location.assign(
    `${protocol}//old.${baseHost}${toLegacyPath(pathname)}`
  );
}

const legacySwitchStyle: CSSProperties = {
  display: "flex",
  height: "30px",
  padding: "0 12px",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  color: "#f5f5f6",
  fontFamily: "Inter",
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "normal",
  fill: "#49b5f7",
  background: "transparent",
};

// Rendered natively here rather than injected by beta-switch.js: feeding a
// foreign <button> into a React-owned container that re-renders on every
// navigation leaked event listeners. beta-switch.js now runs only on the legacy
// site (via its DynamicHTML entry), where there is no React.
function LegacySwitchButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      style={legacySwitchStyle}
      onClick={switchToLegacySite}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        style={{ fill: "inherit", height: "16px", width: "16px" }}
        aria-hidden="true"
      >
        <path d="M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z" />
      </svg>
      Switch to legacy
    </button>
  );
}

export function Navigation(props: {
  // hydrationCheck: boolean;
  currentUser?: CurrentUser;
  domain: string;
  communityId?: string;
}) {
  const { currentUser, domain, communityId } = props;
  const location = useLocation();

  const isExactCommunityPage =
    !!communityId &&
    [`/c/${communityId}`, `/c/${communityId}/`].includes(location.pathname);

  const logoLinkId =
    communityId && !isExactCommunityPage ? "Community" : "Communities";

  return (
    <>
      <Island as="header" rootClasses="navigation-header" aria-label="Header">
        <nav className="navigation-header__global" aria-label="Main">
          <div className="navigation-header__start">
            <NewButton
              popoverTarget={NAVIGATION_POPOVER_ID}
              popoverTargetAction="show"
              aria-label="Menu"
              csVariant="secondary"
              csModifiers={["ghost", "only-icon"]}
              rootClasses="navigation-header__mobile-menu"
            >
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faBars} />
              </NewIcon>
            </NewButton>
            <NewLink
              primitiveType="cyberstormLink"
              linkId={logoLinkId}
              community={communityId}
              rootClasses="navigation-header__logo"
              aria-label="Home"
              csVariant="cyber"
            >
              <NewIcon noWrapper>
                <ThunderstoreLogo />
              </NewIcon>
            </NewLink>
          </div>
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
              <NewDropDownItem rootClasses="navigation-header--focus">
                <NewLink
                  primitiveType="link"
                  rootClasses={classnames(
                    "navigation-header__externalLink",
                    "dropdown__item"
                  )}
                  href={`${domain}/api/docs/`}
                >
                  API Docs
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
                </NewLink>
              </NewDropDownItem>
              <NewDropDownItem rootClasses="navigation-header--focus">
                <NewLink
                  rootClasses={classnames(
                    "navigation-header__externalLink",
                    "dropdown__item"
                  )}
                  primitiveType="link"
                  href="https://wiki.thunderstore.io/mods/creating-a-package"
                >
                  Package Format Docs
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faArrowUpRight} />
                  </NewIcon>
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
          <LegacySwitchButton className="navigation-header__legacy-switch" />
          <div className="navigation-header__extra">
            <NewButton
              primitiveType="link"
              href="https://get.thunderstore.io/"
              csSize="small"
              csVariant="accent"
              aria-label="Get Thunderstore Mod Manager App"
            >
              Get Manager
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          </div>
          {currentUser?.username ? (
            <span className="navigation-header__profile-actions">
              <NewButton
                primitiveType="cyberstormLink"
                linkId="PackageUpload"
                csVariant="secondary"
                csSize="small"
                aria-label="Upload"
                tooltipText="Upload"
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faUpload} />
                </NewIcon>
                <span className="navigation-header__upload-text">Upload</span>
              </NewButton>
            </span>
          ) : null}

          {currentUser ? (
            <>
              <div className="navigation-header__user-desktop">
                <DesktopUserDropdown
                  user={currentUser}
                  domain={domain}
                  communityId={communityId}
                />
              </div>
              <div className="navigation-header__user-mobile">
                <MobileUserMenu
                  user={currentUser}
                  domain={domain}
                  communityId={communityId}
                />
              </div>
            </>
          ) : (
            <DesktopLoginPopover />
          )}
        </div>
      </Island>
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
            <NewIcon csMode="inline" wrapperClasses="navigation-login__icon">
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
            <NewIcon csMode="inline" wrapperClasses="navigation-login__icon">
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
            <NewIcon csMode="inline" wrapperClasses="navigation-login__icon">
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
            primitiveType="link"
            href="https://pages.thunderstore.io/p/privacy-policy"
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
  communityId?: string;
}) {
  const { user, domain, communityId } = props;

  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;
  const defaultTeam = user.teams[0];
  const profileContent = (
    <div>
      <NewAvatar src={avatar} username={user.username} csSize="small" />
      <p className="navigation-header__dropdown-details">{user.username}</p>
    </div>
  );

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
      {/* The profile entry opens your default (first) team, mirroring the
          legacy Django nav: its package listing in the current community, or
          the teams list when off-community or teamless (TS-3945). */}
      <NewDropDownItem asChild>
        {defaultTeam && communityId ? (
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            community={communityId}
            team={defaultTeam}
            rootClasses="navigation-header__avatar"
            title="View your default team"
          >
            {profileContent}
          </NewLink>
        ) : (
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            rootClasses="navigation-header__avatar"
            title="View your teams"
          >
            {profileContent}
          </NewLink>
        )}
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
      {communityId ? (
        <NewDropDownSub>
          <NewDropDownSubTrigger rootClasses="dropdown__item navigation-header__dropdown-item">
            <NewIcon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
          </NewDropDownSubTrigger>
          <NewDropDownSubContent>
            <NewDropDownItem asChild>
              <NewLink
                primitiveType="cyberstormLink"
                linkId="Teams"
                rootClasses="dropdown__item navigation-header__dropdown-item"
              >
                <NewIcon csMode="inline" noWrapper csVariant="tertiary">
                  <FontAwesomeIcon icon={faUsers} />
                </NewIcon>
                All Teams
              </NewLink>
            </NewDropDownItem>
            {user.teams.length > 0 ? <NewDropDownDivider /> : null}
            {user.teams.map((teamName) => (
              <NewDropDownItem key={teamName} asChild>
                <NewLink
                  primitiveType="link"
                  href={`/c/${communityId}/p/${teamName}/`}
                  rootClasses="dropdown__item navigation-header__dropdown-item"
                >
                  <NewIcon csMode="inline" noWrapper csVariant="tertiary">
                    <FontAwesomeIcon icon={faUsers} />
                  </NewIcon>
                  {teamName}
                </NewLink>
              </NewDropDownItem>
            ))}
          </NewDropDownSubContent>
        </NewDropDownSub>
      ) : (
        <NewDropDownItem asChild>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            rootClasses="dropdown__item navigation-header__dropdown-item"
          >
            <NewIcon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
          </NewLink>
        </NewDropDownItem>
      )}
      {/* Django admin, only for staff users — mirrors the legacy nav's
          {% if request.user.is_staff %} Admin link (TS-3952). */}
      {user.is_staff ? (
        <NewDropDownItem asChild>
          <NewLink
            primitiveType="link"
            href="/djangoadmin/"
            rootClasses="dropdown__item navigation-header__dropdown-item"
          >
            <NewIcon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faUserShield} />
            </NewIcon>
            Admin
          </NewLink>
        </NewDropDownItem>
      ) : null}
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="link"
          href={buildLogoutUrl()}
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

export function MobileUserMenu(props: {
  user: CurrentUser;
  domain: string;
  communityId?: string;
}) {
  const { user, domain, communityId } = props;
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;
  const defaultTeam = user.teams[0];

  return (
    <Menu
      csSide="right"
      popoverId="mobileNavAccount"
      trigger={
        <button
          className="navigation-header__user-button"
          popoverTarget="mobileNavAccount"
          popoverTargetAction="show"
        >
          <NewAvatar src={avatar} username={user.username} csSize="verySmoll" />
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretDown} />
          </NewIcon>
        </button>
      }
      controls={
        <div className="mobile-navigation__popover-controls">
          <NewButton
            popoverTarget="mobileNavAccount"
            popoverTargetAction="hide"
            aria-label="Close menu"
            csSize="medium"
            csVariant="secondary"
            csModifiers={["ghost", "only-icon"]}
            rootClasses="mobile-navigation__popover-close-button"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmark} />
            </NewIcon>
          </NewButton>
        </div>
      }
    >
      <nav className="mobile-navigation__popover" aria-label="Mobile user menu">
        {/* Opens your default (first) team, mirroring the legacy Django nav
            (TS-3945). */}
        <NewLink
          primitiveType="cyberstormLink"
          linkId={defaultTeam && communityId ? "Team" : "Teams"}
          community={defaultTeam && communityId ? communityId : undefined}
          team={defaultTeam && communityId ? defaultTeam : undefined}
          rootClasses="mobile-navigation__avatar"
          title={
            defaultTeam && communityId
              ? "View your default team"
              : "View your teams"
          }
        >
          <NewAvatar src={avatar} username={user.username} csSize="medium" />
          <div className="mobile-navigation__user-details">{user.username}</div>
        </NewLink>
        <div className="mobile-navigation__divider" />
        <section>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Settings"
            rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCog} />
            </NewIcon>
            Settings
          </NewLink>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            {communityId ? "All Teams" : "Teams"}
          </NewLink>
          {communityId &&
            user.teams.map((teamName) => (
              <NewLink
                key={teamName}
                primitiveType="link"
                href={`/c/${communityId}/p/${teamName}/`}
                rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thin"
                style={{ paddingLeft: "var(--space-32)" }}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faUsers} />
                </NewIcon>
                <span className="mobile-navigation__popover-text">
                  {teamName}
                </span>
              </NewLink>
            ))}
        </section>
        <div className="mobile-navigation__divider" />
        <section>
          {/* Django admin, staff only — mirrors the legacy nav (TS-3952). */}
          {user.is_staff ? (
            <NewLink
              primitiveType="link"
              href="/djangoadmin/"
              rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUserShield} />
              </NewIcon>
              Admin
            </NewLink>
          ) : null}
          <NewLink
            primitiveType="link"
            href={buildLogoutUrl()}
            rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faSignOut} />
            </NewIcon>
            Log Out
          </NewLink>
        </section>
      </nav>
    </Menu>
  );
}

function MobileDevelopersMenu({ domain }: { domain: string }) {
  return (
    <Menu
      popoverId={DEVELOPERS_POPOVER_ID}
      trigger={
        <button
          popoverTarget={DEVELOPERS_POPOVER_ID}
          popoverTargetAction="show"
          className="mobile-navigation__popover-item mobile-navigation__popover--thick mobile-navigation__developers-button"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCodeSimple} />
          </NewIcon>
          Developers
          <NewIcon style={{ marginLeft: "auto" }} csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretRight} />
          </NewIcon>
        </button>
      }
      controls={
        <div className="mobile-navigation__popover-controls">
          <NewButton
            popoverTarget={DEVELOPERS_POPOVER_ID}
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
          <NewButton
            onClick={closeMobileNavigationMenus}
            aria-label="Close menu"
            csSize="medium"
            csVariant="secondary"
            csModifiers={["ghost", "only-icon"]}
            rootClasses="mobile-navigation__popover-close-button"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmark} />
            </NewIcon>
          </NewButton>
        </div>
      }
    >
      <nav
        className="mobile-navigation__popover"
        aria-label="Mobile developer menu"
      >
        <NewLink
          primitiveType="link"
          href={`${domain}/api/docs/`}
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
        >
          API Docs
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </NewIcon>
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://github.com/thunderstore-io"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
        >
          GitHub
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </NewIcon>
        </NewLink>
        <NewLink
          primitiveType="link"
          href="https://wiki.thunderstore.io/mods/creating-a-package"
          rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
        >
          Package Format Docs
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </NewIcon>
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
  );
}

export function MobileNavigationMenu(props: {
  domain: string;
  currentUser?: CurrentUser;
}) {
  const { domain, currentUser } = props;
  const location = useLocation();

  useEffect(() => {
    // Close mobile nav on client-side route transitions.
    closeMobileNavigationMenus();
  }, [location.pathname, location.search, location.hash]);

  return (
    <Menu
      popoverId={NAVIGATION_POPOVER_ID}
      rootClasses="mobile-navigation__menu"
      controls={
        <div className="mobile-navigation__popover-controls">
          <NewButton
            onClick={closeMobileNavigationMenus}
            aria-label="Close menu"
            csSize="medium"
            csVariant="secondary"
            csModifiers={["ghost", "only-icon"]}
            rootClasses="mobile-navigation__popover-close-button"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmark} />
            </NewIcon>
          </NewButton>
        </div>
      }
    >
      <nav className="mobile-navigation__popover" aria-label="Mobile main menu">
        <section>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            rootClasses="mobile-navigation__popover-item mobile-navigation__popover--thick"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faGamepad} />
            </NewIcon>
            Communities
          </NewLink>
          <MobileDevelopersMenu domain={domain} />
        </section>
        <div className="mobile-navigation__divider" />
        <section>
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
        </section>
        <div className="mobile-navigation__divider" />
        <section>
          <LegacySwitchButton className="mobile-navigation__legacy-switch" />
        </section>
        <section>
          <NewButton
            primitiveType="link"
            href="https://get.thunderstore.io/"
            csSize="small"
            csVariant="accent"
            aria-label="Get Thunderstore Mod Manager App"
          >
            Get Manager
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowUpRight} />
            </NewIcon>
          </NewButton>
        </section>
        {currentUser?.username ? (
          <section>
            <NewButton
              primitiveType="cyberstormLink"
              linkId="PackageUpload"
              csVariant="secondary"
              csSize="small"
              tooltipText="Upload"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUpload} />
              </NewIcon>
              Upload
            </NewButton>
          </section>
        ) : null}
      </nav>
    </Menu>
  );
}
