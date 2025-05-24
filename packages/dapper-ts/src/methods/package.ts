import {
  fetchPackageChangelog,
  fetchPackageReadme,
  fetchPackageVersions,
  postPackageSubmission,
  fetchPackageSubmissionStatus,
  // ApiError,
} from "@thunderstore/thunderstore-api";
import { z } from "zod";

import { DapperTsInterface } from "../index";
// import { formatErrorMessage } from "../utils";

// const prerenderedMarkup = z.object({
//   html: z.string(),
// });

export async function getPackageChangelog(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageChangelog({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });
  // const parsed = prerenderedMarkup.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return data;
}

export async function getPackageReadme(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageReadme({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });
  // const parsed = prerenderedMarkup.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return data;
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
  const data = await fetchPackageVersions({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });
  // const parsed = versionsSchema.safeParse(data);

  // if (!parsed.success) {
  //   throw new Error(formatErrorMessage(parsed.error));
  // }

  return data;
}

// export const packageSubmissionResultSchema = z.object({
//   package_version: z.object({
//     namespace: z.string(),
//     name: z.string(),
//     version_number: z.string(),
//     full_name: z.string(),
//     description: z.string(),
//     icon: z.string(),
//     dependencies: z.array(z.string()),
//     download_url: z.string(),
//     downloads: z.number(),
//     date_created: z.string(),
//     website_url: z.string().nullable(),
//     is_active: z.boolean(),
//   }),
//   available_communities: z.array(
//     z.object({
//       community: z.object({
//         identifier: z.string(),
//         name: z.string(),
//         discord_url: z.string().nullable(),
//         wiki_url: z.string().nullable(),
//         require_package_listing_approval: z.boolean(),
//       }),
//       categories: z.array(z.object({ name: z.string(), slug: z.string() })),
//       url: z.string(),
//     })
//   ),
// });

// // This error schema is for the submission request itself, not for the task that is run in the background
// export const packageSubmissionErrorSchema = z.object({
//   upload_uuid: z.array(z.string()).optional(),
//   author_name: z.array(z.string()).optional(),
//   categories: z.array(z.string()).optional(),
//   communities: z.array(z.string()).optional(),
//   has_nsfw_content: z.array(z.string()).optional(),
//   detail: z.string().optional(),
//   file: z.array(z.string()).optional(),
//   team: z.array(z.string()).optional(),
//   __all__: z.array(z.string()).optional(),
// });

// export const packageSubmissionStatusSchema = z.object({
//   id: z.string().nonempty(),
//   status: z.string().nonempty(),
//   form_errors: packageSubmissionErrorSchema.nullable(),
//   task_error: z.boolean().nullable(),
//   result: packageSubmissionResultSchema.nullable(),
// });

// export type PackageSubmissionResponse =
//   | z.infer<typeof packageSubmissionStatusSchema>
//   | z.infer<typeof packageSubmissionErrorSchema>;

export async function postPackageSubmissionMetadata(
  this: DapperTsInterface,
  author_name: string,
  communities: string[],
  has_nsfw_content: boolean,
  upload_uuid: string,
  categories?: string[],
  community_categories?: { [key: string]: string[] }
) {
  const data = await postPackageSubmission({
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

  return data;
  // try {

  //   const parsed = packageSubmissionStatusSchema.safeParse(data);
  //   if (!parsed.success) {
  //     // Try to parse as PackageSubmissionError
  //     const errorParsed = packageSubmissionErrorSchema.safeParse(data);
  //     if (errorParsed.success) {
  //       return errorParsed.data;
  //     }

  //     // If not a PackageSubmissionError, wrap the error in __all__
  //     return {
  //       __all__: [formatErrorMessage(parsed.error)],
  //     };
  //   }

  //   return parsed.data;
  // } catch (error) {
  //   if (error instanceof ApiError) {
  //     const errorParsed = packageSubmissionErrorSchema.safeParse(
  //       error.responseJson
  //     );
  //     if (errorParsed.success) {
  //       return errorParsed.data;
  //     }
  //     return {
  //       __all__: [error.message],
  //     };
  //   }
  //   throw error;
  // }
}

export async function getPackageSubmissionStatus(
  this: DapperTsInterface,
  submissionId: string
) {
  const response = await fetchPackageSubmissionStatus({
    config: this.config,
    params: {
      submission_id: submissionId,
    },
    data: {},
    queryParams: {},
  });

  return response;
  // try {

  //   const parsed = packageSubmissionStatusSchema.safeParse(response);

  //   if (!parsed.success) {
  //     // Try to parse as PackageSubmissionError
  //     const errorParsed = packageSubmissionErrorSchema.safeParse(response);
  //     if (errorParsed.success) {
  //       return errorParsed.data;
  //     }

  //     // If not a PackageSubmissionError, wrap the error in __all__
  //     return {
  //       __all__: [formatErrorMessage(parsed.error)],
  //     };
  //   }

  //   return parsed.data;
  // } catch (error) {
  //   if (error instanceof ApiError) {
  //     const errorParsed = packageSubmissionErrorSchema.safeParse(
  //       error.responseJson
  //     );
  //     if (errorParsed.success) {
  //       return errorParsed.data;
  //     }
  //     return {
  //       __all__: [error.message],
  //     };
  //   }
  //   throw error;
  // }
}
