import { z } from "zod";

import { Dapper } from "../dapper";
import {
  getListOfIds,
  getPackagePreviewDummyData,
  PackagePreview,
} from "@thunderstore/cyberstorm";
import { packagePreviewSchema } from "../cyberstormSchemas/package";
import { QsArray } from "../queryString";

// Schema describing the data received from backend, used to validate the data.
const schema = z.array(packagePreviewSchema);

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackageListings = (
  communityId?: string,
  userId?: string,
  namespaceId?: string,
  teamId?: string,
  keywords?: string[],
  categories?: {
    [key: string]: {
      count: number;
      value: boolean | undefined;
    };
  }
) => Promise<PackagePreview[]>;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): PackagePreview[] =>
  viewData;

// Dummy Data function
// Method implementation for Dapper class.
async function dummyEndpoint(queryParams: QsArray) {
  const params: {
    [key: string]: string | string[] | number | number[] | boolean;
  } = {};
  queryParams.map((x) => {
    if (x.impotent) {
      params[x.key] = x.value ? x.value : x.impotent;
    } else {
      if (x.value) {
        params[x.key] = x.value;
      }
    }
  });

  const communityId = params["community_identifier"] as string | undefined;
  const namespaceId = params["namespace_identifier"] as string | undefined;
  const userId = params["user_identifier"] as string | undefined;
  const keywords = params["q"] as string[] | undefined;
  const includedCategories = params["included_categories"] as
    | string[]
    | undefined;
  const excludedCategories = params["excluded_categories"] as
    | string[]
    | undefined;

  const dummyPackagesPreviews = getListOfIds(20).map((seed) => {
    return getPackagePreviewDummyData(seed, communityId, userId, namespaceId);
  });

  // Simulate package filtering done by dapper/api calls in the future
  function filterFunc(x: PackagePreview) {
    if (
      communityId ||
      userId ||
      namespaceId ||
      keywords ||
      includedCategories ||
      excludedCategories
    ) {
      let passesCommunity = true;
      let passesUser = true;
      let passesNamespace = true;
      let passesKeywords = true;
      let passesIncludedCategories = true;
      let passesExcludedCategories = true;
      if (communityId) {
        if (x.community !== communityId) {
          passesCommunity = false;
        }
      }
      if (userId) {
        if (x.author !== userId) {
          passesUser = false;
        }
      }
      if (namespaceId) {
        if (x.namespace !== namespaceId) {
          passesNamespace = false;
        }
      }
      if (keywords && keywords.length > 0) {
        if (
          keywords.some(
            (e) =>
              x.name.toLowerCase().includes(e) ||
              // It actually checks against latest versions description, not the previews
              x.description?.toLowerCase().includes(e)
          )
        ) {
          passesKeywords = true;
        } else {
          passesKeywords = false;
        }
      }
      if (includedCategories && includedCategories.length > 0) {
        console.log(includedCategories);
        passesIncludedCategories = false;
        console.log(x.categories.map((x) => x.slug));
        if (
          includedCategories.every((slug) =>
            x.categories.map((x) => x.slug).includes(slug)
          )
        ) {
          passesIncludedCategories = true;
        }
      }
      if (excludedCategories && excludedCategories.length > 0) {
        x.categories.map((x) => {
          if (includedCategories.includes(x.slug)) {
            passesExcludedCategories = false;
          }
        });
      }
      console.log(
        passesCommunity,
        passesUser,
        passesNamespace,
        passesKeywords,
        passesIncludedCategories,
        passesExcludedCategories
      );
      return (
        passesCommunity &&
        passesUser &&
        passesNamespace &&
        passesKeywords &&
        passesIncludedCategories &&
        passesExcludedCategories
      );
    } else {
      return true;
    }
  }
  const promise = new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  await promise;

  return dummyPackagesPreviews.filter(filterFunc);
  // return dummyPackagesPreviews;
}

// Method implementation for Dapper class.
export const getPackageListings: GetPackageListings = async function (
  this: Dapper,
  communityId = undefined,
  userId = undefined,
  namespaceId = undefined,
  teamId = undefined,
  keywords = undefined,
  categories = undefined
) {
  const includedCategories: string[] = [];
  const excludedCategories: string[] = [];
  if (categories) {
    Object.keys(categories).forEach(function (key) {
      if (categories[key].value === true) {
        includedCategories.push(key);
      }
      if (
        categories[key].value === false &&
        categories[key].value !== undefined
      ) {
        excludedCategories.push(key);
      }
    });
  }

  const queryParams = [
    { key: "community_identifier", value: communityId },
    { key: "namespace_identifier", value: namespaceId },
    { key: "team_identifier", value: teamId },
    { key: "user_identifier", value: userId },
    { key: "package_identifier", value: undefined },
    { key: "deprecated", value: undefined, impotent: false },
    { key: "nsfw", value: undefined, impotent: false },
    { key: "included_categories", value: includedCategories },
    { key: "excluded_categories", value: excludedCategories },
    { key: "section", value: undefined },
    { key: "q", value: keywords },
    { key: "ordering", value: undefined, impotent: "last-updated" },
    { key: "page", value: undefined, impotent: 1 },
    { key: "page_size", value: undefined, impotent: 20 },
  ];

  return await this.dummyAndProcess(dummyEndpoint, queryParams, transform);
};
