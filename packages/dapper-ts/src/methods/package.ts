import { z } from "zod";

import {
  type PackageVersionDependenciesRequestQueryParams,
  fetchPackageChangelog,
  fetchPackagePermissions,
  fetchPackageReadme,
  fetchPackageSource,
  fetchPackageSubmissionStatus,
  fetchPackageVersionDependencies,
  fetchPackageVersions,
  fetchPackageWiki,
  fetchPackageWikiPage,
  postPackageSubmission,
} from "@thunderstore/thunderstore-api";

import { type DapperTsInterface } from "../index";

export async function getPackageChangelog(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  return fetchPackageChangelog({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });
}

export async function getPackageReadme(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  return fetchPackageReadme({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });
}

export async function getPackageSource(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  return fetchPackageSource({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });
}

export const versionsSchema = z
  .object({
    version_number: z.string().nonempty(),
    datetime_created: z.string().datetime(),
    download_count: z.number().int().gte(0),
    download_url: z.string().nonempty(),
    install_url: z.string().nonempty(),
  })
  .array();

export async function getPackageVersions(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string
) {
  return fetchPackageVersions({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });
}
export async function getPackageVersionDependencies(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber: string,
  page?: number
) {
  const options: PackageVersionDependenciesRequestQueryParams = [
    {
      key: "page",
      value: page,
      impotent: 1,
    },
  ];

  return fetchPackageVersionDependencies({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: options,
  });
}

export async function getPackageWiki(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string
) {
  return fetchPackageWiki({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });
}

export async function getPackageWikiPage(this: DapperTsInterface, id: string) {
  return fetchPackageWikiPage({
    config: this.config,
    params: {
      id,
    },
    data: {},
    queryParams: {},
  });
}

export async function postPackageSubmissionMetadata(
  this: DapperTsInterface,
  author_name: string,
  communities: string[],
  has_nsfw_content: boolean,
  upload_uuid: string,
  categories?: string[],
  community_categories?: { [key: string]: string[] }
) {
  return postPackageSubmission({
    config: this.config,
    params: {},
    data: {
      author_name,
      communities,
      has_nsfw_content,
      upload_uuid,
      categories,
      community_categories,
    },
    queryParams: {},
  });
}

export async function getPackageSubmissionStatus(
  this: DapperTsInterface,
  submissionId: string
) {
  return fetchPackageSubmissionStatus({
    config: this.config,
    params: {
      submission_id: submissionId,
    },
    data: {},
    queryParams: {},
  });
}

export async function getPackagePermissions(
  this: DapperTsInterface,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  return fetchPackagePermissions({
    config: this.config,
    params: {
      community_id: communityId,
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });
}
