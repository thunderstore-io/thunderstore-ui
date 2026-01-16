import semverValid from "semver/functions/valid";

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (value as any)?.then === "function";
}

type ConfirmedSemverStringType = string;

export const isSemver = (s: string): s is ConfirmedSemverStringType => {
  return Boolean(semverValid(s));
};
