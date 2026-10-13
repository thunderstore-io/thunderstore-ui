import {
  faCaretDown,
  faCog,
  faMagnifyingGlass,
  faUserShield,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { buildLogoutUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { useMemo, useState } from "react";

import {
  NewAvatar,
  NewDropDown,
  NewDropDownDivider,
  NewDropDownItem,
  NewDropDownSub,
  NewDropDownSubContent,
  NewDropDownSubTrigger,
  NewIcon,
  NewLink,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import { type CurrentUser } from "@thunderstore/dapper/types";

import { TEAMS_FILTER_THRESHOLD, filterTeams, sortTeams } from "./teams";

// The Teams submenu of the desktop user dropdown: alphabetised, height-capped
// with its own scrollbar, and — past TEAMS_FILTER_THRESHOLD — a lightweight
// client-side filter. Its own component so the filter state lives here.
function TeamsSubmenu(props: { teams: string[]; communityId: string }) {
  const { teams, communityId } = props;
  const [query, setQuery] = useState("");

  const sortedTeams = useMemo(() => sortTeams(teams), [teams]);
  const showFilter = sortedTeams.length > TEAMS_FILTER_THRESHOLD;
  const filteredTeams = useMemo(
    () => filterTeams(sortedTeams, query),
    [sortedTeams, query]
  );

  return (
    <NewDropDownSub>
      <NewDropDownSubTrigger rootClasses="dropdown__item navigation-header__dropdown-item">
        <NewIcon csMode="inline" noWrapper csVariant="tertiary">
          <FontAwesomeIcon icon={faUsers} />
        </NewIcon>
        Teams
      </NewDropDownSubTrigger>
      <NewDropDownSubContent rootClasses="navigation-header__teams-dropdown">
        {showFilter ? (
          // stopPropagation keeps Radix's menu typeahead + arrow navigation
          // from stealing keystrokes while the user types in the filter. The
          // wrapper is a passive event boundary, not a control — role
          // "presentation" says so, and keeps the static-interaction rule (and
          // the code scanner behind it) from reading it as a custom widget.
          <div
            role="presentation"
            className="navigation-header__teams-filter"
            onKeyDown={(event) => event.stopPropagation()}
          >
            <NewTextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              clearValue={query ? () => setQuery("") : undefined}
              placeholder="Filter teams..."
              aria-label="Filter teams"
              type="search"
              csSize="small"
              leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
          </div>
        ) : null}
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
        {filteredTeams.length > 0 ? <NewDropDownDivider /> : null}
        <div className="navigation-header__teams-list">
          {filteredTeams.map((teamName) => (
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
        </div>
      </NewDropDownSubContent>
    </NewDropDownSub>
  );
}

export function UserDropdown(props: {
  user: CurrentUser;
  domain: string;
  communityId?: string;
}) {
  const { user, communityId } = props;

  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  // REMIX TODO: Turn this into a popover
  return (
    <NewDropDown
      contentAlignment="end"
      rootClasses="navigation-header__user-dropdown"
      trigger={
        <button className="navigation-header__user-button">
          <NewAvatar src={avatar} username={user.username} csSize="verySmoll" />
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretDown} />
          </NewIcon>
        </button>
      }
    >
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="User"
          user={user.username ?? undefined}
          rootClasses="dropdown__item navigation-header__avatar"
        >
          <NewAvatar src={avatar} username={user.username} csSize="small" />
          <span className="navigation-header__dropdown-details">
            <span className="navigation-header__dropdown-name">
              {user.username}
            </span>
            <span className="navigation-header__dropdown-profile">
              My profile
            </span>
          </span>
        </NewLink>
      </NewDropDownItem>
      <NewDropDownDivider />
      {/* Django admin, only for staff users — mirrors the legacy nav's
          {% if request.user.is_staff %} Admin link (TS-3952). */}
      {user.is_staff ? (
        <>
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
          <NewDropDownDivider />
        </>
      ) : null}
      {communityId ? (
        <TeamsSubmenu teams={user.teams} communityId={communityId} />
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
      <NewDropDownDivider />
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
