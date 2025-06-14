import {
  fetchTeamDetails,
  fetchTeamMembers,
  fetchTeamServiceAccounts,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

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
