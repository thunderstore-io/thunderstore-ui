import {
  postPackageSubmission,
  fetchPackageSubmissionStatus,
} from "@thunderstore/thunderstore-api";

const packageSubmissionStatus = {
  id: "submission-id",
  status: "pending",
  form_errors: null,
  task_error: null,
  result: null,
};

export async function postFakePackageSubmissionMetadata(
  _author_name: string,
  _communities: string[],
  _has_nsfw_content: boolean,
  upload_uuid: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _categories?: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _community_categories?: { [key: string]: string[] }
): ReturnType<typeof postPackageSubmission> {
  return { ...packageSubmissionStatus, id: upload_uuid };
}

export async function getFakePackageSubmissionStatus(
  submissionId: string
): ReturnType<typeof fetchPackageSubmissionStatus> {
  return { ...packageSubmissionStatus, id: submissionId };
}
