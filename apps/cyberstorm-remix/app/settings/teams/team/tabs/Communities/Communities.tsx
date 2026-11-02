import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import {
  FormSection,
  FormSections,
} from "~/commonComponents/FormSection/FormSection";

import {
  EmptyState,
  Heading,
  Image,
  NewLink,
  NewTable,
  NewTableSort,
  formatInteger,
} from "@thunderstore/cyberstorm";
import { type TeamCommunity } from "@thunderstore/thunderstore-api";

import "./Communities.css";

export const clientLoader = makeTeamSettingsTabLoader(
  "Communities",
  async (dapper, teamName) => ({
    communities: dapper.getTeamCommunities(teamName),
  })
);

const communityColumns = [
  { value: "Community", disableSort: false },
  { value: "Packages", disableSort: false },
  { value: "Downloads", disableSort: false },
  { value: "Likes", disableSort: false },
  { value: "Public page", disableSort: true },
];

/**
 * Team settings tab listing the communities the team has packages in, each
 * linking to the team's public page in that community
 */
export default function Communities() {
  const { teamName, communities } = useLoaderData<typeof clientLoader>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={communities}>
        {(resolvedCommunities) => (
          <FormSections>
            <FormSection
              title="Communities"
              description="Communities this team has published packages in"
            >
              <CommunitiesTable
                communities={resolvedCommunities}
                teamName={teamName}
              />
            </FormSection>
          </FormSections>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * Table of the team's communities, or an empty state when there are none
 *
 * @param props.communities The communities the team has packages in
 * @param props.teamName The name of the team
 * @returns The rendered table or empty state
 */
function CommunitiesTable(props: {
  communities: TeamCommunity[];
  teamName: string;
}) {
  const { communities, teamName } = props;

  if (communities.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Icon>
          <FontAwesomeIcon icon={faGamepad} />
        </EmptyState.Icon>
        <EmptyState.Title>No communities</EmptyState.Title>
        <EmptyState.Message>
          This team has not published any packages yet.
        </EmptyState.Message>
      </EmptyState.Root>
    );
  }

  const tableData = communities.map((community) => [
    {
      value: (
        <div
          key={`name_${community.identifier}`}
          className="team-communities__community"
        >
          <Image
            src={community.community_icon_url}
            fallbackIcon={faGamepad}
            square
            alt=""
            intrinsicWidth={32}
            intrinsicHeight={32}
            rootClasses="team-communities__icon"
          />
          <span>{community.name}</span>
        </div>
      ),
      sortValue: community.name,
    },
    {
      value: (
        <span
          key={`count_${community.identifier}`}
          className="team-communities__count"
        >
          {community.package_count}
        </span>
      ),
      sortValue: community.package_count,
    },
    {
      value: (
        <span
          key={`downloads_${community.identifier}`}
          className="team-communities__count"
        >
          {formatInteger(community.download_count, "standard")}
        </span>
      ),
      sortValue: community.download_count,
    },
    {
      value: (
        <span
          key={`likes_${community.identifier}`}
          className="team-communities__count"
        >
          {formatInteger(community.rating_count, "standard")}
        </span>
      ),
      sortValue: community.rating_count,
    },
    {
      value: (
        <NewLink
          key={`link_${community.identifier}`}
          primitiveType="cyberstormLink"
          linkId="Team"
          community={community.identifier}
          team={teamName}
          csVariant="cyber"
        >
          View team page
        </NewLink>
      ),
      sortValue: 0,
    },
  ]);

  return (
    <NewTable
      titleRowContent={<Heading csLevel="3">Communities</Heading>}
      headers={communityColumns}
      rows={tableData}
      sortByHeader={0}
      sortDirection={NewTableSort.ASC}
    />
  );
}

CommunitiesTable.displayName = "CommunitiesTable";
