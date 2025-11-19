import {
  fetchTeamDetails,
  fetchTeamMembers,
  fetchTeamServiceAccounts,
  teamCreate,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export function getTeamDetails(this: DapperTsInterface, teamName: string) {
  return fetchTeamDetails({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });
}

export function getTeamMembers(this: DapperTsInterface, teamName: string) {
  return fetchTeamMembers({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });
}

export function getTeamServiceAccounts(
  this: DapperTsInterface,
  teamName: string
) {
  return fetchTeamServiceAccounts({
    config: this.config,
    params: {
      team_name: teamName,
    },
    data: {},
    queryParams: {},
  });
}

export function postTeamCreate(this: DapperTsInterface, name: string) {
  return teamCreate({
    config: this.config,
    params: {},
    data: { name },
    queryParams: {},
  });
}
