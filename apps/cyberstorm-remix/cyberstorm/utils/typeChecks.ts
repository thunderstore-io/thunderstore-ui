import semverValid from "semver/functions/valid";

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(value: any): value is Promise<unknown> {
  return typeof value?.then === "function";
}

type ConfirmedSemverStringType = string;

export const isSemver = (s: string): s is ConfirmedSemverStringType => {
  return Boolean(semverValid(s));
};
