import {
  fetchPrivateTeamDetails,
  fetchTeamCommunities,
  fetchTeamDetails,
  fetchTeamMembers,
  fetchTeamServiceAccounts,
  teamCreate,
} from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

export async function getTeamDetails(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamDetails({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function getPrivateTeamDetails(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchPrivateTeamDetails({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

/**
 * Get the communities a team has publicly visible packages in
 *
 * @param teamName The name of the team
 * @returns The team's communities with their package counts
 */
export async function getTeamCommunities(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamCommunities({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function getTeamMembers(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamMembers({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function getTeamServiceAccounts(
  this: DapperTsInterface,
  teamName: string
) {
  const data = await fetchTeamServiceAccounts({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function postTeamCreate(this: DapperTsInterface, name: string) {
  const data = await teamCreate({
    config: this.config,
    params: {},
    data: { name },
    queryParams: {},
  });

  return data;
}
