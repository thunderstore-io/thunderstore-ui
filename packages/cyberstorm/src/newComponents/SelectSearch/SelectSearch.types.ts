// SELECT SEARCH ROOT
// Modifiers
export const SelectSearchModifiersList = [
  "",
  "disabled",
  "ghost",
  "valid",
  "invalid",
] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type SelectSearchModifiers =
  | ""
  | "disabled"
  | "ghost"
  | "valid"
  | "invalid";
