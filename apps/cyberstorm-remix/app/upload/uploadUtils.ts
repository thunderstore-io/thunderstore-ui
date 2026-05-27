import type { PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";

export interface CommunityOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export function buildCommunityOptions(
  communities: { identifier: string; name: string }[]
): CommunityOption[] {
  return communities.map((community) => ({
    value: community.identifier,
    label: community.name,
  }));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const initialUploadFormInputs: PackageSubmissionRequestData = {
  author_name: "",
  communities: [],
  has_nsfw_content: false,
  upload_uuid: "",
  categories: undefined,
  community_categories: undefined,
};

export type UploadFormFieldAction = {
  field: keyof PackageSubmissionRequestData;
  value: PackageSubmissionRequestData[keyof PackageSubmissionRequestData];
};

export function uploadFormFieldReducer(
  state: PackageSubmissionRequestData,
  action: UploadFormFieldAction | "reset"
): PackageSubmissionRequestData {
  if (action === "reset") {
    return initialUploadFormInputs;
  }

  return {
    ...state,
    [action.field]: action.value,
  };
}

export interface SubmissionErrorsBySection {
  uploadFile: string[];
  communities: string[];
  categories: string[];
  submit: string[];
}

function pushSubmissionErrorValue(out: string[], v: unknown) {
  if (v == null) return;
  if (typeof v === "string") {
    out.push(v);
    return;
  }
  if (Array.isArray(v)) {
    for (const e of v) pushSubmissionErrorValue(out, e);
    return;
  }
  if (typeof v === "object") {
    for (const val of Object.values(v as Record<string, unknown>)) {
      pushSubmissionErrorValue(out, val);
    }
  }
}

export function getSubmissionErrorMessages(formErrors: unknown): string[] {
  if (!formErrors) return [];

  const out: string[] = [];
  pushSubmissionErrorValue(out, formErrors);
  return Array.from(new Set(out));
}

export function getSubmissionErrorsBySection(
  messages: string[]
): SubmissionErrorsBySection {
  const normalized = messages.map((m) => m.trim()).filter(Boolean);
  const take = (pred: (m: string) => boolean) => normalized.filter(pred);

  const uploadFile = take((m) => {
    const s = m.toLowerCase();
    return (
      s.includes("manifest.json") ||
      s.includes("icon.png") ||
      s.includes("readme") ||
      s.includes("changelog") ||
      s.includes("zip") ||
      s.includes("file")
    );
  });

  const communities = take((m) => {
    const s = m.toLowerCase();
    return s.includes("community") || s.includes("communities");
  });

  const categories = take((m) => {
    const s = m.toLowerCase();
    return s.includes("category") || s.includes("categories");
  });

  const used = new Set([...uploadFile, ...communities, ...categories]);
  const submit = normalized.filter((m) => !used.has(m));

  return { uploadFile, communities, categories, submit };
}
